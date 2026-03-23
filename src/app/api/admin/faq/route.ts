export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/admin/faq`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  return Response.json(await res.json());
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/admin/faq`, {
    method: 'POST',
    headers: { 'Authorization': adminAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
