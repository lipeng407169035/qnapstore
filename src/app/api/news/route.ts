export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const url = category ? `${API_BASE}/api/news?category=${category}` : `${API_BASE}/api/news`;
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
