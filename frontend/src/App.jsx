import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OTP from './pages/auth/OTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import CompleteProfile from './pages/patient/CompleteProfile';
import PatientDashboard from './pages/patient/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';

import Profile from './pages/auth/Profile';
import NotFound from './pages/NotFound';

import DoctorDashboard from './pages/doctor/Dashboard';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // or unauthorized page
  }

  // Patient Profile check
  if (user.role === 'Patient' && !user.profile_completed) {
    if (window.location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" />;
    }
  }

  return children;
};
function App() {

   const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
  return (
    <Router>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/verify-otp" element={<OTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
           
           {/* Patient Routes */}
          <Route path="/complete-profile" element={
            <PrivateRoute roles={['Patient']}>
              <CompleteProfile />
            </PrivateRoute>
          } />
          <Route path="/patient/dashboard" element={
            <PrivateRoute roles={['Patient']}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/book" element={
            <PrivateRoute roles={['Patient']}>
              <BookAppointment />
            </PrivateRoute>
          } />
           
           {/* Profile Route */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Doctor Route */}
          <Route path="/doctor/dashboard" element={
            <PrivateRoute roles={['Doctor']}>
              <DoctorDashboard />
            </PrivateRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

    </Router>
  );
}

export default App
