import api from './axios';

export const getProgress = () => api.get('/api/user/progress');
export const getStreak = () => api.get('/api/user/streak');
export const getBadges = () => api.get('/api/user/badges');
export const getDashboard = () => api.get('/api/user/dashboard');
export const getAnalytics = () => api.get('/api/user/analytics');
export const getSubscription = () => api.get('/api/user/subscription');
