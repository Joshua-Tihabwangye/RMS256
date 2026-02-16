const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE = (RAW_API_BASE && RAW_API_BASE.trim().length > 0
  ? RAW_API_BASE.trim().replace(/\/+$/, '')
  : '/api');

function getToken(): string | null {
  return localStorage.getItem('access');
}

type RequestConfig = { useAuth?: boolean };

async function request<T>(
  path: string,
  options: RequestInit = {},
  config?: RequestConfig
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const useAuth = config?.useAuth !== false;
  const token = useAuth ? getToken() : null;
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

// Auth (signup/signin/forgot/reset are public; signout uses token)
export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    request<import('./types').AuthResponse>('/auth/signup/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
  signin: (data: { username: string; password: string }) =>
    request<import('./types').AuthResponse>('/auth/signin/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
  signout: (refresh: string) =>
    request<{ detail: string }>('/auth/signout/', { method: 'POST', body: JSON.stringify({ refresh }) }),
  forgotPassword: (email: string) =>
    request<{ detail: string }>('/auth/forgot-password/', { method: 'POST', body: JSON.stringify({ email }) }, { useAuth: false }),
  resetPassword: (data: { uidb64: string; token: string; password: string; confirm_password: string }) =>
    request<{ detail: string }>('/auth/reset-password/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
};

// Menu (public – do not send auth token so expired tokens don’t break menu load)
export const menuApi = {
  food: () => request<import('./types').MenuItem[]>('/menu/food/', {}, { useAuth: false }),
  drinks: () => request<import('./types').MenuItem[]>('/menu/drinks/', {}, { useAuth: false }),
  alcohol: () => request<import('./types').MenuItem[]>('/menu/alcohol/', {}, { useAuth: false }),
  fastFood: () => request<import('./types').MenuItem[]>('/menu/fast-food/', {}, { useAuth: false }),
};

// Place order (public – no auth required)
export const ordersApi = {
  food: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/food/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
  drinks: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/drinks/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
  alcohol: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/alcohol/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
  fastFood: (data: import('./types').PlaceOrderPayload) =>
    request<{ detail: string }>('/orders/fast-food/', { method: 'POST', body: JSON.stringify(data) }, { useAuth: false }),
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
