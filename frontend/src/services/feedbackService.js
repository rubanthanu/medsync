import api from '../api/axios';

export const submit = (feedback_text) => api.post('/feedback/submit', { feedback_text });

export const getAll = () => api.get('/feedback/get_all');

export const deleteFeedback = (feedback_id) => api.delete(`/feedback/delete/${feedback_id}`);
