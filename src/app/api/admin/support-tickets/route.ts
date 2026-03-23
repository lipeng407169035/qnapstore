export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const url = status ? `${API_BASE}/api/admin/support-tickets?status=${status}` : `${API_BASE}/api/admin/support-tickets`;
  const res = await fetch(url, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  return Response.json(await res.json());
}
