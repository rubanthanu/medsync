import { useState, useEffect } from 'react';
import * as certificateService from '../../services/certificateService';
import * as prescriptionService from '../../services/prescriptionService';
import { getCertificatePdfUrl, getPrescriptionPdfUrl } from '../../utils/fileUtils';

const Certificates = () => {
   

    // Documents list states
   
    const [prescriptions, setPrescriptions] = useState([]);
   const [activeTab, setActiveTab] = useState('request'); // 'request', 'documents'

    useEffect(() => {
        if (activeTab === 'documents') {
            fetchDocuments();
        }
    }, [activeTab]);

    const fetchDocuments = async () => {
        try {
          

            // Fetch prescriptions
            const resPresc = await prescriptionService.getPatientPrescriptions();
            setPrescriptions(resPresc.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container py-4 animate-fade-in">
            <h2 className="fw-bold mb-4">Certificates & Prescriptions</h2>

            {/* Navigation Tabs */}
            <ul className="nav nav-pills mb-4 gap-2 bg-light p-2 rounded-4 d-inline-flex border-0 shadow-sm">
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'request' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('request')}>
                        <i className="bi bi-file-earmark-plus me-2"></i> Request Medical Certificate
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'documents' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('documents')}>
                        <i className="bi bi-folder2-open me-2"></i> My Documents
                    </button>
                </li>
            </ul>

          

            {/* My Documents Tab */}
            {activeTab === 'documents' && (
                <div className="row g-4">
                    

                    {/* e-Prescriptions List */}
                    <div className="col-lg-6">
                        <div className="card p-4 rounded-4 border-0 shadow-sm bg-white h-100">
                            <h4 className="fw-bold text-dark mb-4 border-bottom pb-2">
                                <i className="bi bi-prescription text-success me-2"></i> My e-Prescriptions
                            </h4>
                            {prescriptions.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {prescriptions.map(presc => (
                                        <div key={presc.prescription_id} className="card border-0 bg-light p-3 rounded-4 shadow-sm small hover-grow">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="fw-bold text-success">Prescription #{presc.prescription_id}</span>
                                                <span className="text-muted small">{new Date(presc.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mb-1"><strong>Doctor:</strong> Dr. {presc.doctor_name}</p>
                                            <div className="bg-white p-2 rounded-3 my-2 small border-start border-success border-3">
                                                <strong>Medicines:</strong>
                                                <div className="text-secondary whitespace-pre">{presc.medicines}</div>
                                                {presc.dosage && <div className="text-muted text-xs">Dosage: {presc.dosage}</div>}
                                                {presc.instructions && <div className="text-muted text-xs">Instructions: {presc.instructions}</div>}
                                            </div>

                                            {presc.prescription_pdf && (
                                                <a
                                                    href={getPrescriptionPdfUrl(presc.prescription_pdf)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-outline-success btn-sm rounded-pill mt-2 shadow-sm text-decoration-none text-center"
                                                >
                                                    <i className="bi bi-download me-1"></i> Download Prescription PDF
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-folder-x display-6"></i>
                                    <p className="mt-2 mb-0">No e-prescriptions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;