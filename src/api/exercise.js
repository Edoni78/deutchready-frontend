import api from './axios';

export const getExercise = (type, category) => {
  const params = type ? { type } : {};
  if (category) params.category = category;
  return api.get('/api/exercise', { params });
};
export const submitExercise = (data) => api.post('/api/exercise/submit', data);
