import { API_BASE } from '@/lib/api-base';
import { NextRequest } from 'next/server';

export async function proxyToAdmin(req: NextRequest, path: string, method?: string): Promise<Response> {
  const auth = Buffer.from('admin:admin123').toString('base64');
  const fetchOptions: RequestInit = {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  };
  if (method && method !== 'GET') {
    fetchOptions.method = method;
    const body = await req.text();
    fetchOptions.body = body;
  }
  return fetch(`${API_BASE}${path}`, fetchOptions);
}

export function adminAuthHeader(): string {
  return `Basic ${Buffer.from('admin:admin123').toString('base64')}`;
}
