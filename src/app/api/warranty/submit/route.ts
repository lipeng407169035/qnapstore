export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch('http://localhost:3001/api/warranty/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return Response.json(await res.json());
}
