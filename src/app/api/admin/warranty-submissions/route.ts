export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const url = status ? `http://localhost:3001/api/admin/warranty-submissions?status=${status}` : 'http://localhost:3001/api/admin/warranty-submissions';
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
