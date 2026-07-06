const DashboardHeader = ({ activeTab, onTabChange }) => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
                <h2 className="fw-bold mb-0">Receptionist Dashboard</h2>
                <p className="text-muted mb-0">Manage daily queue and monitor clinic activities</p>
            </div>
            <div className="d-flex gap-2">
                <button 
                    className={`btn rounded-pill px-4 ${activeTab === 'queue' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onTabChange('queue')}
                >
                    <i className="bi bi-people-fill me-2"></i> Queue
                </button>
                <button 
                    className={`btn rounded-pill px-4 ${activeTab === 'mc' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onTabChange('mc')}
                >
                    <i className="bi bi-file-earmark-medical me-2"></i> MC Requests
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;