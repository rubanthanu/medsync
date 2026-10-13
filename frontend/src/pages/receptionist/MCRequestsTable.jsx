import { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

const MCRequestsTable = ({ mcRequests }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        if (!mcRequests) return [];
        const q = search.toLowerCase().trim();
        return mcRequests.filter(mc => {
            const matchSearch = !q || (
                mc.patient_name?.toLowerCase().includes(q) ||
                mc.patient_email?.toLowerCase().includes(q) ||
                mc.reason?.toLowerCase().includes(q)
            );
            const matchDate = !dateFilter || (
                mc.start_date <= dateFilter && mc.end_date >= dateFilter
            );
            const matchStatus = !statusFilter || mc.status === statusFilter;
            return matchSearch && matchDate && matchStatus;
        });
    }, [mcRequests, search, dateFilter, statusFilter]);

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;
    const remaining = filtered.length - visibleCount;

    const handleClearFilters = () => {
        setSearch('');
        setDateFilter('');
        setStatusFilter('');
        setVisibleCount(PAGE_SIZE);
    };

    const hasActiveFilters = search || dateFilter || statusFilter;

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Header */}
            <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                        <h5 className="fw-bold mb-0">Medical Certificate Requests</h5>
                        <p className="text-muted small mb-0">
                            {filtered.length} of {mcRequests?.length ?? 0} requests
                        </p>
                    </div>
                    {hasActiveFilters && (
                        <button
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                            onClick={handleClearFilters}
                        >
                            <i className="bi bi-x-circle me-1"></i> Clear Filters
                        </button>
                    )}
                </div>

                {/* Filter Row */}
                <div className="row g-2">
                    {/* Search: name / email / reason */}
                    <div className="col-12 col-sm-5">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light border-0 text-muted">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                placeholder="Search by name, email or reason…"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                            />
                        </div>
                    </div>

                    {/* Date filter */}
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

                    {/* Status filter */}
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
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Patient</th>
                                <th>Email</th>
                                <th>Reason</th>
                                <th>Period</th>
                                <th className="text-end pe-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(mc => (
                                <tr key={mc.certificate_id}>
                                    <td className="ps-4">
                                        <div className="fw-bold">{mc.patient_name}</div>
                                    </td>
                                    <td className="text-muted small">{mc.patient_email}</td>
                                    <td className="small" style={{ maxWidth: 160 }}>
                                        <span className="text-truncate d-block" style={{ maxWidth: 150 }} title={mc.reason}>
                                            {mc.reason}
                                        </span>
                                    </td>
                                    <td className="small text-nowrap">
                                        {mc.start_date} <span className="text-muted">→</span> {mc.end_date}
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
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-5 text-muted">
                                        <i className="bi bi-inbox display-6 d-block mb-2"></i>
                                        No MC requests match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Show More / Show Less footer */}
            {filtered.length > PAGE_SIZE && (
                <div className="card-footer bg-white border-0 text-center py-3">
                    {hasMore ? (
                        <button
                            className="btn btn-outline-primary rounded-pill px-4 btn-sm"
                            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        >
                            <i className="bi bi-chevron-down me-1"></i>
                            Show More ({remaining} remaining)
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                            onClick={() => setVisibleCount(PAGE_SIZE)}
                        >
                            <i className="bi bi-chevron-up me-1"></i>
                            Show Less
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MCRequestsTable;

