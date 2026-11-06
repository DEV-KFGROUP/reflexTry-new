#!/usr/bin/env node
/**
 * Bulk Google Indexing & Search Console URL Inspection CLI
 * 
 * Supports:
 *  1. Language-by-language URL generation & bulk submission (all 16 languages)
 *  2. Service Account (service_account.json) or OAuth 2.0 (oauth_credentials.json)
 *  3. Google Indexing API (URL_UPDATED / URL_DELETED)
 *  4. Google Search Console URL Inspection API (Index verdicts & crawl dates)
 *  5. Quota monitoring & detailed reporting
 * 
 * Zero external dependencies (uses Node.js native fetch, http, and crypto).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DEFAULT_BASE_URL = 'https://www.reflextry.com';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const INDEXING_METADATA_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications/metadata';
const INSPECTION_API_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const OAUTH_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const TOKEN_CACHE_FILE = path.join(ROOT_DIR, '.google-token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/indexing',
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', region: 'Global', isDefault: true },
  { code: 'es', name: 'Spanish', region: 'Spain & Latin America' },
  { code: 'pt', name: 'Portuguese', region: 'Brazil & Portugal' },
  { code: 'de', name: 'German', region: 'Germany' },
  { code: 'fr', name: 'French', region: 'France' },
  { code: 'ja', name: 'Japanese', region: 'Japan' },
  { code: 'ko', name: 'Korean', region: 'South Korea' },
  { code: 'ru', name: 'Russian', region: 'Russia' },
  { code: 'it', name: 'Italian', region: 'Italy' },
  { code: 'pl', name: 'Polish', region: 'Poland' },
  { code: 'tr', name: 'Turkish', region: 'Turkey' },
  { code: 'id', name: 'Indonesian', region: 'Indonesia' },
  { code: 'vi', name: 'Vietnamese', region: 'Vietnam' },
  { code: 'zh-CN', name: 'Simplified Chinese', region: 'China' },
  { code: 'zh-TW', name: 'Traditional Chinese', region: 'Taiwan' },
  { code: 'nl', name: 'Dutch', region: 'Netherlands' },
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(msg, color = '') {
  console.log(`${color}${msg}${colors.reset}`);
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {
    action: 'submit',
    type: 'URL_UPDATED',
    lang: null, // e.g. 'es' or 'en,es' or 'all'
    keyPath: null,
    sitemap: null,
    file: null,
    url: null,
    siteUrl: null,
    limit: 200,
    offset: 0,
    delay: 250,
    dryRun: false,
    authMode: 'auto',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h' || arg === 'help') {
      options.help = true;
    } else if (arg === 'languages' || arg === 'langs' || arg === '--list-languages') {
      options.action = 'languages';
    } else if (arg === 'submit' || arg === 'publish') {
      options.action = 'submit';
      options.type = 'URL_UPDATED';
    } else if (arg === 'delete' || arg === 'remove') {
      options.action = 'delete';
      options.type = 'URL_DELETED';
    } else if (arg === 'inspect') {
      options.action = 'inspect';
    } else if (arg === 'status') {
      options.action = 'status';
    } else if (arg.startsWith('--lang=')) {
      options.lang = arg.split('=')[1];
    } else if (arg === '--lang' || arg === '-l') {
      options.lang = args[++i];
    } else if (arg === '--oauth') {
      options.authMode = 'oauth';
    } else if (arg === '--service-account') {
      options.authMode = 'service-account';
    } else if (arg.startsWith('--action=')) {
      options.action = arg.split('=')[1];
    } else if (arg === '--action') {
      options.action = args[++i];
    } else if (arg.startsWith('--key=')) {
      options.keyPath = arg.split('=')[1];
    } else if (arg === '--key') {
      options.keyPath = args[++i];
    } else if (arg.startsWith('--sitemap=')) {
      options.sitemap = arg.split('=')[1];
    } else if (arg === '--sitemap') {
      options.sitemap = args[++i];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    } else if (arg === '--file') {
      options.file = args[++i];
    } else if (arg.startsWith('--url=')) {
      options.url = arg.split('=')[1];
    } else if (arg === '--url') {
      options.url = args[++i];
    } else if (arg.startsWith('--site-url=')) {
      options.siteUrl = arg.split('=')[1];
    } else if (arg === '--site-url') {
      options.siteUrl = args[++i];
    } else if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--limit') {
      options.limit = parseInt(args[++i], 10);
    } else if (arg.startsWith('--offset=')) {
      options.offset = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--offset') {
      options.offset = parseInt(args[++i], 10);
    } else if (arg.startsWith('--delay=')) {
      options.delay = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--delay') {
      options.delay = parseInt(args[++i], 10);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${colors.bright}${colors.cyan}Google Search Console & Indexing API Bulk CLI${colors.reset}

${colors.yellow}USAGE:${colors.reset}
  node scripts/bulk-indexing.mjs <action> [options]

${colors.yellow}ACTIONS:${colors.reset}
  ${colors.green}submit${colors.reset}     (default) Submit URLs to Google Indexing API (URL_UPDATED notification)
  ${colors.green}inspect${colors.reset}    Check real-time index status via Google Search Console URL Inspection API
  ${colors.green}status${colors.reset}     Check last Indexing API notification time for given URLs
  ${colors.green}languages${colors.reset}  List all 16 supported languages and URL counts
  ${colors.green}delete${colors.reset}     Notify Google that URLs have been removed (URL_DELETED notification)

${colors.yellow}LANGUAGE-BY-LANGUAGE SUBMISSION:${colors.reset}
  ${colors.cyan}--lang <code>${colors.reset}   Target a specific language (e.g. --lang=es)
  ${colors.cyan}--lang <c1,c2>${colors.reset}  Target multiple languages (e.g. --lang=en,es - 174 URLs, fits daily quota)
  ${colors.cyan}--lang all${colors.reset}      Generate URLs for all 16 languages (1,392 URLs total)

  ${colors.dim}Supported Language Codes:${colors.reset}
  en (English), es (Spanish), pt (Portuguese), de (German), fr (French), ja (Japanese),
  ko (Korean), ru (Russian), it (Italian), pl (Polish), tr (Turkish), id (Indonesian),
  vi (Vietnamese), zh-CN (Simplified Chinese), zh-TW (Traditional Chinese), nl (Dutch)

${colors.yellow}EXAMPLES:${colors.reset}
  # 1. View all languages and URL counts
  node scripts/bulk-indexing.mjs languages

  # 2. Submit only Spanish URLs (87 URLs, safely within 200 daily quota)
  node scripts/bulk-indexing.mjs submit --lang=es

  # 3. Submit English + Spanish together (174 URLs, perfect for 1 day's quota)
  node scripts/bulk-indexing.mjs submit --lang=en,es

  # 4. Dry-run test on German URLs without consuming Google quota
  node scripts/bulk-indexing.mjs submit --lang=de --dry-run

  # 5. Inspect Search Console indexing status for French URLs
  node scripts/bulk-indexing.mjs inspect --lang=fr
`);
}

function printLanguagesTable() {
  const routes = getBaseRoutePaths();
  const perLangCount = routes.length;
  const totalCount = perLangCount * SUPPORTED_LANGUAGES.length;

  log(`\n======================================================`, colors.bright);
  log(`🌐 SUPPORTED LANGUAGES FOR BULK INDEXING`, colors.cyan + colors.bright);
  log(`======================================================`, colors.bright);
  log(`Total Unique Pages per Language: ${perLangCount}`, colors.dim);
  log(`Total Across All 16 Languages:    ${totalCount}\n`, colors.dim);

  console.log(`${colors.bright}CODE      LANGUAGE               REGION                     URLS PER RUN${colors.reset}`);
  console.log(`${colors.dim}------------------------------------------------------------------------${colors.reset}`);
  for (const lang of SUPPORTED_LANGUAGES) {
    const isDef = lang.isDefault ? colors.green + ' (Default/Root)' : '';
    console.log(
      `${colors.cyan}${lang.code.padEnd(9)}${colors.reset} ` +
      `${lang.name.padEnd(22)} ` +
      `${lang.region.padEnd(26)} ` +
      `${perLangCount} URLs${isDef}${colors.reset}`
    );
  }
  console.log(`${colors.dim}------------------------------------------------------------------------${colors.reset}`);
  log(`\n💡 DAILY QUOTA STRATEGY:`, colors.yellow + colors.bright);
  log(`  Google's daily limit is 200 URLs.`);
  log(`  Each language has ~${perLangCount} URLs, so you can submit 2 full languages every day!`);
  log(`  Day 1: node scripts/bulk-indexing.mjs submit --lang=en,es`);
  log(`  Day 2: node scripts/bulk-indexing.mjs submit --lang=de,fr`);
  log(`  Day 3: node scripts/bulk-indexing.mjs submit --lang=pt,it`);
  log(`  Day 4: node scripts/bulk-indexing.mjs submit --lang=ja,ko`);
  log(`  Day 5: node scripts/bulk-indexing.mjs submit --lang=ru,pl`);
  log(`  Day 6: node scripts/bulk-indexing.mjs submit --lang=tr,id`);
  log(`  Day 7: node scripts/bulk-indexing.mjs submit --lang=vi,nl`);
  log(`  Day 8: node scripts/bulk-indexing.mjs submit --lang=zh-CN,zh-TW\n`);
}

/**
 * Base internal routes
 */
function getBaseRoutePaths() {
  const staticRoutes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/cookies',
    '/contact',
    '/blog',
    '/faq',
    '/science',
    '/methodology',
    '/training-programs',
    '/tools',
    '/leaderboard',
  ];

  const gameRoutes = [
    '/memory',
    '/memory/number',
    '/memory/sequence',
    '/memory/visual',
    '/memory/color',
    '/memory/shape',
    '/memory/symbol',
    '/memory/word-recall',
    '/memory/card-match',
    '/memory/chimp-test',
    '/memory/verbal-memory',
    '/memory/object-tracking',
    '/memory/n-back',
    '/reflex',
    '/reflex/reaction',
    '/reflex/sound',
    '/reflex/grid',
    '/reflex/peripheral',
    '/reflex/direction',
    '/reflex/multi-stimulus',
    '/reflex/sequence-reaction',
    '/reflex/whack-a-mole',
    '/reflex/color-switch',
    '/reflex/time-perception',
    '/reflex/go-no-go',
    '/reflex/flanker',
    '/reflex/choice-reaction',
    '/speed',
    '/speed/click',
    '/speed/typing',
    '/speed/math',
    '/speed/words',
    '/speed/grid',
    '/speed/number-rush',
    '/speed/quick-sort',
    '/speed/schulte-table',
    '/accuracy',
    '/accuracy/pattern-matching',
    '/accuracy/precision-click',
    '/accuracy/data',
    '/accuracy/image-recognition',
    '/accuracy/angle-estimation',
    '/accuracy/color-match',
    '/accuracy/color-blindness',
    '/accuracy/mental-rotation',
    '/gaming',
    '/gaming/aim',
    '/gaming/reaction',
    '/gaming/endless-dodge',
    '/gaming/stroop-drop',
    '/gaming/target-tracking',
    '/gaming/flick-shot',
    '/gaming/rhythm-tap',
  ];

  const blogRoutes = [];
  const contentDir = path.join(ROOT_DIR, 'content', 'blog');
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const slug = file.replace(/\.(md|mdx)$/, '');
        blogRoutes.push(`/blog/${slug}`);
      }
    }
  }

  return [...staticRoutes, ...gameRoutes, ...blogRoutes];
}

/**
 * Generate URLs for specific languages or all languages
 */
function getLocalizedProjectUrls(langFilter, baseUrl = DEFAULT_BASE_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const routes = getBaseRoutePaths();

  let targetLangs = [];
  if (!langFilter || langFilter === 'en') {
    targetLangs = [SUPPORTED_LANGUAGES.find(l => l.code === 'en')];
  } else if (langFilter === 'all') {
    targetLangs = SUPPORTED_LANGUAGES;
  } else {
    const requestedCodes = langFilter.split(',').map(s => s.trim().toLowerCase());
    targetLangs = SUPPORTED_LANGUAGES.filter(l => requestedCodes.includes(l.code.toLowerCase()));
    if (targetLangs.length === 0) {
      throw new Error(`Invalid language code(s): "${langFilter}". Run "node scripts/bulk-indexing.mjs languages" to see available codes.`);
    }
  }

  const urls = [];
  for (const lang of targetLangs) {
    for (const route of routes) {
      if (lang.isDefault) {
        urls.push(route === '' ? `${cleanBase}/` : `${cleanBase}${route}`);
      } else {
        urls.push(route === '' ? `${cleanBase}/${lang.code}` : `${cleanBase}/${lang.code}${route}`);
      }
    }
  }

  return { urls, languages: targetLangs };
}

/**
 * Service Account Loader
 */
function loadServiceAccount(customPath) {
  const possiblePaths = [
    customPath,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.join(ROOT_DIR, 'service_account.json'),
    path.join(ROOT_DIR, 'google-credentials.json'),
    path.join(ROOT_DIR, 'config', 'service_account.json'),
  ].filter(Boolean);

  for (const candidate of possiblePaths) {
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf-8');
        const json = JSON.parse(raw);
        if (json.type === 'service_account' && json.client_email && json.private_key) {
          return { key: json, path: candidate };
        }
      } catch {
        // ignore
      }
    }
  }

  return null;
}

/**
 * OAuth Credentials Loader
 */
function loadOAuthCredentials() {
  const candidates = [
    path.join(ROOT_DIR, 'oauth_credentials.json'),
    path.join(ROOT_DIR, 'client_secret.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf-8');
        const json = JSON.parse(raw);
        const creds = json.web || json.installed || json;
        if (creds.client_id && creds.client_secret) {
          return { creds, path: candidate };
        }
      } catch {
        // ignore
      }
    }
  }

  return null;
}

async function getServiceAccountAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: SCOPES.join(' '),
    aud: OAUTH_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const base64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${base64Url(header)}.${base64Url(claimSet)}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google OAuth token request failed (${res.status} ${res.statusText}):\n${errorText}`);
  }

  const tokenData = await res.json();
  return tokenData.access_token;
}

async function getOAuthAccessToken(oauthCreds) {
  const clientId = oauthCreds.client_id;
  const clientSecret = oauthCreds.client_secret;

  if (fs.existsSync(TOKEN_CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf-8'));
      const now = Date.now();
      if (cached.access_token && cached.expires_at && cached.expires_at > now + 60000) {
        return cached.access_token;
      }
      if (cached.refresh_token) {
        log('Refreshing expired OAuth access token...', colors.dim);
        const refreshRes = await fetch(OAUTH_TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: cached.refresh_token,
            grant_type: 'refresh_token',
          }),
        });

        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          const updatedCache = {
            ...cached,
            access_token: freshData.access_token,
            expires_at: Date.now() + (freshData.expires_in || 3600) * 1000,
          };
          fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(updatedCache, null, 2));
          log('✔ Access token refreshed!', colors.green);
          return freshData.access_token;
        }
      }
    } catch {
      // cache invalid
    }
  }

  const port = 8085;
  const redirectUri = `http://localhost:${port}/callback`;

  return new Promise((resolve, reject) => {
    let resolved = false;

    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, `http://localhost:${port}`);
        if (reqUrl.pathname !== '/callback') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const code = reqUrl.searchParams.get('code');
        const error = reqUrl.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h2>Authentication Failed</h2><p>${error}</p>`);
          server.close();
          resolved = true;
          reject(new Error(`OAuth denied: ${error}`));
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h2 style="color: #10b981;">✔ Authentication Successful!</h2>
                <p>Google Search Console & Indexing API authorized.</p>
                <p style="color: #6b7280;">You can close this tab and return to your terminal.</p>
              </body>
            </html>
          `);
          server.close();
          resolved = true;

          const tokenRes = await fetch(OAUTH_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code',
            }),
          });

          if (!tokenRes.ok) {
            const errBody = await tokenRes.text();
            reject(new Error(`Token exchange failed (${tokenRes.status}): ${errBody}`));
            return;
          }

          const tokenData = await tokenRes.json();
          const cacheData = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: Date.now() + (tokenData.expires_in || 3600) * 1000,
          };
          fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cacheData, null, 2));
          resolve(tokenData.access_token);
        }
      } catch (err) {
        if (!resolved) {
          resolved = true;
          server.close();
          reject(err);
        }
      }
    });

    server.listen(port, () => {
      const authUrl = new URL(OAUTH_AUTH_URL);
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', SCOPES.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      log(`\n======================================================`, colors.yellow);
      log(`🔑 ONE-TIME GOOGLE SIGN-IN REQUIRED`, colors.yellow + colors.bright);
      log(`======================================================`, colors.yellow);
      log(`1. Click or open this link in your browser:`, colors.cyan);
      console.log(`\n${authUrl.toString()}\n`);
      log(`2. Sign in with the Google Account that OWNS https://www.reflextry.com`, colors.green);
      log(`3. Grant permissions. You will be redirected back automatically.\n`, colors.dim);
      log(`Waiting for browser sign-in on http://localhost:${port}/callback...`, colors.dim);
    });

    server.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        reject(new Error(`Local server failed on port ${port}: ${err.message}`));
      }
    });
  });
}

async function getAuthToken(options) {
  const sa = loadServiceAccount(options.keyPath);
  const oauth = loadOAuthCredentials();

  if (options.authMode === 'service-account') {
    if (!sa) throw new Error('No service_account.json found.');
    log(`• Authenticating via Service Account (${sa.key.client_email})`, colors.blue);
    return getServiceAccountAccessToken(sa.key);
  }

  if (options.authMode === 'oauth') {
    if (!oauth) throw new Error('No oauth_credentials.json found.');
    log(`• Authenticating via OAuth 2.0 User Credentials`, colors.blue);
    return getOAuthAccessToken(oauth.creds);
  }

  // Auto: Prefer Service Account if service_account.json exists
  if (sa) {
    log(`• Using Service Account authentication (${sa.key.client_email})`, colors.blue);
    return getServiceAccountAccessToken(sa.key);
  }

  if (oauth) {
    log(`• Using OAuth 2.0 authentication (${oauth.path})`, colors.blue);
    return getOAuthAccessToken(oauth.creds);
  }

  throw new Error(`No credentials found! Put service_account.json or oauth_credentials.json in the project root.`);
}

async function parseSitemap(source) {
  let xmlContent = '';
  if (source.startsWith('http://') || source.startsWith('https://')) {
    log(`Fetching sitemap from: ${source}...`, colors.dim);
    const res = await fetch(source, { headers: { 'User-Agent': 'ReflexTry-BulkIndexing/1.0' } });
    if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
    xmlContent = await res.text();
  } else {
    const localPath = path.isAbsolute(source) ? source : path.join(ROOT_DIR, source);
    if (!fs.existsSync(localPath)) throw new Error(`Local sitemap not found: ${localPath}`);
    xmlContent = fs.readFileSync(localPath, 'utf-8');
  }

  if (xmlContent.includes('<sitemapindex')) {
    const subSitemaps = [...xmlContent.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1]);
    const allUrls = [];
    for (const sub of subSitemaps) {
      const urls = await parseSitemap(sub);
      allUrls.push(...urls);
    }
    return [...new Set(allUrls)];
  }

  const matches = [...xmlContent.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)];
  return [...new Set(matches.map(m => m[1].trim()))];
}

function loadUrlsFromFile(filePath) {
  const resolved = path.isAbsolute(filePath) ? filePath : path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(resolved)) throw new Error(`File does not exist: ${resolved}`);
  return fs.readFileSync(resolved, 'utf-8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
}

async function submitUrlToIndexingApi(url, type, accessToken) {
  const res = await fetch(INDEXING_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type }),
  });

  const bodyText = await res.text();
  let json = {};
  try { json = JSON.parse(bodyText); } catch { /* ignore */ }

  return { status: res.status, ok: res.ok, data: json, raw: bodyText };
}

async function inspectUrlInSearchConsole(inspectionUrl, siteUrl, accessToken) {
  const res = await fetch(INSPECTION_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });

  const bodyText = await res.text();
  let json = {};
  try { json = JSON.parse(bodyText); } catch { /* ignore */ }

  return { status: res.status, ok: res.ok, data: json, raw: bodyText };
}

async function checkIndexingMetadata(url, accessToken) {
  const target = `${INDEXING_METADATA_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const res = await fetch(target, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  const bodyText = await res.text();
  let json = {};
  try { json = JSON.parse(bodyText); } catch { /* ignore */ }

  return { status: res.status, ok: res.ok, data: json, raw: bodyText };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const options = parseCliArgs();

  if (options.help) {
    printHelp();
    return;
  }

  if (options.action === 'languages') {
    printLanguagesTable();
    return;
  }

  log(`\n======================================================`, colors.bright);
  log(`🚀 GOOGLE SEARCH CONSOLE & INDEXING API CLI`, colors.cyan + colors.bright);
  log(`======================================================\n`, colors.bright);

  // 1. Gather URLs
  let urls = [];
  let languageInfo = null;

  if (options.url) {
    urls = [options.url];
    log(`• Source: Single URL (${options.url})`, colors.blue);
  } else if (options.file) {
    urls = loadUrlsFromFile(options.file);
    log(`• Source: File [${options.file}] (${urls.length} URLs loaded)`, colors.blue);
  } else if (options.sitemap) {
    urls = await parseSitemap(options.sitemap);
    log(`• Source: Sitemap [${options.sitemap}] (${urls.length} URLs loaded)`, colors.blue);
  } else {
    // Local routes with language selection!
    const langSelection = options.lang || 'en';
    const localized = getLocalizedProjectUrls(langSelection);
    urls = localized.urls;
    languageInfo = localized.languages;

    const langNames = languageInfo.map(l => `${l.name} (${l.code})`).join(', ');
    log(`• Language Selection: ${langNames}`, colors.green + colors.bright);
    log(`• URLs Generated:     ${urls.length} pages`, colors.blue);
  }

  if (urls.length === 0) {
    log(`❌ No URLs found to process.`, colors.red);
    process.exit(1);
  }

  const originalCount = urls.length;
  if (options.offset > 0) urls = urls.slice(options.offset);
  if (urls.length > options.limit) urls = urls.slice(0, options.limit);

  log(`• Action:             ${options.action.toUpperCase()}`, colors.magenta);
  log(`• Processing:         ${urls.length} URLs (total pool: ${originalCount}, limit=${options.limit}, offset=${options.offset})`, colors.dim);
  if (urls.length <= 200) {
    log(`• Quota Check:        ✅ Within Google's daily 200 URL limit`, colors.green);
  } else {
    log(`• Quota Check:        ⚠️ Exceeds 200 limit (capped to ${options.limit})`, colors.yellow);
  }

  if (options.dryRun) {
    log(`• MODE:               DRY-RUN (Simulating only - no requests sent)\n`, colors.yellow + colors.bright);
  } else {
    log(`• Request delay:      ${options.delay}ms\n`, colors.dim);
  }

  // 2. Authenticate
  let accessToken = '';
  try {
    accessToken = await getAuthToken(options);
    log(`✔ Authentication token ready!\n`, colors.green);
  } catch (err) {
    log(`❌ Authentication failed: ${err.message}`, colors.red);
    process.exit(1);
  }

  if (options.dryRun) {
    log(`--- Planned URLs to process ---`, colors.cyan);
    urls.slice(0, 15).forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
    if (urls.length > 15) {
      console.log(`  ... and ${urls.length - 15} more URLs.`);
    }
    log(`\n✔ Dry-run complete. Credentials are valid! To execute live, remove --dry-run.`, colors.green);
    return;
  }

  // 3. Execute
  const results = [];
  let successCount = 0;
  let failCount = 0;
  const siteUrl = options.siteUrl || `${DEFAULT_BASE_URL}/`;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const indexTag = `[${i + 1}/${urls.length}]`;

    try {
      if (options.action === 'submit' || options.action === 'delete') {
        const res = await submitUrlToIndexingApi(url, options.type, accessToken);
        if (res.ok) {
          successCount++;
          const notifyTime = res.data?.urlNotificationMetadata?.latestUpdate?.notifyTime || 'OK';
          log(`${indexTag} ✔ ${res.status} ${options.type}: ${url} (${notifyTime})`, colors.green);
          results.push({ url, action: options.type, status: res.status, success: true, notifyTime });
        } else {
          failCount++;
          const errMsg = res.data?.error?.message || res.raw;
          log(`${indexTag} ✘ ${res.status} ${url} -> ${errMsg}`, colors.red);

          if (res.status === 403) {
            log(`    💡 TIP: Ensure service account is added as OWNER to Google Search Console property!`, colors.yellow);
          } else if (res.status === 429) {
            log(`    ⚠️ Quota reached (Google daily 200 URL limit). Stopping.`, colors.yellow);
            results.push({ url, action: options.type, status: res.status, success: false, error: errMsg });
            break;
          }
          results.push({ url, action: options.type, status: res.status, success: false, error: errMsg });
        }
      } else if (options.action === 'inspect') {
        const res = await inspectUrlInSearchConsole(url, siteUrl, accessToken);
        if (res.ok) {
          successCount++;
          const idx = res.data?.inspectionResult?.indexStatusResult || {};
          const verdict = idx.verdict || 'UNKNOWN';
          const coverage = idx.coverageState || 'No coverage state';
          const lastCrawl = idx.lastCrawlTime ? new Date(idx.lastCrawlTime).toLocaleDateString() : 'Never';

          const verdictColor = verdict === 'PASS' ? colors.green : colors.yellow;
          log(`${indexTag} ${verdictColor}[${verdict}]${colors.reset} ${url}`, colors.bright);
          log(`    Status: "${coverage}" | Last Crawl: ${lastCrawl}`, colors.dim);
          results.push({ url, action: 'INSPECT', status: res.status, success: true, verdict, coverage, lastCrawl });
        } else {
          failCount++;
          const errMsg = res.data?.error?.message || res.raw;
          log(`${indexTag} ✘ Inspect failed for ${url} -> ${errMsg}`, colors.red);
          results.push({ url, action: 'INSPECT', status: res.status, success: false, error: errMsg });
        }
      } else if (options.action === 'status') {
        const res = await checkIndexingMetadata(url, accessToken);
        if (res.ok) {
          successCount++;
          const latestUpdate = res.data?.latestUpdate?.notifyTime || 'Never';
          log(`${indexTag} ✔ ${url} | Updated: ${latestUpdate}`, colors.cyan);
          results.push({ url, action: 'STATUS', status: res.status, success: true, latestUpdate });
        } else {
          failCount++;
          const errMsg = res.data?.error?.message || res.raw;
          log(`${indexTag} ✘ Status failed for ${url} -> ${errMsg}`, colors.yellow);
          results.push({ url, action: 'STATUS', status: res.status, success: false, error: errMsg });
        }
      }

      if (i < urls.length - 1 && options.delay > 0) {
        await sleep(options.delay);
      }
    } catch (err) {
      failCount++;
      log(`${indexTag} ✘ Error on ${url}: ${err.message}`, colors.red);
      results.push({ url, action: options.action, success: false, error: err.message });
    }
  }

  // 4. Save Report
  const reportsDir = path.join(ROOT_DIR, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const langTag = options.lang ? `-${options.lang.replace(/,/g, '_')}` : '';
  const reportPath = path.join(reportsDir, `indexing-report${langTag}-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    action: options.action,
    languages: languageInfo ? languageInfo.map(l => l.code) : 'custom',
    total: urls.length,
    success: successCount,
    failed: failCount,
    results,
  }, null, 2));

  log(`\n================== SUMMARY ==================`, colors.bright);
  log(`Total URLs Processed: ${urls.length}`);
  log(`Successful:           ${successCount}`, colors.green);
  log(`Failed:               ${failCount}`, failCount > 0 ? colors.red : colors.dim);
  log(`Detailed Report:      ${reportPath}`, colors.cyan);
  log(`=============================================\n`, colors.bright);
}

main().catch(err => {
  log(`Fatal error: ${err.message}`, colors.red);
  process.exit(1);
});
