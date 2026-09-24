import { useState } from 'react';
import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { isPasswordValid } from '../../utils/passwordValidator';

const USERS_PER_PAGE = 5;

const UserManagement = ({ users, showAddUser, setShowAddUser, newUser, setNewUser, onAddUser, onToggleStatus }) => {
    const [visibleCount, setVisibleCount] = useState(USERS_PER_PAGE);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const passwordValid = isPasswordValid(newUser.password);

    // Filter users based on search, role, and status
    const filteredUsers = (users || []).filter(u => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = !query ||
            u.full_name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            String(u.user_id).includes(query);

        const matchesRole = roleFilter === 'all' || u.role_name?.toLowerCase() === roleFilter.toLowerCase();
        const matchesStatus = statusFilter === 'all' || u.account_status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesRole && matchesStatus;
    });

    const isFiltered = searchQuery || roleFilter !== 'all' || statusFilter !== 'all';

    const handleResetFilters = () => {
        setSearchQuery('');
        setRoleFilter('all');
        setStatusFilter('all');
        setVisibleCount(USERS_PER_PAGE);
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-bottom-0 p-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                <div className="d-flex align-items-center gap-2">
                    <h4 className="fw-bold mb-0 text-dark">User Management</h4>
                    <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                    </span>
                </div>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm w-100 w-sm-auto" onClick={() => setShowAddUser(!showAddUser)}>
                    <i className={`bi ${showAddUser ? 'bi-dash' : 'bi-plus-lg'} me-2`}></i> {showAddUser ? 'Close Form' : 'Add New User'}
                </button>
            </div>

            {showAddUser && (
                <div className="card-body bg-light border-bottom p-4">
                    <form onSubmit={onAddUser} className="row g-3">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <label className="form-label small fw-bold">FULL NAME</label>
                            <input type="text" className="form-control rounded-pill px-3" value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} required />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <label className="form-label small fw-bold">EMAIL</label>
                            <input type="email" className="form-control rounded-pill px-3" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <PasswordInput
                                label="PASSWORD"
                                id="admin-new-user-password"
                                name="password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Min 8 chars, A-Z, a-z, 0-9, @$!%*?&"
                                required
                                autoComplete="new-password"
                                className="mb-0"
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-2">
                            <label className="form-label small fw-bold">ROLE</label>
                            <select className="form-select rounded-pill px-3" value={newUser.role_id} onChange={e => setNewUser({ ...newUser, role_id: e.target.value })}>
                                <option value="4">Patient</option>
                                <option value="2">Doctor</option>
                                <option value="3">Receptionist</option>
                            </select>
                        </div>
                        <div className="col-12 col-lg-1 d-flex align-items-end">
                            <button type="submit" className="btn btn-success rounded-pill px-3 w-100" disabled={!passwordValid}>Create</button>
                        </div>
                        {newUser.password && (
                            <div className="col-12 mt-2">
                                <PasswordStrengthIndicator password={newUser.password} />
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Filter Toolbar */}
            <div className="p-3 px-4 bg-light border-top border-bottom">
                <div className="row g-2 align-items-center">
                    {/* Search Input */}
                    <div className="col-12 col-md-5">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 rounded-end-pill pe-3"
                                placeholder="Search by name, email, or ID..."
                                value={searchQuery}
                                onChange={e => {
                                    setSearchQuery(e.target.value);
                                    setVisibleCount(USERS_PER_PAGE);
                                }}
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="col-6 col-md-3">
                        <select
                            className="form-select rounded-pill px-3"
                            value={roleFilter}
                            onChange={e => {
                                setRoleFilter(e.target.value);
                                setVisibleCount(USERS_PER_PAGE);
                            }}
                        >
                            <option value="all">All Roles</option>
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="col-6 col-md-2">
                        <select
                            className="form-select rounded-pill px-3"
                            value={statusFilter}
                            onChange={e => {
                                setStatusFilter(e.target.value);
                                setVisibleCount(USERS_PER_PAGE);
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Blocked">Blocked</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="col-12 col-md-2 d-flex justify-content-md-end">
                        {isFiltered && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-3 w-100"
                                onClick={handleResetFilters}
                            >
                                <i className="bi bi-x-circle me-1"></i> Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-secondary">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.slice(0, visibleCount).map(u => (
                                    <tr key={u.user_id}>
                                        <td className="ps-4 text-muted">#{u.user_id}</td>
                                        <td className="fw-semibold text-dark">{u.full_name}</td>
                                        <td className="text-muted">{u.email}</td>
                                        <td><span className="badge bg-secondary rounded-pill px-3">{u.role_name}</span></td>
                                        <td>
                                            <span className={`badge bg-${u.account_status === 'Active' ? 'success' : 'danger'} rounded-pill px-3`}>
                                                {u.account_status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            {u.role_name !== 'Admin' && (
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        className={`btn btn-sm ${u.account_status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-3`}
                                                        onClick={() => onToggleStatus(u.user_id, u.account_status)}
                                                    >
                                                        {u.account_status === 'Active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="bi bi-person-x display-6"></i>
                                        <p className="mt-2 mb-0">No users found matching your filter criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length > USERS_PER_PAGE && (
                    <div className="text-center py-3 border-top">
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-pill px-4"
                            onClick={() => setVisibleCount(prev =>
                                prev >= filteredUsers.length ? USERS_PER_PAGE : prev + USERS_PER_PAGE
                            )}
                        >
                            {visibleCount >= filteredUsers.length ? (
                                <><i className="bi bi-chevron-up me-2"></i>Show Less</>
                            ) : (
                                <><i className="bi bi-chevron-down me-2"></i>Show More ({filteredUsers.length - visibleCount} remaining)</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
