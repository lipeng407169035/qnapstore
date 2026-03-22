export const dynamic = 'force-dynamic';
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3001/api/news/${params.id}`, { cache: 'no-store' });
  const data = await res.json();
  return Response.json(data);
}
