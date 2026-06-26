import api from '../api/axios';

export const getAll = () => api.get('/notification/get_all');

export const markRead = (notification_id) => api.post('/notification/mark_read', { notification_id });
