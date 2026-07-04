const StatsCards = ({ stats }) => {
    return (
        <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm bg-primary text-white p-4 rounded-4">
                    <h6 className="opacity-75 text-uppercase fw-bold mb-1 small">Total Patients</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.total_patients}</h2>
                </div>
            </div>
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm bg-success text-white p-4 rounded-4">
                    <h6 className="opacity-75 text-uppercase fw-bold mb-1 small">Appointments</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.total_appointments}</h2>
                </div>
            </div>
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm bg-warning text-dark p-4 rounded-4">
                    <h6 className="opacity-75 text-uppercase fw-bold mb-1 small">Certificates</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.total_certificates}</h2>
                </div>
            </div>
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm bg-info text-white p-4 rounded-4">
                    <h6 className="opacity-75 text-uppercase fw-bold mb-1 small">Prescriptions</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.total_prescriptions}</h2>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
