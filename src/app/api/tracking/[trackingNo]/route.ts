export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { trackingNo: string } }) {

  const res = await fetch(`${API_BASE}/api/tracking/${params.trackingNo}`);
  const data = await res.json();
  return NextResponse.json(data);
}
