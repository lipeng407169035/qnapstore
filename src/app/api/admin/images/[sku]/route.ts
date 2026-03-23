export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request, { params }: { params: { sku: string } }) {

  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}`, { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function POST(req: Request, { params }: { params: { sku: string } }) {
  const formData = await req.formData();
  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}`, {
    method: 'POST',
    body: formData,
  });
  return Response.json(await res.json());
}
