const MCRequestsTable = ({ mcRequests }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">Medical Certificate Requests</h5>
                <p className="text-muted small">View and monitor patient MC requests</p>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Patient</th>
                                <th>Reason</th>
                                <th>Period</th>
                                <th className="text-end pe-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mcRequests.map(mc => (
                                <tr key={mc.certificate_id}>
                                    <td className="ps-4">
                                        <div className="fw-bold">{mc.patient_name}</div>
                                        <div className="text-muted small">{mc.university_id}</div>
                                    </td>
                                    <td>{mc.reason}</td>
                                    <td className="small">
                                        {mc.start_date} to {mc.end_date}
                                    </td>
                                    <td className="text-end pe-4">
                                        <span className={`badge rounded-pill px-3 py-2 ${
                                            mc.status === 'Approved' ? 'bg-success' : 
                                            mc.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                                        }`}>
                                            {mc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {mcRequests.length === 0 && (
                                <tr><td colSpan="4" className="text-center p-5 text-muted">No MC requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MCRequestsTable;
