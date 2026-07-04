import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../../assets/logo.png';



import medicalCenterImage from '../../assets/images/banners/medical-center.jpg';
import aboutMedsyncImage from '../../assets/images/banners/about-medsync.jpg';

const Landing = () => {
    

    useEffect(() => {

        // Handle direct url hash scroll
        if (window.location.hash) {
            const id = window.location.hash.replace('#', '');
            setTimeout(() => {g
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    }, []);

    return (
       
        <div className="container py-3 animate-fade-in" id="home">
            {/* Hero Section */}
            <div className="row align-items-center mb-5 min-vh-75 py-4">
                <div className="col-lg-6">
                    <img src={logo} alt="UWU MedSync Logo" height="60" className="mb-3" />
                    <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold ms-2">Smart University Healthcare</span>
                    <h1 className="display-4 fw-bold text-dark mb-4 leading-tight">
                        UWU MedSync Portal
                    </h1>
                    <p className="lead text-muted mb-4 fs-5">
                        Book appointments, track live queues, access e-prescriptions, and manage your university healthcare digitally — all in one integrated, campus-wide smart system.
                    </p>
                    <div className="d-flex gap-3">
                        <Link to="/register" className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm hover-grow">Get Started</Link>
                        <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 rounded-pill hover-grow">Login to Portal</Link>
                    </div>
                </div>
                <div className="col-lg-6 mt-5 mt-lg-0 text-center position-relative">
                    
                    <img src={medicalCenterImage} alt="Medical Center" className="img-fluid rounded-4 shadow-lg border border-light" style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            {/* Services Quick Grid */}
            <div className="row g-4 py-5 text-center" id="services">
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 hover-grow">
                        <div className="icon-box bg-primary-subtle text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-calendar-event fs-4"></i>
                        </div>
                        <h3 className="h5 fw-bold text-dark mb-3">Smart Appointments</h3>
                        <p className="text-muted small">Book your convenient time slot without standing in long queues at the medical center.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 hover-grow">
                        <div className="icon-box bg-success-subtle text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-hourglass-split fs-4"></i>
                        </div>
                        <h3 className="h5 fw-bold text-dark mb-3">Live Queue Tracking</h3>
                        <p className="text-muted small">Track your exact position in the queue real-time from anywhere on campus.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 hover-grow">
                        <div className="icon-box bg-warning-subtle text-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-file-earmark-medical fs-4"></i>
                        </div>
                        <h3 className="h5 fw-bold text-dark mb-3">e-Prescriptions</h3>
                        <p className="text-muted small">Access your digital prescriptions and treatment records instantly as secure PDFs.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4 hover-grow">
                        <div className="icon-box bg-danger-subtle text-danger rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-patch-check fs-4"></i>
                        </div>
                        <h3 className="h5 fw-bold text-dark mb-3">Digital MC</h3>
                        <p className="text-muted small">Request and download verified digital medical certificates (MC) without physical visits.</p>
                    </div>
                </div>
            </div>

            {/* About Us Section */}
            <div className="row align-items-center py-5 my-5 border-top border-bottom" id="about">
                <div className="col-lg-6 mb-4 mb-lg-0">
                    <img src={aboutMedsyncImage} alt="About MedSync" className="img-fluid rounded-4 shadow" style={{ maxHeight: '350px', width: '100%', objectFit: 'cover' }} />
                </div>
                <div className="col-lg-6 ps-lg-5">
                    <span className="badge bg-secondary-subtle text-secondary mb-3 px-3 py-2 rounded-pill fw-semibold">About UWU Medical</span>
                    <h2 className="fw-bold text-dark mb-3">Dedicated to Student Wellbeing</h2>
                    <p className="text-muted mb-4">
                        The Uva Wellassa University Medical Center provides high-quality healthcare services to our university community. With the launch of **UWU MedSync**, we are modernizing care delivery. Our digital portal bridges the gap between medical staff and students, minimizing wait times and ensuring health support is always within reach.
                    </p>
                    <div className="d-flex align-items-center gap-3 bg-light p-3 rounded-4 border-start border-primary border-4">
                        <i className="bi bi-clock-history text-primary fs-3"></i>
                        <div>
                            <h6 className="fw-bold mb-1">Standard Opening Hours</h6>
                            <p className="text-muted small mb-0">Monday – Friday: 8:00 AM – 5:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

           
           
        </div>
        
    );
};

export default Landing;
