const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE = (RAW_API_BASE && RAW_API_BASE.trim().length > 0
  ? RAW_API_BASE.trim().replace(/\/+$/, '')
  : '/api');

function getToken(): string | null {
  return localStorage.getItem('access');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(Array.isArray(err.detail) ? err.detail[0] : err.detail || err.username?.[0] || err.email?.[0] || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    request<import('./types').AuthResponse>('/auth/signup/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  signin: (data: { username: string; password: string }) =>
    request<import('./types').AuthResponse>('/auth/signin/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  signout: (refresh: string) =>
    request<{ detail: string }>('/auth/signout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),
  forgotPassword: (email: string) =>
    request<{ detail: string }>('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (data: { uidb64: string; token: string; password: string; confirm_password: string }) =>
    request<{ detail: string }>('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Menu (public)
export const menuApi = {
  food: () => request<import('./types').MenuItem[]>('/menu/food/'),
  drinks: () => request<import('./types').MenuItem[]>('/menu/drinks/'),
  alcohol: () => request<import('./types').MenuItem[]>('/menu/alcohol/'),
  fastFood: () => request<import('./types').MenuItem[]>('/menu/fast-food/'),
};

// Place order (public)
export const ordersApi = {
  food: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/food/', { method: 'POST', body: JSON.stringify(data) }),
  drinks: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/drinks/', { method: 'POST', body: JSON.stringify(data) }),
  alcohol: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/alcohol/', { method: 'POST', body: JSON.stringify(data) }),
  fastFood: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/fast-food/', { method: 'POST', body: JSON.stringify(data) }),
};

// Admin
export const adminApi = {
  dashboard: () => request<import('./types').DashboardStats>('/admin/dashboard/'),
  chartData: () => request<import('./types').ChartData>('/admin/chart-data/'),
  orders: (category: string) =>
    request<import('./types').OrderRow[]>(`/admin/orders/${category}/`),
  menu: {
    food: {
      list: () => request<import('./types').MenuItem[]>('/admin/menu/food/'),
      add: (data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>('/admin/menu/food/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>(`/admin/menu/food/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) =>
        request<void>(`/admin/menu/food/${id}/`, { method: 'DELETE' }),
    },
    drinks: {
      list: () => request<import('./types').MenuItem[]>('/admin/menu/drinks/'),
      add: (data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>('/admin/menu/drinks/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>(`/admin/menu/drinks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) =>
        request<void>(`/admin/menu/drinks/${id}/`, { method: 'DELETE' }),
    },
    alcohol: {
      list: () => request<import('./types').MenuItem[]>('/admin/menu/alcohol/'),
      add: (data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>('/admin/menu/alcohol/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>(`/admin/menu/alcohol/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) =>
        request<void>(`/admin/menu/alcohol/${id}/`, { method: 'DELETE' }),
    },
    fastFood: {
      list: () => request<import('./types').MenuItem[]>('/admin/menu/fast-food/'),
      add: (data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>('/admin/menu/fast-food/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: Partial<import('./types').MenuItem>) =>
        request<import('./types').MenuItem>(`/admin/menu/fast-food/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) =>
        request<void>(`/admin/menu/fast-food/${id}/`, { method: 'DELETE' }),
    },
  },
};
