export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request, { params }: { params: { id: string } }) {

  const res = await fetch(`${API_BASE}/api/news/${params.id}`, { cache: 'no-store' });
  const data = await res.json();
  return Response.json(data);
}
