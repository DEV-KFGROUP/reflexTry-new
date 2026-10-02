import { TOOL_MAPPING, TOOL_COUNT } from "@/config/tool-mapping";
import { SEO_CONFIGS } from "@/config/seo-config";
import { getBaseUrl } from "@/lib/base-url";
import { getAllContent } from "@/lib/content/loader";
import type { Article } from "@/lib/content/types";

export async function getDiscoveryText(full = false) {
    const base = getBaseUrl();
    const lines = [
        '# Reflextry', '',
        `> ${TOOL_COUNT} free browser-based practice tests for reaction time, memory, speed, accuracy, and aim.`, '',
        'Published language: English. Scores describe performance in each exercise, including device and browser effects. These are not clinical assessments or validated measures of intelligence.',
        'Reflextry does not publish a verified global benchmark dataset. /statistics is a personal progress dashboard, not a public source of population norms.', '',
        '## Tests', '',
    ];
    const seen = new Set<string>();
    for (const [id, path] of Object.entries(TOOL_MAPPING)) {
        if (seen.has(path)) continue;
        seen.add(path);
        const config = SEO_CONFIGS[id as keyof typeof SEO_CONFIGS];
        if (!config) throw new Error(`Missing SEO configuration: ${id}`);
        const title = config.title.replace(/\s*\|\s*Reflextry$/, '');
        lines.push(`- [${title}](${base}${path}): ${config.description}`);
        if (full) lines.push(`  Category: ${path.split('/')[1]}. See the page for controls, scoring, and limitations.`);
    }
    lines.push('', '## Methodology and information', '',
        `- [Testing methodology](${base}/methodology)`,
        `- [Research and limitations](${base}/science)`,
        `- [About the project](${base}/about)`,
        `- [All tests](${base}/tools)`, '', '## Guides', '');
    for (const { slug, meta } of await getAllContent<Article>('blog')) {
        lines.push(`- [${meta.title}](${base}/blog/${slug})${full ? `: ${meta.description}` : ''}`);
    }
    return lines.join('\n') + '\n';
}

export const DISCOVERY_HEADERS = { 'Content-Type': 'text/plain; charset=utf-8' };
