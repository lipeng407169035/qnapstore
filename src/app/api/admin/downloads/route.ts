export const dynamic = 'force-dynamic';
export async function GET() {
  const res = await fetch('http://localhost:3001/api/admin/downloads', { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function POST(req: Request) {
  const formData = await req.formData();
  const res = await fetch('http://localhost:3001/api/admin/downloads', { method: 'POST', body: formData });
  return Response.json(await res.json());
}
