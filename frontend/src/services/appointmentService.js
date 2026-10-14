import api from '../api/axios';

export const getWindows = (date, forBooking = false) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (forBooking) params.append('for_booking', '1');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/appointment/get_windows${queryString}`);
};

export const bookAppointment = (window_id, appointment_date) => api.post('/appointment/book', { window_id, appointment_date });

export const cancelAppointment = (appointment_id) => api.post('/appointment/cancel', { appointment_id });

export const getPatientAppointments = () => api.get('/appointment/get_patient_appointments');

export const staffBook = (data) => api.post('/appointment/staff_book', data);
