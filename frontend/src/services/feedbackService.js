import api from '../api/axios';

export const submit = (feedback_text) => api.post('/feedback/submit', { feedback_text });

export const getAll = () => api.get('/feedback/get_all');
