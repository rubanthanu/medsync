import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import logo from '../../assets/logo.png';
import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { isPasswordValid } from '../../utils/passwordValidator';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordValid = isPasswordValid(formData.password);
    const confirmMatch = formData.confirm_password.length > 0 && formData.password === formData.confirm_password;
    const confirmMismatch = formData.confirm_password.length > 0 && formData.password !== formData.confirm_password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!passwordValid) {
            return setError('Password does not meet the security requirements.');
        }

        if (formData.password !== formData.confirm_password) {
            return setError('Passwords do not match.');
        }

        setLoading(true);
        try {
            await authService.register(formData);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            if (err.response?.data?.requires_verification) {
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center animate-fade-in my-3 my-md-4">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card p-3 p-sm-5">
                        <div className="text-center mb-4">
                            <img src={logo} alt="UWU MedSync Logo" height="80" className="mb-3" />
                            <h2 className="fw-bold text-primary">Create Account</h2>
                            <p className="text-muted">Register for UWU MedSync using your University Email</p>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={formData.full_name} 
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">University Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    pattern=".*@(std\.)?uwu\.ac\.lk$"
                                    title="Please enter a valid @std.uwu.ac.lk or @uwu.ac.lk email address"
                                    required
                                />
                            </div>
                            
                            <PasswordInput
                                label="Password"
                                id="register-password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Create a strong password"
                                required
                                autoComplete="new-password"
                            />

                            <PasswordStrengthIndicator password={formData.password} />

                            <PasswordInput
                                label="Confirm Password"
                                id="register-confirm-password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                                placeholder="Re-enter your password"
                                required
                                error={confirmMismatch ? 'Passwords do not match.' : ''}
                                helperText={confirmMatch ? '✓ Passwords match' : ''}
                                autoComplete="new-password"
                            />

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 py-2 rounded-pill mb-3 mt-2" 
                                disabled={loading || !passwordValid || formData.password !== formData.confirm_password}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Registering Account...
                                    </>
                                ) : (
                                    'Register Account'
                                )}
                            </button>
                            <div className="text-center">
                                <span className="text-muted">Already have an account? </span>
                                <Link to="/login" className="text-primary text-decoration-none fw-semibold">Login here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register;
