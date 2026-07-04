const AppointmentWindows = ({ windows, onUpdateMaxSlots }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 p-4">
                <h4 className="fw-bold mb-0 text-dark">Appointment Windows Management</h4>
                <p className="text-muted small mb-0">Set the maximum number of patients allowed for each time slot.</p>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-secondary">
                            <tr>
                                <th className="ps-4">Window Name</th>
                                <th>Time Schedule</th>
                                <th>Current Max Slots</th>
                                <th className="text-end pe-4">Update Slots</th>
                            </tr>
                        </thead>
                        <tbody>
                            {windows.map(win => (
                                <tr key={win.window_id}>
                                    <td className="ps-4 fw-bold">{win.window_name}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border rounded-pill px-3">
                                            {win.start_time.substring(0, 5)} - {win.end_time.substring(0, 5)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-people text-primary"></i>
                                            <span className="fw-bold fs-5">{win.max_slots}</span>
                                            <span className="text-muted small">patients</span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end align-items-center gap-2">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm rounded-pill px-3"
                                                style={{ width: '80px' }}
                                                defaultValue={win.max_slots}
                                                min="1"
                                                id={`slots-${win.window_id}`}
                                            />
                                            <button
                                                className="btn btn-sm btn-primary rounded-pill px-3"
                                                onClick={() => {
                                                    const val = document.getElementById(`slots-${win.window_id}`).value;
                                                    onUpdateMaxSlots(win.window_id, val);
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
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

export default AppointmentWindows;
