export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function POST(req: Request) {
  const formData = await req.formData();
  const res = await fetch(`${API_BASE}/api/admin/banners/upload`, {
    method: 'POST',
    headers: { 'Authorization': adminAuthHeader() },
    body: formData,
  });
  return Response.json(await res.json());
}
