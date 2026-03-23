export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  if (typeof window === 'undefined') {
    throw new Error('adminFetch can only be used in browser context');
  }
  const stored = localStorage.getItem('admin_user');
  if (!stored) {
    return fetch(url, options);
  }
  try {
    const creds = JSON.parse(stored);
    const auth = btoa(`${creds.email}:${creds.password}`);
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Basic ${auth}`,
      },
    });
  } catch {
    return fetch(url, options);
  }
}
