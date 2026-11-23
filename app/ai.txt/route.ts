import { getBaseUrl } from '@/lib/base-url';
import { TOOL_COUNT } from '@/config/tool-mapping';
import { DISCOVERY_HEADERS } from '@/lib/discovery';
import { AVAILABLE_LANGUAGES } from '@/lib/international-seo';
export const dynamic = 'force-static';
export function GET() {
    const base = getBaseUrl();
    return new Response([
        '# Reflextry site information',
        '# Crawler permissions are defined in robots.txt, not this informational file.',
        `Site-URL: ${base}`, `Sitemap: ${base}/sitemap.xml`,
        `LLM-Summary: ${base}/llms.txt`, `LLM-Full: ${base}/llms-full.txt`,
        `Languages: ${AVAILABLE_LANGUAGES.join(', ')}`,
        `Description: ${TOOL_COUNT} free browser-based cognitive benchmarks, millisecond reaction & memory tests, 9 Mensa logic & word puzzles (10,800+ levels), STEM physics labs, 3D WebGL simulations, classics (Wordle, Tetris, Chess), and study tools.`,
        `Puzzles-Hub: ${base}/puzzles`,
        `Methodology: ${base}/methodology`,
        'Data: No verified global benchmark dataset is published. Personal scores are not population norms or clinical assessments.',
        'Contact: support@reflextry.com', '',
    ].join('\n'), { headers: DISCOVERY_HEADERS });
}
