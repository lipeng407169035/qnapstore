export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/settings/rma-policy`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  return Response.json(await res.json());
}

export async function PUT(req: Request) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/settings/rma-policy`, {
    method: 'PUT',
    headers: { 'Authorization': adminAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
