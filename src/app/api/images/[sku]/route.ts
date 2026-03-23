export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET(req: Request, { params }: { params: { sku: string } }) {

  const res = await fetch(`${API_BASE}/api/images/${params.sku}`, { cache: 'no-store' });
  return Response.json(await res.json());
}
