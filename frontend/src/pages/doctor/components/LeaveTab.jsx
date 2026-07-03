import { formatDateLong } from '../../../utils/dateUtils';
import { getTodayISO } from '../../../utils/dateUtils';

const LeaveTab = ({ leaves, leaveDate, setLeaveDate, leaveReason, setLeaveReason, markingLeave, onMarkLeave, onDeleteLeave }) => {
    return (
        <div className="row g-4">
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">Plan a Leave</h5>
                    <div className="alert alert-warning small rounded-3 mb-4">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <strong>Note:</strong> Marking a leave on a date will automatically <strong>cancel all existing appointments</strong> for that day and notify the patients.
                    </div>
                    <form onSubmit={onMarkLeave}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">LEAVE DATE</label>
                            <input
                                type="date"
                                className="form-control rounded-pill px-3"
                                value={leaveDate}
                                onChange={e => setLeaveDate(e.target.value)}
                                min={getTodayISO()}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small">REASON (OPTIONAL)</label>
                            <textarea
                                className="form-control rounded-4 p-3"
                                rows="3"
                                placeholder="e.g. Medical center duty, University event..."
                                value={leaveReason}
                                onChange={e => setLeaveReason(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-danger rounded-pill px-4 w-100 shadow-sm" disabled={markingLeave || !leaveDate}>
                            {markingLeave ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                            ) : (
                                <><i className="bi bi-calendar-check me-2"></i>Mark Leave & Cancel Appointments</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="col-lg-7">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">My Planned Leaves</h5>
                    {leaves.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {leaves.map(leave => (
                                <div key={leave.leave_id} className="list-group-item p-3 mb-3 border-0 bg-light rounded-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold text-dark mb-1">
                                            <i className="bi bi-calendar-date text-primary me-2"></i>
                                            {formatDateLong(leave.leave_date)}
                                        </h6>
                                        <p className="text-muted small mb-0">Reason: {leave.reason}</p>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onDeleteLeave(leave.leave_id)}>
                                        Cancel Leave
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-calendar3 display-6"></i>
                            <p className="mt-2 mb-0">No planned leaves found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveTab;
