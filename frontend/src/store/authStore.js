import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Register failed' });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  }
}));

export default useAuthStore;
