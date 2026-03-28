export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function PUT(req: Request, { params }: { params: { sku: string } }) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}/order`, {
    method: 'PUT',
    headers: {
      'Authorization': adminAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
