import { getDiscoveryText, DISCOVERY_HEADERS } from '@/lib/discovery';
export const dynamic = 'force-static';
export async function GET() {
    return new Response(await getDiscoveryText(true), { headers: DISCOVERY_HEADERS });
}
