import React from 'react';

const PrescriptionModal = ({ activeAppointment, patientProfile, patientHistory, prescriptionForm, setPrescriptionForm, loadingHistory, savingPrescription, onSave, onClose }) => {
    if (!activeAppointment) return null;

    const DOSAGE_PRESETS = ['1-0-1', '1-1-1', '1-0-0', '0-0-1', '1-0-0-1', 'SOS'];
    const DURATION_PRESETS = ['3 days', '5 days', '7 days', '10 days', '2 weeks', '1 month'];
    const TIMING_OPTIONS = [
        'After meals',
        'Before meals',
        'With food',
        'At bedtime',
        'Empty stomach',
        'As directed'
    ];

    const handleAddMedicine = () => {
        const newMed = {
            name: '',
            dosage: '1-0-1',
            timing: 'After meals',
            duration: '3 days',
            instruction: ''
        };
        setPrescriptionForm(prev => ({
            ...prev,
            medicines: [...(prev.medicines || []), newMed]
        }));
    };

    const handleRemoveMedicine = (index) => {
        if (prescriptionForm.medicines.length <= 1) return;
        setPrescriptionForm(prev => ({
            ...prev,
            medicines: prev.medicines.filter((_, idx) => idx !== index)
        }));
    };

    const handleMedicineChange = (index, field, value) => {
        setPrescriptionForm(prev => {
            const updated = [...(prev.medicines || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, medicines: updated };
        });
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg rounded-4 bg-white w-100 h-100" style={{ maxWidth: '1280px', maxHeight: '92%' }}>
                <div className="card-header bg-white border-bottom p-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-file-earmark-medical fs-5"></i>
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">
                                Medical Record & Prescription: <span className="text-primary">{activeAppointment.patient_name}</span>
                            </h5>
                            <span className="text-muted small">Appointment #{activeAppointment.appointment_id} • Queue #{activeAppointment.queue_number || 'N/A'}</span>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="card-body p-0 d-flex flex-column flex-lg-row overflow-hidden">
                    {/* Left Side: Medical Info & Checkup History (4.5 cols on desktop, 12 cols on mobile) */}
                    <div className="col-12 col-lg-4 border-end p-3 p-lg-4 overflow-y-auto bg-light" style={{ maxHeight: '100%' }}>
                        <h6 className="fw-bold text-dark mb-3 text-uppercase text-muted small tracking-wide">
                            <i className="bi bi-person-badge text-primary me-2"></i>Patient Health Profile
                        </h6>

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
                                            <div className="col-12"><strong>Phone:</strong> {patientProfile.phone || 'N/A'}</div>
                                            <div className="col-12 mt-2">
                                                <strong className="text-danger"><i className="bi bi-exclamation-triangle"></i> Known Allergies:</strong>
                                                <div className="p-2 bg-danger-subtle text-danger-emphasis rounded-3 mt-1 fw-semibold">
                                                    {patientProfile.allergies || 'None reported'}
                                                </div>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <strong>Medical Conditions:</strong>
                                                <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-3 mt-1">
                                                    {patientProfile.medical_conditions || 'None reported'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h6 className="fw-bold text-dark mb-3 text-uppercase text-muted small tracking-wide">
                                    <i className="bi bi-clock-history text-primary me-2"></i>Past Checkup History
                                </h6>
                                {patientHistory.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {patientHistory.map((hist, index) => (
                                            <div key={hist.history_id || index} className="card border-0 bg-white p-3 rounded-4 shadow-sm small">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                                                        Visit #{patientHistory.length - index}
                                                    </span>
                                                    <span className="text-muted small">{new Date(hist.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="mb-1"><strong>Diagnosis:</strong> {hist.diagnosis}</p>
                                                {hist.notes && <p className="mb-1 text-muted"><strong>Notes:</strong> {hist.notes}</p>}
                                                {hist.medicines && (
                                                    <div className="mt-2 bg-light p-2 rounded-3 border-start border-primary border-3">
                                                        <strong className="text-dark d-block mb-1">Prescription:</strong>
                                                        <div className="text-secondary small" style={{ whiteSpace: 'pre-line' }}>
                                                            {hist.medicines}
                                                        </div>
                                                        {hist.instructions && (
                                                            <div className="text-muted small mt-1 pt-1 border-top">
                                                                <em>Advice: {hist.instructions}</em>
                                                            </div>
                                                        )}
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

                    {/* Right Side: Dynamic Prescription Builder (8 cols on desktop, 12 cols on mobile) */}
                    <form onSubmit={onSave} className="col-12 col-lg-8 p-3 p-lg-4 overflow-y-auto d-flex flex-column justify-content-between" style={{ maxHeight: '100%' }}>
                        <div>
                            {/* Diagnosis & Checkup Notes */}
                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-5">
                                    <label className="form-label fw-bold text-secondary small mb-1">
                                        DIAGNOSIS <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3 shadow-none border-secondary-subtle"
                                        placeholder="e.g. Acute Pharyngitis, Migraine"
                                        value={prescriptionForm.diagnosis}
                                        onChange={e => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-7">
                                    <label className="form-label fw-bold text-secondary small mb-1">
                                        CHECKUP NOTES / CLINICAL OBSERVATIONS
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3 shadow-none border-secondary-subtle"
                                        placeholder="e.g. Fever 38.5C, throat congested, advised rest"
                                        value={prescriptionForm.notes}
                                        onChange={e => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Multi-Medicine Prescription Section */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div className="d-flex align-items-center gap-2">
                                        <h6 className="fw-bold text-dark mb-0">
                                            <i className="bi bi-capsule text-primary me-2"></i>Prescribed Medicines
                                        </h6>
                                        <span className="badge bg-primary rounded-pill px-2">
                                            {(prescriptionForm.medicines || []).length} { (prescriptionForm.medicines || []).length === 1 ? 'item' : 'items' }
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                                        onClick={handleAddMedicine}
                                    >
                                        <i className="bi bi-plus-lg"></i> Add Medicine
                                    </button>
                                </div>

                                {/* Dynamic Medicine Cards List */}
                                <div className="d-flex flex-column gap-3">
                                    {(prescriptionForm.medicines || []).map((med, index) => (
                                        <div
                                            key={index}
                                            className="card border border-primary-subtle rounded-4 p-3 bg-white shadow-sm transition-all position-relative"
                                            style={{ borderLeft: '4px solid #0d6efd !important' }}
                                        >
                                            {/* Top Row: Number, Medicine Name, and Remove Button */}
                                            <div className="row g-2 align-items-center mb-2">
                                                <div className="col-auto">
                                                    <span className="badge bg-primary text-white rounded-pill px-2 py-1 fw-bold">
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm rounded-pill px-3 border-secondary-subtle fw-semibold"
                                                        placeholder="Medicine Name & Strength (e.g. Paracetamol 500mg, Amoxicillin 250mg)"
                                                        value={med.name}
                                                        onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {prescriptionForm.medicines.length > 1 && (
                                                    <div className="col-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                                                            style={{ width: '32px', height: '32px' }}
                                                            title="Remove medicine"
                                                            onClick={() => handleRemoveMedicine(index)}
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details Grid: Dosage, Timing, Duration */}
                                            <div className="row g-2 pt-2 border-top">
                                                {/* Dosage & Presets */}
                                                <div className="col-12 col-md-4">
                                                    <label className="form-label text-secondary small fw-bold mb-1">
                                                        Dosage / Frequency
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm rounded-3 border-secondary-subtle mb-1"
                                                        placeholder="e.g. 1-0-1"
                                                        value={med.dosage}
                                                        onChange={e => handleMedicineChange(index, 'dosage', e.target.value)}
                                                    />
                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                        {DOSAGE_PRESETS.map(preset => (
                                                            <button
                                                                key={preset}
                                                                type="button"
                                                                className={`btn btn-xs rounded-pill px-2 py-0 ${med.dosage === preset ? 'btn-primary' : 'btn-light border text-secondary'}`}
                                                                style={{ fontSize: '0.72rem' }}
                                                                onClick={() => handleMedicineChange(index, 'dosage', preset)}
                                                            >
                                                                {preset}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Timing Dropdown */}
                                                <div className="col-12 col-md-4">
                                                    <label className="form-label text-secondary small fw-bold mb-1">
                                                        Timing
                                                    </label>
                                                    <select
                                                        className="form-select form-select-sm rounded-3 border-secondary-subtle"
                                                        value={med.timing}
                                                        onChange={e => handleMedicineChange(index, 'timing', e.target.value)}
                                                    >
                                                        {TIMING_OPTIONS.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Duration & Presets */}
                                                <div className="col-12 col-md-4">
                                                    <label className="form-label text-secondary small fw-bold mb-1">
                                                        Duration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm rounded-3 border-secondary-subtle mb-1"
                                                        placeholder="e.g. 3 days"
                                                        value={med.duration}
                                                        onChange={e => handleMedicineChange(index, 'duration', e.target.value)}
                                                    />
                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                        {DURATION_PRESETS.map(preset => (
                                                            <button
                                                                key={preset}
                                                                type="button"
                                                                className={`btn btn-xs rounded-pill px-2 py-0 ${med.duration === preset ? 'btn-primary' : 'btn-light border text-secondary'}`}
                                                                style={{ fontSize: '0.72rem' }}
                                                                onClick={() => handleMedicineChange(index, 'duration', preset)}
                                                            >
                                                                {preset}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Specific Instruction */}
                                                <div className="col-12 mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm rounded-3 border-secondary-subtle text-secondary"
                                                        placeholder="Specific instruction (e.g. Take after meal with warm water, complete full course)"
                                                        value={med.instruction}
                                                        onChange={e => handleMedicineChange(index, 'instruction', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 text-center">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                        onClick={handleAddMedicine}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Another Medicine
                                    </button>
                                </div>
                            </div>

                            {/* General Advice / Instructions */}
                            <div className="mb-3">
                                <label className="form-label fw-bold text-secondary small mb-1">
                                    DOCTOR'S ADVICE / GENERAL INSTRUCTIONS (DIET, REST, FOLLOW-UP)
                                </label>
                                <textarea
                                    className="form-control rounded-4 p-3 border-secondary-subtle shadow-none"
                                    rows="2"
                                    placeholder="e.g. Drink plenty of warm fluids. Bed rest for 2 days. Follow up in 5 days if symptoms persist."
                                    value={prescriptionForm.general_instructions}
                                    onChange={e => setPrescriptionForm({ ...prescriptionForm, general_instructions: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-top pt-3 mt-3 d-flex flex-column flex-sm-row justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={onClose}
                                disabled={savingPrescription}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded-pill px-5 shadow-sm fw-semibold"
                                disabled={savingPrescription}
                            >
                                {savingPrescription ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Generating e-Prescription...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle me-2"></i>Save & Complete Visit
                                    </>
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

