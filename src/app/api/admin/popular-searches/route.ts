export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/admin/popular-searches`, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const res = await fetch(`${API_BASE}/api/admin/popular-searches`, {
    method: 'PUT',
    headers: { 'Authorization': adminAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
