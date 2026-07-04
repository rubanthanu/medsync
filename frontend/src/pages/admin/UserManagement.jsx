const UserManagement = ({ users, showAddUser, setShowAddUser, newUser, setNewUser, onAddUser, onToggleStatus }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-bottom-0 p-4 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0 text-dark">User Management</h4>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowAddUser(!showAddUser)}>
                    <i className={`bi ${showAddUser ? 'bi-dash' : 'bi-plus-lg'} me-2`}></i> {showAddUser ? 'Close Form' : 'Add New User'}
                </button>
            </div>

            {showAddUser && (
                <div className="card-body bg-light border-bottom p-4">
                    <form onSubmit={onAddUser} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">FULL NAME</label>
                            <input type="text" className="form-control rounded-pill px-3" value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">EMAIL</label>
                            <input type="email" className="form-control rounded-pill px-3" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">PASSWORD</label>
                            <input type="password" className="form-control rounded-pill px-3" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">ROLE</label>
                            <select className="form-select rounded-pill px-3" value={newUser.role_id} onChange={e => setNewUser({ ...newUser, role_id: e.target.value })}>
                                <option value="4">Patient</option>
                                <option value="2">Doctor</option>
                                <option value="3">Receptionist</option>
                                <option value="1">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-success rounded-pill px-4 w-100">Create</button>
                        </div>
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
