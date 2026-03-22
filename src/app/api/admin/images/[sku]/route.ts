export const dynamic = 'force-dynamic';
export async function GET(req: Request, { params }: { params: { sku: string } }) {
  const res = await fetch(`http://localhost:3001/api/admin/images/${params.sku}`, { cache: 'no-store' });
  return Response.json(await res.json());
}
export async function POST(req: Request, { params }: { params: { sku: string } }) {
  const formData = await req.formData();
  const res = await fetch(`http://localhost:3001/api/admin/images/${params.sku}`, {
    method: 'POST',
    body: formData,
  });
  return Response.json(await res.json());
}
