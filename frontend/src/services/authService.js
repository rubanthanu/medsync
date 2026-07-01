import api from '../api/axios';

export const getMe = () => api.get('/auth/me');

export const login = (email, password) => api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const register = (data) => api.post('/auth/register', data);

export const verifyOtp = (email, otp) => api.post('/auth/verify_otp', { email, otp });

export const resendOtp = (email, type) => api.post('/auth/resend_otp', { email, type });

export const forgotPassword = (email) => api.post('/auth/forgot_password', { email });

export const verifyForgotPasswordOtp = (email, otp) => api.post('/auth/verify_forgot_password_otp', { email, otp });

export const resetPassword = (email, otp, new_password) => api.post('/auth/reset_password', { email, otp, new_password });

export const changePassword = (current_password, new_password) => api.post('/auth/change_password', { current_password, new_password });
