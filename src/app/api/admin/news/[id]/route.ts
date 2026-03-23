export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/news/${params.id}`, {
    method: 'PUT',
    headers: { 'Authorization': adminAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE}/api/admin/news/${params.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': adminAuthHeader() },
  });
  return Response.json(await res.json());
}
