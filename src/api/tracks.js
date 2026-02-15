import api from './axios';

export const getTracks = () => api.get('/api/tracks');
export const getTracksWithProgress = () => api.get('/api/tracks/progress');
export const completeLesson = (lessonId) => api.post('/api/tracks/complete-lesson', { lessonId });
