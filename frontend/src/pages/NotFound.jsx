import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container py-4 py-md-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 text-center">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white">
                        <i className="bi bi-exclamation-triangle display-1 text-warning mb-4"></i>
                        <h1 className="display-4 fw-bold text-dark mb-3">404</h1>
                        <h4 className="fw-semibold text-secondary mb-3">Page Not Found</h4>
                        <p className="text-muted mb-4">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <Link to="/" className="btn btn-primary rounded-pill px-4 px-sm-5 py-2 shadow-sm fw-semibold">
                            <i className="bi bi-house-door me-2"></i> Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
