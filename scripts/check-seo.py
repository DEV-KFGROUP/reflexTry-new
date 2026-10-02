#!/usr/bin/env python3
"""Check rendered SEO contracts against a running production server.
Usage: python3 scripts/check-seo.py http://localhost:3100
Only fetches public sitemap pages and explicit public regression probes.
"""
import concurrent.futures
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3100').rstrip('/')
NS = '{http://www.sitemaps.org/schemas/sitemap/0.9}'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.h1 = 0
        self.canonicals = []
        self.languages = []
        self.robots = []
        self.descriptions = []
        self.text = []
        self.schemas = []
        self.hidden = 0
        self.in_title = False
        self.in_schema = False
        self.schema = ''
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1': self.h1 += 1
        if tag == 'title': self.in_title = True
        if tag in ('script', 'style'): self.hidden += 1
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.in_schema = True
            self.schema = ''
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'link' and a.get('hreflang'): self.languages.append(a['hreflang'])
        if tag == 'meta' and a.get('name') == 'robots': self.robots.append(a.get('content', ''))
        if tag == 'meta' and a.get('name') == 'description': self.descriptions.append(a.get('content', ''))
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag in ('script', 'style'): self.hidden = max(0, self.hidden - 1)
        if tag == 'script' and self.in_schema:
            self.schemas.append(json.loads(self.schema))
            self.in_schema = False
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_schema: self.schema += data
        if not self.hidden: self.text.append(data)

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None

opener = urllib.request.build_opener(NoRedirect)
def fetch(path):
    try: response = opener.open(BASE + path, timeout=30)
    except urllib.error.HTTPError as error: response = error
    return response.code, response.headers, response.read().decode('utf-8')

failures = []
def check(condition, message):
    if not condition: failures.append(message)

status, _, xml = fetch('/sitemap.xml')
check(status == 200, 'sitemap must return 200')
root = ET.fromstring(xml)
entries = root.findall(NS + 'url')
urls = [entry.find(NS + 'loc').text for entry in entries]
check(len(urls) == len(set(urls)), 'duplicate sitemap URLs')
for entry, url in zip(entries, urls):
    if '/blog/' not in url: check(entry.find(NS + 'lastmod') is None, 'invented non-blog lastmod: ' + url)

def inspect(url):
    path = urllib.parse.urlsplit(url).path or '/'
    status, _, body = fetch(path)
    page = Page()
    page.feed(body)
    return url, path, status, page

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    pages = list(pool.map(inspect, urls))
for url, path, status, page in pages:
    check(status == 200, f'{path}: HTTP {status}')
    check(page.h1 == 1, f'{path}: {page.h1} H1 elements')
    check(bool(page.title) and page.title.endswith(' | Reflextry') and page.title.count('| Reflextry') == 1, f'{path}: missing title or repeated brand')
    check(len(page.descriptions) == 1 and bool(page.descriptions[0]), f'{path}: missing/duplicate description')
    check(len(page.canonicals) == 1 and page.canonicals[0].rstrip('/') == url.rstrip('/'), f'{path}: incorrect canonical {page.canonicals}')
    check(not any('noindex' in r for r in page.robots), f'{path}: sitemap contains noindex page')
    check(set(page.languages) <= {'en', 'x-default'}, f'{path}: unpublished hreflang')
    visible = ' '.join(' '.join(page.text).split())
    for schema in page.schemas:
        check(schema.get('@type') != 'Dataset', f'{path}: unsupported dataset')
        if schema.get('@type') == 'FAQPage' and path in ('/', '/tools'):
            for question in schema['mainEntity']:
                for content in [question['name'], question['acceptedAnswer']['text']]:
                    check(' '.join(content.split()) in visible, f'{path}: FAQ markup not visible: {content[:60]}')

for language in ['en', 'es', 'de', 'fr', 'pt', 'ja']:
    for path in ['', '/reflex/reaction']:
        status, headers, _ = fetch('/' + language + path + '?audit=1')
        target = urllib.parse.urlsplit(headers.get('Location', ''))
        check(status == 308 and target.path == (path or '/') and target.query == 'audit=1', f'{language}{path}: wrong redirect')
for path in ['/statistics', '/achievements', '/challenges']:
    status, _, body = fetch(path)
    page = Page(); page.feed(body)
    check(status == 200 and any('noindex' in r for r in page.robots), f'{path}: personal page must stay noindex')
status, _, _ = fetch('/seo-regression-nonexistent-page')
check(status == 404, 'unknown URL must be 404')
for path in ['/llms.txt', '/llms-full.txt', '/ai.txt']:
    status, headers, body = fetch(path)
    check(status == 200 and 'text/plain' in headers.get('Content-Type', ''), path + ': invalid discovery response')
    check('1,450,000' not in body and '1.45M' not in body and 'Farnsworth' not in body, path + ': stale claims')
check('1,450,000' not in fetch('/')[2], 'homepage retains unsupported global data')

if failures:
    print('\n'.join(failures)); sys.exit(1)
print(f'PASS: {len(urls)} sitemap pages; metadata, headings, schema, redirects, discovery files, private-page indexing and 404 checks.')
