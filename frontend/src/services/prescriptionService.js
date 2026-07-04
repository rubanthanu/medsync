import api from '../api/axios';

export const getPatientPrescriptions = () => api.get('/prescription/get_patient_prescriptions');

export const getHistory = (patient_id) => api.get(`/prescription/get_history?patient_id=${patient_id}`);

export const create = (data) => api.post('/prescription/create', data);