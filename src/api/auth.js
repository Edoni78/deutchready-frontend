import api from './axios';

export const register = (email, username, password, confirmPassword) =>
  api.post('/api/auth/register', { email, username, password, confirmPassword });

export const verify = (email, code) =>
  api.post('/api/auth/verify', { email, code });

export const resendCode = (email) =>
  api.post('/api/auth/resend-code', { email });

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const getMe = () => api.get('/api/auth/me');
