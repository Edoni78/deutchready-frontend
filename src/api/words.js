import api from './axios';

export const getWords = () => api.get('/api/words');
export const createWord = (data) => api.post('/api/words', data);
export const updateWord = (id, data) => api.put(`/api/words/${id}`, data);
export const deleteWord = (id) => api.delete(`/api/words/${id}`);
