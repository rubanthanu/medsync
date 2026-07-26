const FeedbackTable = ({ feedbacks }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 p-4">
                <h4 className="fw-bold mb-0 text-dark">Patient Feedback</h4>
            </div>
            <div className="card-body p-0">
                {feedbacks.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary">
                                <tr>
                                    <th className="ps-4">Patient</th>
                                    <th>Email</th>
                                    <th>Feedback Message</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(feedbacks) && feedbacks.map(f => (
                                    <tr key={f.feedback_id}>
                                        <td className="ps-4 fw-semibold text-dark">{f.patient_name}</td>
                                        <td className="text-muted">{f.patient_email}</td>
                                        <td className="text-dark py-3">{f.feedback_text}</td>
                                        <td className="text-muted small">{f.submitted_at ? new Date(f.submitted_at).toLocaleString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-chat-left-dots display-6"></i>
                        <p className="mt-2 mb-0">No patient feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackTable;
