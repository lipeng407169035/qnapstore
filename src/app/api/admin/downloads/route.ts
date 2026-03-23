export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET() {

  const res = await fetch(`${API_BASE}/api/admin/downloads`, { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function POST(req: Request) {
  const formData = await req.formData();
  const res = await fetch(`${API_BASE}/api/admin/downloads`, { method: 'POST', body: formData });
  return Response.json(await res.json());
}
