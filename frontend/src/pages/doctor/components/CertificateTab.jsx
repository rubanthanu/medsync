import { getMedicalProofUrl } from '../../../utils/fileUtils';

const CertificateTab = ({ certificates, selectedCert, rejectionReason, setSelectedCert, setRejectionReason, reviewing, onReview }) => {
    return (
        <>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom-0 p-4">
                    <h4 className="fw-bold mb-0 text-dark">Medical Certificate Requests</h4>
                </div>
                <div className="card-body p-0">
                    {certificates.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary">
                                    <tr>
                                        <th className="ps-4">Patient Name</th>
                                        <th>University ID</th>
                                        <th>Date Range</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.map(cert => (
                                        <tr key={cert.certificate_id}>
                                            <td className="ps-4 fw-semibold text-dark">{cert.patient_name}</td>
                                            <td className="text-muted">{cert.university_id}</td>
                                            <td className="text-dark small">{cert.start_date} to {cert.end_date}</td>
                                            <td className="text-muted small text-wrap" style={{ maxWidth: '250px' }}>{cert.reason}</td>
                                            <td>
                                                <span className={`badge bg-${cert.status === 'Pending' ? 'warning text-dark' : (cert.status === 'Approved' ? 'success' : 'danger')} rounded-pill px-3`}>
                                                    {cert.status}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                {cert.status === 'Pending' ? (
                                                    <button className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm" onClick={() => setSelectedCert(cert)}>
                                                        Review Request
                                                    </button>
                                                ) : (
                                                    <span className="text-muted small">Reviewed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-file-earmark-medical display-6"></i>
                            <p className="mt-2 mb-0">No certificate requests found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Medical Certificate Modal */}
            {selectedCert && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
                    <div className="card border-0 shadow-lg rounded-4 bg-white w-100" style={{ maxWidth: '650px' }}>
                        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold mb-0 text-dark">Review Medical Certificate</h4>
                            <button type="button" className="btn-close" onClick={() => { setSelectedCert(null); setRejectionReason(''); }}></button>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4 bg-light p-3 rounded-4 small">
                                <p className="mb-1"><strong>Patient:</strong> {selectedCert.patient_name} ({selectedCert.university_id})</p>
                                <p className="mb-1"><strong>Requested Leave Period:</strong> {selectedCert.start_date} to {selectedCert.end_date}</p>
                                <p className="mb-1"><strong>Reason for Leave:</strong> {selectedCert.reason}</p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">1. VERIFY PROOF FILE</label>
                                <a
                                    href={getMedicalProofUrl(selectedCert.proof_pdf)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-info d-block rounded-pill text-center py-2 shadow-sm text-decoration-none"
                                >
                                    <i className="bi bi-file-earmark-pdf me-2"></i> View Uploaded Proof Document <i className="bi bi-box-arrow-up-right ms-1"></i>
                                </a>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">2. ACTION & REJECTION REASON (IF REJECTING)</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill px-3"
                                    placeholder="Enter rejection reason only if rejecting..."
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => { setSelectedCert(null); setRejectionReason(''); }}>Cancel</button>
                                <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm" onClick={() => onReview('Rejected')} disabled={reviewing}>
                                    Reject Request
                                </button>
                                <button type="button" className="btn btn-success rounded-pill px-4 shadow-sm" onClick={() => onReview('Approved')} disabled={reviewing}>
                                    Approve Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CertificateTab;
