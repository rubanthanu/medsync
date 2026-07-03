import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Admin Dashboard</h2>
            <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">
                <i className="bi bi-person-gear me-2"></i> Edit Profile
            </Link>
        </div>
    );
};

export default AdminHeader;
