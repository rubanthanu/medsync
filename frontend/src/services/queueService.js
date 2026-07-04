import api from '../api/axios';

export const getQueue = (window_id) => api.get(`/queue/get_queue?window_id=${window_id}`);

export const startWindow = (window_id) => api.post('/queue/start_window', { window_id });

export const stopWindow = (window_id) => api.post('/queue/stop_window', { window_id });

export const nextPatient = (window_id) => api.post('/queue/next_patient', { window_id });

export const updateStatus = (appointment_id, status) => api.post('/queue/update_status', { appointment_id, status });
