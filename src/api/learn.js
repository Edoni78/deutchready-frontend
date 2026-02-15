import api from './axios';

export const getTodayWords = () => api.get('/api/learn/today');
export const submitAnswer = (data) => api.post('/api/learn/answer', data);
