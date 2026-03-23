export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { NextResponse } from 'next/server';

export async function GET() {

  const res = await fetch(`${API_BASE}/api/admin/users`);
  const data = await res.json();
  return NextResponse.json(data);
}
