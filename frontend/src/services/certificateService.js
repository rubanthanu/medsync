import api from '../api/axios';

export const requestCertificate = (formData) => api.post('/certificate/request', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getPatientCertificates = () => api.get('/certificate/get_patient_certificates');

export const getCertificateRequests = () => api.get('/certificate/get_requests');

export const reviewCertificate = (data) => api.post('/certificate/review', data);
