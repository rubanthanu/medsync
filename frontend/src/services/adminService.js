import api from '../api/axios';

export const getStats = () => api.get('/admin/get_stats');

export const getUsers = () => api.get('/admin/get_users');

export const updateUserStatus = (user_id, status) => api.post('/admin/update_user_status', { user_id, status });

export const createUser = (data) => api.post('/admin/create_user', data);

export const getAppointmentWindows = () => api.get('/admin/get_appointment_windows');

export const updateWindowSlots = (window_id, max_slots) => api.post('/admin/update_window_slots', { window_id, max_slots: parseInt(max_slots) });


