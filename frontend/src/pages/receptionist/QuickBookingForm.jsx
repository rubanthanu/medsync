import { getTodayISO, getMaxDateISO } from '../../utils/dateUtils';

const QuickBookingForm = ({ windows, bookingData, setBookingData, onSubmit, bookingMsg, isSubmitting }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ top: '20px' }}>
            <div className="card-header border-0 p-0">
                <div style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 60%, #e0f2fe 100%)',
                    padding: '20px 24px 18px',
                }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <div style={{
                            width: 34, height: 34, borderRadius: '10px',
                            background: 'rgba(37,99,235,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <i className="bi bi-calendar2-plus" style={{ fontSize: '1rem', color: '#1d4ed8' }}></i>
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#1e3a8a' }}>Quick Booking</h5>
                    </div>
                    <small style={{ color: '#3b82f6', fontSize: '0.8rem' }}>
                        Register walk-in or manual booking
                    </small>
                </div>
                <div style={{ height: 3, background: 'linear-gradient(90deg, #1d4ed8, #60a5fa, #e0f2fe)' }} />
            </div>
            <div className="card-body p-4">
                {bookingMsg.text && (
                    <div className={`alert alert-${bookingMsg.type} py-2 small rounded-3 mb-3`}>
                        {bookingMsg.text}
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">PATIENT EMAIL</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><i className="bi bi-envelope"></i></span>
                            <input 
                                type="email" 
                                className="form-control border-0 bg-light" 
                                placeholder="patient@std.uwu.ac.lk"
                                value={bookingData.email}
                                onChange={e => setBookingData({...bookingData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">WINDOW</label>
                        <select 
                            className="form-select border-0 bg-light"
                            value={bookingData.window_id}
                            onChange={e => setBookingData({...bookingData, window_id: e.target.value})}
                            required
                        >
                            <option value="">Select Window</option>
                            {windows.map(win => (
                                <option key={win.window_id} value={win.window_id}>{win.window_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">DATE</label>
                        <input 
                            type="date" 
                            className="form-control border-0 bg-light" 
                            value={bookingData.appointment_date}
                            min={getTodayISO()}
                            max={getMaxDateISO(2)}
                            onChange={e => setBookingData({...bookingData, appointment_date: e.target.value})}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 rounded-pill py-2 fw-bold mt-2 shadow-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Booking...
                            </>
                        ) : (
                            'Book Appointment'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickBookingForm;