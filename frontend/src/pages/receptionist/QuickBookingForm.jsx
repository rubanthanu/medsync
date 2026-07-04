const QuickBookingForm = ({ windows, bookingData, setBookingData, onSubmit, bookingMsg }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-2">
                <h5 className="fw-bold mb-0">Quick Booking</h5>
                <small className="text-muted">Register walk-in or manual booking</small>
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
                            onChange={e => setBookingData({...bookingData, appointment_date: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold mt-2 shadow-sm">
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickBookingForm;