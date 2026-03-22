export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  let url = 'http://localhost:3001/api/support/my-tickets';
  if (phone) url += `?phone=${phone}`;
  else if (email) url += `?email=${email}`;
  const res = await fetch(url, { cache: 'no-store' });
  return Response.json(await res.json());
}
