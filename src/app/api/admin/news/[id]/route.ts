export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function PUT(req: Request, { params }: { params: { id: string } }) {

  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/news/${params.id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE}/api/admin/news/${params.id}`, { method: 'DELETE' });
  return Response.json(await res.json());
}
