export const dynamic = 'force-dynamic';
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`http://localhost:3001/api/admin/news/${params.id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3001/api/admin/news/${params.id}`, { method: 'DELETE' });
  return Response.json(await res.json());
}
