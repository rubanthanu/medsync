import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { isPasswordValid } from '../../utils/passwordValidator';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [step, setStep] = useState(1); // 1: OTP, 2: New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    if (!email) {
        navigate('/login');
        return null;
    }

    const passwordValid = isPasswordValid(newPassword);
    const confirmMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const confirmMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleResendOtp = async () => {
        setError('');
        setSuccess('');
        setResendLoading(true);
        try {
            await authService.resendOtp(email, 'Forgot Password');
            setSuccess('A new OTP has been sent to your email.');
            setResendCooldown(60);
            const timer = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.verifyForgotPasswordOtp(email, otp);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!passwordValid) {
            setError('Password does not meet all security requirements.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword, confirmPassword);
            setSuccess('Password reset successful! You can now login.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center animate-fade-in my-3 my-md-5">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card p-3 p-sm-5">
                        <div className="text-center mb-4">
                            <div className="bg-primary-subtle rounded-circle d-inline-flex p-3 mb-3">
                                <i className={`bi ${step === 1 ? 'bi-envelope-check' : 'bi-lock'} text-primary fs-2`}></i>
                            </div>
                            <h2 className="fw-bold text-dark">{step === 1 ? 'Verify OTP' : 'New Password'}</h2>
                            <p className="text-muted">
                                {step === 1
                                    ? `Enter the 6-digit code sent to ${email}`
                                    : 'Choose a strong password for your account'}
                            </p>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        {step === 1 ? (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center fw-bold"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        maxLength="6"
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                                <div className="text-center mt-3">
                                    <p className="text-muted mb-1" style={{fontSize: '0.9rem'}}>Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        className="btn btn-link text-primary fw-semibold p-0 text-decoration-none"
                                        onClick={handleResendOtp}
                                        disabled={resendLoading || resendCooldown > 0}
                                    >
                                        {resendLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `Resend OTP in ${resendCooldown}s`
                                        ) : (
                                            <>
                                                <i className="bi bi-arrow-clockwise me-1"></i>
                                                Resend OTP
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <PasswordInput
                                    label="New Password"
                                    id="reset-new-password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter strong new password"
                                    required
                                    autoComplete="new-password"
                                />

                                <PasswordStrengthIndicator password={newPassword} />

                                <PasswordInput
                                    label="Confirm Password"
                                    id="reset-confirm-password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your new password"
                                    required
                                    error={confirmMismatch ? 'Passwords do not match.' : ''}
                                    helperText={confirmMatch ? '✓ Passwords match' : ''}
                                    autoComplete="new-password"
                                    className="mb-4"
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 rounded-pill"
                                    disabled={loading || !passwordValid || newPassword !== confirmPassword}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;