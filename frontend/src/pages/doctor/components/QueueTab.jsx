import Swal from 'sweetalert2';

const QueueTab = ({ windows, selectedWindow, queue, onSelectWindow, onStartWindow, onStopWindow, onNextPatient, onOpenPrescription }) => {
    return (
        <div>
            {/* Today's Windows List */}
            <div className="row g-4 mb-5">
                {windows.map(win => (
                    <div className="col-md-6 col-lg-3" key={win.window_id} onClick={() => onSelectWindow(win)} role="button" tabIndex={0}>
                        <div className={`card h-100 border-0 shadow-sm rounded-4 ${win.is_active ? 'bg-primary text-white shadow' : 'bg-white'} ${selectedWindow?.window_id === win.window_id ? 'border border-2 border-primary' : ''}`}>
                            <div className="card-body p-4 text-center">
                                <h5 className="fw-bold">{win.window_name}</h5>
                                <p className={`small ${win.is_active ? 'text-white-50' : 'text-muted'}`}>
                                    {win.start_time} - {win.end_time}
                                </p>
                                {!win.is_active && (
                                    <button className="btn btn-outline-primary btn-sm rounded-pill mt-3 w-100" onClick={(e) => { e.stopPropagation(); onStartWindow(win.window_id); }}>
                                        Start Window
                                    </button>
                                )}
                                {win.is_active > 0 && (
                                    <>
                                        <div><span className="badge bg-light text-primary rounded-pill mt-3 px-3 fw-semibold">Ongoing</span></div>
                                        <button className="btn btn-outline-danger btn-sm rounded-pill mt-2 w-100" onClick={(e) => { e.stopPropagation(); onStopWindow(win.window_id); }}>
                                            Finish Window
                                        </button>
                                    </>
                                )}
                                <div className="mt-3 fs-5 fw-bold">
                                    {win.booked_count || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Queue Details */}
            {selectedWindow ? (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white border-bottom-0 p-4 d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold mb-0 text-dark">Patient List - {selectedWindow.window_name}</h4>
                        {selectedWindow.is_active > 0 ? (
                            <button className="btn btn-success rounded-pill fw-bold px-4 hover-grow shadow-sm" onClick={onNextPatient}>
                                <i className="bi bi-person-check-fill me-2"></i> Next Patient
                            </button>
                        ) : (
                            <span className="badge bg-secondary rounded-pill px-3 py-2">Start this window for live queue</span>
                        )}
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary">
                                    <tr>
                                        <th className="ps-4">Queue #</th>
                                        <th>Patient Name</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.map(q => (
                                        <tr key={q.appointment_id} className={q.appointment_status === 'Current' ? 'table-warning' : ''}>
                                            <td className="ps-4 fw-bold fs-5 text-primary">#{q.queue_number}</td>
                                            <td className="fw-semibold text-dark">{q.patient_name}</td>
                                            <td>
                                                <span className={`badge bg-${q.appointment_status === 'Walk-In' ? 'success' : (q.appointment_status === 'Current' ? 'warning text-dark' : 'secondary')} rounded-pill px-3`}>
                                                    {q.appointment_status}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                {q.appointment_status === 'Current' && selectedWindow.is_active > 0 && (
                                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm" onClick={() => onOpenPrescription(q)}>
                                                        <i className="bi bi-file-earmark-medical me-1"></i> Write Prescription
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {queue.length === 0 && (
                                        <tr><td colSpan="4" className="text-center p-4 text-muted">No patients in the queue.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm text-muted">
                    <i className="bi bi-calendar-x display-6"></i>
                    <p className="mt-2 mb-0">Click a window to view patients. Press Start Window to make it live.</p>
                </div>
            )}
        </div>
    );
};

export default QueueTab;
