const PrescriptionModal = ({ activeAppointment, patientProfile, patientHistory, prescriptionForm, setPrescriptionForm, loadingHistory, savingPrescription, onSave, onClose }) => {
    if (!activeAppointment) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg rounded-4 bg-white w-100 h-100" style={{ maxWidth: '1200px', maxHeight: '90%' }}>
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-file-earmark-medical text-primary me-2"></i>
                        Medical Record & Prescription: {activeAppointment.patient_name}
                    </h4>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="card-body p-0 d-flex flex-column flex-md-row overflow-hidden">
                    {/* Left Side: Medical Info & Checkup History (45% width) */}
                    <div className="w-100 w-md-45 border-end p-4 overflow-y-auto bg-light" style={{ maxHeight: '100%' }}>
                        <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Patient Health Profile</h5>

                        {loadingHistory ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted small mt-2">Loading medical records...</p>
                            </div>
                        ) : (
                            <>
                                {/* Profile summary */}
                                {patientProfile && (
                                    <div className="card border-0 bg-white p-3 rounded-4 mb-4 shadow-sm small">
                                        <div className="row g-2">
                                            <div className="col-6"><strong>Gender:</strong> {patientProfile.gender || 'Not specified'}</div>
                                            <div className="col-6"><strong>Blood Group:</strong> <span className="badge bg-danger rounded-pill px-2">{patientProfile.blood_group || 'N/A'}</span></div>
                                            <div className="col-6"><strong>Phone:</strong> {patientProfile.phone || 'N/A'}</div>
                                            <div className="col-6"><strong>University ID:</strong> {patientProfile.university_id || 'N/A'}</div>
                                            <div className="col-12 mt-2">
                                                <strong className="text-danger"><i className="bi bi-exclamation-triangle"></i> Allergies:</strong>
                                                <div className="p-2 bg-danger-subtle text-danger-emphasis rounded-3 mt-1 fw-semibold">{patientProfile.allergies || 'None reported'}</div>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <strong>Medical Conditions:</strong>
                                                <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-3 mt-1">{patientProfile.medical_conditions || 'None reported'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Past Checkup History</h5>
                                {patientHistory.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {patientHistory.map((hist, index) => (
                                            <div key={hist.history_id} className="card border-0 bg-white p-3 rounded-4 shadow-sm small">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="fw-bold text-primary">Visit #{patientHistory.length - index}</span>
                                                    <span className="text-muted small">{new Date(hist.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="mb-1"><strong>Diagnosis:</strong> {hist.diagnosis}</p>
                                                <p className="mb-1 text-muted"><strong>Notes:</strong> {hist.notes || 'None'}</p>
                                                {hist.medicines && (
                                                    <div className="mt-2 bg-light p-2 rounded-3 border-start border-primary border-3">
                                                        <strong>Medicines:</strong>
                                                        <div className="text-secondary small whitespace-pre">{hist.medicines}</div>
                                                        {hist.dosage && <div className="text-muted small">Dosage: {hist.dosage}</div>}
                                                        {hist.instructions && <div className="text-muted small">Instructions: {hist.instructions}</div>}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-white rounded-4 border">
                                        <i className="bi bi-folder2-open text-muted fs-3"></i>
                                        <p className="text-muted small mt-1 mb-0">No previous checkup history found.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Side: Writing Prescription Form (55% width) */}
                    <form onSubmit={onSave} className="w-100 w-md-55 p-4 overflow-y-auto d-flex flex-column justify-content-between" style={{ maxHeight: '100%' }}>
                        <div>
                            <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Record Diagnosis & Prescribe</h5>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">DIAGNOSIS</label>
                                <input type="text" className="form-control rounded-pill px-3" placeholder="e.g. Common Cold, Migraine, Gastroentiritis" value={prescriptionForm.diagnosis} onChange={e => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">CHECKUP NOTES / SYMPTOMS</label>
                                <textarea className="form-control rounded-4 p-3" rows="2" placeholder="Describe symptoms and advice..." value={prescriptionForm.notes} onChange={e => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">PRESCRIBED MEDICINES (ONE PER LINE)</label>
                                <textarea className="form-control rounded-4 p-3" rows="4" placeholder={"e.g. Paracetamol 500mg\nAmoxicillin 250mg"} value={prescriptionForm.medicines} onChange={e => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })} required></textarea>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">DOSAGE (E.G. 1-0-1, 1-1-1)</label>
                                    <input type="text" className="form-control rounded-pill px-3" placeholder="e.g. Twice daily after meals" value={prescriptionForm.dosage} onChange={e => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">DURATION / INSTRUCTIONS</label>
                                    <input type="text" className="form-control rounded-pill px-3" placeholder="e.g. Take for 5 days" value={prescriptionForm.instructions} onChange={e => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="border-top pt-3 d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm" disabled={savingPrescription}>
                                {savingPrescription ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Generating PDF...
                                    </>
                                ) : (
                                    'Save & Complete Visit'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;
