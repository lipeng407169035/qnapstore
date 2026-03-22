export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { trackingNo: string } }) {
  const res = await fetch(`http://localhost:3001/api/tracking/${params.trackingNo}`);
  const data = await res.json();
  return NextResponse.json(data);
}
