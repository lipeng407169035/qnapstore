export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const url = status ? `${API_BASE}/api/admin/partnership-applications?status=${status}` : `${API_BASE}/api/admin/partnership-applications`;
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
