import { useState, useMemo } from 'react';
import { getMedicalProofUrl } from '../../../utils/fileUtils';

const PAGE_SIZE = 10;

const CertificateTab = ({ certificates, selectedCert, rejectionReason, setSelectedCert, setRejectionReason, reviewing, onReview }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        if (!certificates) return [];
        const q = search.toLowerCase().trim();
        return certificates.filter(cert => {
            const matchSearch = !q || (
                cert.patient_name?.toLowerCase().includes(q) ||
                cert.reason?.toLowerCase().includes(q)
            );
            const matchDate = !dateFilter || (
                cert.start_date <= dateFilter && cert.end_date >= dateFilter
            );
            const matchStatus = !statusFilter || cert.status === statusFilter;
            return matchSearch && matchDate && matchStatus;
        });
    }, [certificates, search, dateFilter, statusFilter]);

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;
    const remaining = filtered.length - visibleCount;
    const hasActiveFilters = search || dateFilter || statusFilter;

    const clearFilters = () => {
        setSearch(''); setDateFilter(''); setStatusFilter(''); setVisibleCount(PAGE_SIZE);
    };

    return (
        <>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {/* Header + Filters */}
                <div className="card-header bg-white border-bottom-0 p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                        <div>
                            <h4 className="fw-bold mb-0 text-dark">Medical Certificate Requests</h4>
                            <p className="text-muted small mb-0">
                                {filtered.length} of {certificates?.length ?? 0} requests
                            </p>
                        </div>
                        {hasActiveFilters && (
                            <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={clearFilters}>
                                <i className="bi bi-x-circle me-1"></i> Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filter Row */}
                    <div className="row g-2">
                        <div className="col-12 col-sm-5">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light border-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="Search by patient name or reason…"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light border-0 text-muted">
                                    <i className="bi bi-calendar3"></i>
                                </span>
                                <input
                                    type="date"
                                    className="form-control bg-light border-0"
                                    title="Filter by date within leave period"
                                    value={dateFilter}
                                    onChange={e => { setDateFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-sm-3">
                            <select
                                className="form-select form-select-sm bg-light border-0"
                                value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary">
                                <tr>
                                    <th className="ps-4">Patient Name</th>
                                    <th>Date Range</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th className="text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(cert => (
                                    <tr key={cert.certificate_id}>
                                        <td className="ps-4 fw-semibold text-dark">{cert.patient_name}</td>
                                        <td className="text-dark small text-nowrap">{cert.start_date} to {cert.end_date}</td>
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
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <i className="bi bi-inbox display-6 d-block mb-2"></i>
                                            No certificate requests match your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Show More / Show Less */}
                {filtered.length > PAGE_SIZE && (
                    <div className="card-footer bg-white border-0 text-center py-3">
                        {hasMore ? (
                            <button className="btn btn-outline-primary rounded-pill px-4 btn-sm" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
                                <i className="bi bi-chevron-down me-1"></i> Show More ({remaining} remaining)
                            </button>
                        ) : (
                            <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm" onClick={() => setVisibleCount(PAGE_SIZE)}>
                                <i className="bi bi-chevron-up me-1"></i> Show Less
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Review Medical Certificate Modal */}
            {selectedCert && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
                    <div className="card border-0 shadow-lg rounded-4 bg-white w-100 overflow-hidden" style={{ maxWidth: '650px', maxHeight: '90vh' }}>
                        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold mb-0 text-dark">Review Medical Certificate</h4>
                            <button type="button" className="btn-close" onClick={() => { setSelectedCert(null); setRejectionReason(''); }}></button>
                        </div>
                        <div className="card-body p-4 overflow-y-auto">
                            <div className="mb-4 bg-light p-3 rounded-4 small">
                                <p className="mb-1"><strong>Patient:</strong> {selectedCert.patient_name}</p>
                                <p className="mb-1"><strong>Requested Leave Period:</strong> {selectedCert.start_date} to {selectedCert.end_date}</p>
                                <p className="mb-1"><strong>Reason for Leave:</strong> {selectedCert.reason}</p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">1. VERIFY PROOF FILE</label>
                                <a
                                    href={getMedicalProofUrl(selectedCert.proof_document)}
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

                            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 border-top pt-3">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4 w-100 w-sm-auto" onClick={() => { setSelectedCert(null); setRejectionReason(''); }}>Cancel</button>
                                <button type="button" className="btn btn-danger rounded-pill px-4 shadow-sm w-100 w-sm-auto" onClick={() => onReview('Rejected')} disabled={reviewing}>
                                    Reject Request
                                </button>
                                <button type="button" className="btn btn-success rounded-pill px-4 shadow-sm w-100 w-sm-auto" onClick={() => onReview('Approved')} disabled={reviewing}>
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
