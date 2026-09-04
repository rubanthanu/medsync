import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AdminPatients = () => {
    // Data state
    const [patients, setPatients] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter state
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Pagination & sort state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sort, setSort] = useState('created_at');
    const [order, setOrder] = useState('desc');

    // Applied filters (separate from live input to support Apply button)
    const [appliedFilters, setAppliedFilters] = useState({
        search: '', gender: '', status: '', blood_group: '', date_from: '', date_to: ''
    });

    // Detail modal state
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Debounce timer ref
    const [searchTimer, setSearchTimer] = useState(null);

    const fetchPatients = useCallback(async (overrides = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                ...appliedFilters,
                page,
                limit,
                sort,
                order,
                ...overrides,
            };
            const res = await adminService.getPatients(params);
            setPatients(res.data.patients || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.total_pages || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load patients. Please try again.');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, page, limit, sort, order]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    // Debounced search
    const handleSearchChange = (value) => {
        setSearch(value);
        if (searchTimer) clearTimeout(searchTimer);
        const timer = setTimeout(() => {
            setPage(1);
            setAppliedFilters(prev => ({ ...prev, search: value }));
        }, 300);
        setSearchTimer(timer);
    };

    const handleApplyFilters = () => {
        setPage(1);
        setAppliedFilters({
            search,
            gender,
            status,
            blood_group: bloodGroup,
            date_from: dateFrom,
            date_to: dateTo,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setGender('');
        setStatus('');
        setBloodGroup('');
        setDateFrom('');
        setDateTo('');
        setPage(1);
        setSort('created_at');
        setOrder('desc');
        setAppliedFilters({ search: '', gender: '', status: '', blood_group: '', date_from: '', date_to: '' });
    };

    const handleSort = (field) => {
        if (sort === field) {
            setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(field);
            setOrder('asc');
        }
        setPage(1);
    };

    const handleViewDetails = async (patientId) => {
        setDetailLoading(true);
        setSelectedPatient(null);
        try {
            const res = await adminService.getPatientDetails(patientId);
            setSelectedPatient(res.data);
        } catch (err) {
            setSelectedPatient(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusBadge = (accountStatus) => {
        const map = {
            'Active': 'bg-success',
            'Blocked': 'bg-danger',
            'Inactive': 'bg-secondary',
        };
        return map[accountStatus] || 'bg-secondary';
    };

    const SortIcon = ({ field }) => {
        if (sort !== field) return <i className="bi bi-chevron-expand text-muted ms-1 small"></i>;
        return order === 'asc'
            ? <i className="bi bi-chevron-up ms-1 small"></i>
            : <i className="bi bi-chevron-down ms-1 small"></i>;
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        return (
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                    </li>
                    {start > 1 && (
                        <>
                            <li className="page-item"><button className="page-link" onClick={() => setPage(1)}>1</button></li>
                            {start > 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                        </>
                    )}
                    {pages.map(p => (
                        <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                        </li>
                    ))}
                    {end < totalPages && (
                        <>
                            {end < totalPages - 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                            <li className="page-item"><button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button></li>
                        </>
                    )}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        );
    };

    const showFrom = total > 0 ? (page - 1) * limit + 1 : 0;
    const showTo = Math.min(page * limit, total);

    return (
        <>
            {/* Header */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold mb-1 text-dark">Patient Management</h4>
                            <p className="text-muted mb-0 small">View, search, filter and manage registered patients.</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fs-6">
                                <i className="bi bi-people-fill me-1"></i> Total Patients: <strong>{total}</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    {/* Search Bar */}
                    <div className="input-group input-group-lg mb-3">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Search patients by name, email, phone..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="row g-2 mb-3">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <select className="form-select form-select-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <select className="form-select form-select-sm" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                                <option value="">All Blood Groups</option>
                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From date" title="Registration date from" />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To date" title="Registration date to" />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2 d-flex gap-2">
                            <button className="btn btn-primary btn-sm flex-fill" onClick={handleApplyFilters}>
                                <i className="bi bi-funnel me-1"></i> Apply
                            </button>
                            <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={handleClearFilters}>
                                <i className="bi bi-x-circle me-1"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mt-3 mb-0">Loading patients...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <i className="bi bi-exclamation-triangle display-4 text-danger"></i>
                            <p className="text-danger mt-2 mb-3">{error}</p>
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={() => fetchPatients()}>
                                <i className="bi bi-arrow-clockwise me-1"></i> Retry
                            </button>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-people display-4 text-muted"></i>
                            <p className="text-muted mt-3 mb-0">No patients found matching your criteria.</p>
                            {(search || gender || status || bloodGroup || dateFrom || dateTo) && (
                                <button className="btn btn-outline-primary btn-sm rounded-pill px-4 mt-3" onClick={handleClearFilters}>
                                    <i className="bi bi-x-circle me-1"></i> Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Patient</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Gender</th>
                                            <th>Blood Group</th>
                                            <th>Status</th>
                                            <th>Registered</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map(p => (
                                            <tr key={p.patient_id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {p.profile_image ? (
                                                            <img src={p.profile_image} alt="" className="rounded-circle" width="36" height="36" style={{ objectFit: 'cover' }} />
                                                        ) : (
                                                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                                                                {getInitials(p.full_name)}
                                                            </div>
                                                        )}
                                                        <span className="fw-semibold text-dark">{p.full_name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{p.email || 'N/A'}</td>
                                                <td className="text-muted small">{p.phone || 'N/A'}</td>
                                                <td className="text-muted small">{p.gender || 'N/A'}</td>
                                                <td><span className={`badge ${p.blood_group ? 'bg-info bg-opacity-10 text-info' : 'bg-light text-muted'} rounded-pill`}>{p.blood_group || 'N/A'}</span></td>
                                                <td><span className={`badge ${getStatusBadge(p.account_status)} rounded-pill`}>{p.account_status}</span></td>
                                                <td className="text-muted small">{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                        onClick={() => handleViewDetails(p.patient_id)}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#patientDetailModal"
                                                    >
                                                        <i className="bi bi-eye me-1"></i> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 px-4 py-3 border-top">
                                <p className="text-muted small mb-0 text-center text-sm-start">
                                    Showing <strong>{showFrom}–{showTo}</strong> of <strong>{total}</strong> patients
                                </p>
                                {renderPagination()}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Patient Details Modal */}
            <div className="modal fade" id="patientDetailModal" tabIndex="-1" aria-labelledby="patientDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0 px-4 pt-4">
                            <h5 className="modal-title fw-bold" id="patientDetailModalLabel">
                                <i className="bi bi-person-badge me-2 text-primary"></i> Patient Details
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body px-4 pb-4">
                            {detailLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted mt-2">Loading patient details...</p>
                                </div>
                            ) : selectedPatient ? (
                                <>
                                    {/* Profile Header */}
                                    <div className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                                        {selectedPatient.profile_image ? (
                                            <img src={selectedPatient.profile_image} alt="" className="rounded-circle" width="56" height="56" style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
                                                {getInitials(selectedPatient.full_name)}
                                            </div>
                                        )}
                                        <div>
                                            <h5 className="fw-bold mb-0">{selectedPatient.full_name || 'N/A'}</h5>
                                            <p className="text-muted mb-0 small">{selectedPatient.email}</p>
                                        </div>
                                        <span className={`badge ${getStatusBadge(selectedPatient.account_status)} rounded-pill ms-auto`}>{selectedPatient.account_status}</span>
                                    </div>

                                    {/* Personal Information */}
                                    <div className="card border-0 bg-light rounded-4 mb-3">
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold text-primary mb-3"><i className="bi bi-person me-2"></i>Personal Information</h6>
                                            <div className="row g-3">
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Full Name</div>
                                                    <div className="fw-semibold">{selectedPatient.full_name || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Email</div>
                                                    <div className="fw-semibold">{selectedPatient.email || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Phone</div>
                                                    <div className="fw-semibold">{selectedPatient.phone || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Gender</div>
                                                    <div className="fw-semibold">{selectedPatient.gender || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Date of Birth</div>
                                                    <div className="fw-semibold">{selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Address</div>
                                                    <div className="fw-semibold">{selectedPatient.address || 'Not provided'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medical Information */}
                                    <div className="card border-0 bg-light rounded-4 mb-3">
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold text-success mb-3"><i className="bi bi-heart-pulse me-2"></i>Medical Information</h6>
                                            <div className="row g-3">
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Blood Group</div>
                                                    <div className="fw-semibold">{selectedPatient.blood_group || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Allergies</div>
                                                    <div className="fw-semibold">{selectedPatient.allergies || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="small text-muted">Medical Conditions</div>
                                                    <div className="fw-semibold">{selectedPatient.medical_conditions || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Emergency Contact Name</div>
                                                    <div className="fw-semibold">{selectedPatient.emergency_contact_name || 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <div className="small text-muted">Emergency Contact Phone</div>
                                                    <div className="fw-semibold">{selectedPatient.emergency_contact_phone || 'Not provided'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Information */}
                                    <div className="card border-0 bg-light rounded-4">
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold text-warning mb-3"><i className="bi bi-shield-check me-2"></i>Account Information</h6>
                                            <div className="row g-3">
                                                <div className="col-12 col-sm-4">
                                                    <div className="small text-muted">Status</div>
                                                    <div><span className={`badge ${getStatusBadge(selectedPatient.account_status)} rounded-pill`}>{selectedPatient.account_status}</span></div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="small text-muted">Registered Date</div>
                                                    <div className="fw-semibold">{selectedPatient.created_at ? new Date(selectedPatient.created_at).toLocaleString() : 'Not provided'}</div>
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <div className="small text-muted">Last Updated</div>
                                                    <div className="fw-semibold">{selectedPatient.updated_at ? new Date(selectedPatient.updated_at).toLocaleString() : 'Not provided'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-person-x display-4"></i>
                                    <p className="mt-2">Patient details not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPatients;
