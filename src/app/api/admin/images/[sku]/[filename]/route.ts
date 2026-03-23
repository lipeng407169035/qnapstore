export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function DELETE(req: Request, { params }: { params: { sku: string; filename: string } }) {

  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}/${params.filename}`, {
    method: 'DELETE',
  });
  return Response.json(await res.json());
}
