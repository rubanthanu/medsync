const AdminTabs = ({ activeTab, onTabChange }) => {
    return (
        <ul className="nav nav-pills mb-4 gap-2 bg-light p-2 rounded-4 d-flex flex-nowrap overflow-x-auto border-0 w-100 scrollbar-hide">
            <li className="nav-item">
                <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'users' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => onTabChange('users')}>
                    <i className="bi bi-people me-2"></i> User Management
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'posts' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => onTabChange('posts')}>
                    <i className="bi bi-journal-medical me-2"></i> Manage Health Posts
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'feedbacks' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => onTabChange('feedbacks')}>
                    <i className="bi bi-chat-left-heart me-2"></i> Patient Feedback
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'windows' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => onTabChange('windows')}>
                    <i className="bi bi-clock me-2"></i> Appointment Slots
                </button>
            </li>
        </ul>
    );
};

export default AdminTabs;
