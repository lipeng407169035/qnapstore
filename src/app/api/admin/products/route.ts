export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    method: 'POST',
    headers: { 'Authorization': adminAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
