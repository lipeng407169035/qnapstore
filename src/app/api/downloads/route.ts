export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const sku = searchParams.get('sku');
  const url = sku ? `${API_BASE}/api/downloads?sku=${sku}` : `${API_BASE}/api/downloads`;
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
