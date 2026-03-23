export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET() {

  const res = await fetch(`${API_BASE}/api/settings/rma-policy`, { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function PUT(req: Request) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/settings/rma-policy`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
