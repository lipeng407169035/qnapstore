export const dynamic = 'force-dynamic';
export async function GET() {
  const res = await fetch('http://localhost:3001/api/admin/settings/customer-service-info', { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function PUT(req: Request) {
  const body = await req.json();
  const res = await fetch('http://localhost:3001/api/admin/settings/customer-service-info', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
