export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function POST(req: Request) {

  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/warranty/submit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
