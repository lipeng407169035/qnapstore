export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { sku: string } }) {
  const res = await fetch(`http://localhost:3001/api/products/sku/${params.sku}`);
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = await res.json();
  return NextResponse.json(data);
}
