const WindowQueueTable = ({ windows, selectedWindow, onSelectWindow, queue, onUpdateStatus }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="bg-white p-3 border-bottom d-flex gap-2 overflow-auto scrollbar-hide">
                {windows.map(win => (
                    <button 
                        key={win.window_id} 
                        className={`btn rounded-4 px-4 text-nowrap flex-shrink-0 ${selectedWindow?.window_id === win.window_id ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => onSelectWindow(win)}
                    >
                        <div className="fw-bold">{win.window_name}</div>
                        <div className="x-small opacity-75">{win.start_time}-{win.end_time}</div>
                        <div className="badge bg-white text-primary mt-1">{win.booked_count || 0}</div>
                    </button>
                ))}
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Queue #</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queue.map(q => (
                                <tr key={q.appointment_id}>
                                    <td className="ps-4 fw-bold text-primary fs-5">#{q.queue_number}</td>
                                    <td>
                                        <div className="fw-bold">{q.patient_name}</div>
                                        <div className="text-muted small">{q.university_id || 'Student/Staff'}</div>
                                    </td>
                                    <td>
                                        <span className={`badge px-3 py-2 rounded-pill font-monospace ${
                                            q.appointment_status === 'Booked' ? 'bg-info-subtle text-info' : 
                                            q.appointment_status === 'Walk-In' ? 'bg-success-subtle text-success' : 
                                            q.appointment_status === 'Absent' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'
                                        }`}>
                                            {q.appointment_status}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        {q.appointment_status === 'Booked' && (
                                            <div className="btn-group gap-2">
                                                <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" onClick={() => onUpdateStatus(q.appointment_id, 'Walk-In')}>
                                                    <i className="bi bi-person-check-fill me-1"></i> Walk-In
                                                </button>
                                                <button className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" onClick={() => onUpdateStatus(q.appointment_id, 'Absent')}>
                                                    <i className="bi bi-person-x-fill me-1"></i> Absent
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {queue.length === 0 && (
                                <tr><td colSpan="4" className="text-center p-5 text-muted">No appointments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WindowQueueTable;