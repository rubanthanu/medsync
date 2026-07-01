import api from '../api/axios';

export const getProfile = () => api.get('/user/get_profile');

export const updateProfile = (formData) => api.post('/user/update_profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const completeProfile = (data) => api.post('/user/complete_profile', data);

export const getPatientDetails = (patient_id) => api.get(`/user/get_patient_details?patient_id=${patient_id}`);
