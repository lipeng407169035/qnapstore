export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function GET(req: Request, { params }: { params: { sku: string } }) {
  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  return Response.json(await res.json());
}

export async function POST(req: Request, { params }: { params: { sku: string } }) {
  const formData = await req.formData();
  const res = await fetch(`${API_BASE}/api/admin/images/${params.sku}`, {
    method: 'POST',
    headers: { 'Authorization': adminAuthHeader() },
    body: formData,
  });
  return Response.json(await res.json());
}
