export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  if (typeof window === 'undefined') {
    throw new Error('adminFetch can only be used in browser context');
  }
  const auth = btoa('admin:admin123');
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Basic ${auth}`,
    },
  });
}
