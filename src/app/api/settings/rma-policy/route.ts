export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
export async function GET() {

  const res = await fetch(`${API_BASE}/api/settings/rma-policy`, { cache: 'no-store' });
  return Response.json(await res.json());
}
