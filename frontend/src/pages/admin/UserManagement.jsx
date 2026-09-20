import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { isPasswordValid } from '../../utils/passwordValidator';

const UserManagement = ({ users, showAddUser, setShowAddUser, newUser, setNewUser, onAddUser, onToggleStatus }) => {
    const passwordValid = isPasswordValid(newUser.password);

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-bottom-0 p-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                <h4 className="fw-bold mb-0 text-dark">User Management</h4>
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
                            {users.map(u => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
