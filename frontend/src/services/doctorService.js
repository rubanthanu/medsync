import api from '../api/axios';

export const getLeaves = () => api.get('/doctor/get_leaves');

export const markLeave = (data) => api.post('/doctor/mark_leave', data);

export const deleteLeave = (leave_id) => api.post('/doctor/delete_leave', { leave_id });

