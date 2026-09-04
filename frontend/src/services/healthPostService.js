import api from '../api/axios';

export const getAll = () => api.get('/healthpost/get_all');

export const create = (data) => api.post('/healthpost/create', data);

export const deletePost = (post_id) => api.post('/healthpost/delete', { post_id });
