import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <div className="dashboard-hero d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
            <h2 className="fw-bold mb-0">Admin Dashboard</h2>
            <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4 shadow-sm w-100 w-sm-auto text-center">
                <i className="bi bi-person-gear me-2"></i> Edit Profile
            </Link>
        </div>
    );
};

export default AdminHeader;
