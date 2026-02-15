import api from './axios';

export const getDialogue = () => api.get('/api/dialogue');
export const submitDialogue = (dialogueId, answer) => api.post('/api/dialogue/submit', { dialogueId, answer });
