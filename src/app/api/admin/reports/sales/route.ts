export const dynamic = 'force-dynamic';
import { API_BASE } from '@/lib/api-base';
import { adminAuthHeader } from '@/lib/admin-proxy';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = query ? `${API_BASE}/api/admin/reports/sales?${query}` : `${API_BASE}/api/admin/reports/sales`;
  const res = await fetch(url, {
    headers: { 'Authorization': adminAuthHeader() },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
