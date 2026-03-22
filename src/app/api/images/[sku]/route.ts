export const dynamic = 'force-dynamic';
export async function GET(req: Request, { params }: { params: { sku: string } }) {
  const res = await fetch(`http://localhost:3001/api/images/${params.sku}`, { cache: 'no-store' });
  return Response.json(await res.json());
}
