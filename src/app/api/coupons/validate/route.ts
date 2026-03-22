export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = query ? `http://localhost:3001/api/coupons/validate?${query}` : 'http://localhost:3001/api/coupons/validate';
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
