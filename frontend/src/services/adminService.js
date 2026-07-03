import api from '../api/axios';

export const getStats = () => api.get('/admin/get_stats');



