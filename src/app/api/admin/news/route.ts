export const dynamic = 'force-dynamic';
export async function GET() {
  const res = await fetch('http://localhost:3001/api/admin/news', { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch('http://localhost:3001/api/admin/news', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
