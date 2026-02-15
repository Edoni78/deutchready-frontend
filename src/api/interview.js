import api from './axios';

export const startInterview = () => api.get('/api/interview/start');
export const submitInterview = (answers) => api.post('/api/interview/submit', { answers });
