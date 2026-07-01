import api from '../api/axios';

export const getWindows = (date) => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/appointment/get_windows${params}`);
};

export const bookAppointment = (window_id, appointment_date) => api.post('/appointment/book', { window_id, appointment_date });

export const cancelAppointment = (appointment_id) => api.post('/appointment/cancel', { appointment_id });

export const getPatientAppointments = () => api.get('/appointment/get_patient_appointments');

export const staffBook = (data) => api.post('/appointment/staff_book', data);
