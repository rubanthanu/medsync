import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as appointmentService from '../../services/appointmentService';
import * as queueService from '../../services/queueService';
import * as doctorService from '../../services/doctorService';
import * as prescriptionService from '../../services/prescriptionService';
import * as userService from '../../services/userService';
import useFetch from '../../hooks/useFetch';


import QueueTab from './components/QueueTab';
import PrescriptionModal from './components/PrescriptionModal';
import LeaveTab from './components/LeaveTab';

const DoctorDashboard = () => {
    // Custom hooks
    
    const { data: leaves, refetch: fetchLeaves } = useFetch(doctorService.getLeaves);

    // Window & queue state (complex logic, kept as-is)
    const [windows, setWindows] = useState([]);
    const [activeWindow, setActiveWindow] = useState(null);
    const [selectedWindow, setSelectedWindow] = useState(null);
    const [queue, setQueue] = useState([]);

  

    // Leave management states
    const [leaveDate, setLeaveDate] = useState('');
    const [leaveReason, setLeaveReason] = useState('Medical Leave');
    const [markingLeave, setMarkingLeave] = useState(false);

    // Prescription modal states
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [patientProfile, setPatientProfile] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({ diagnosis: '', notes: '', medicines: '', dosage: '', instructions: '' });
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [savingPrescription, setSavingPrescription] = useState(false);

    const [activeTab, setActiveTab] = useState('queue');

    useEffect(() => {
        fetchWindows();
    }, []);

    const fetchWindows = async (preferredWindowId = null) => {
        try {
            const res = await appointmentService.getWindows();
            setWindows(res.data);
            const active = res.data.find(w => w.is_active > 0);
            const targetWindowId = preferredWindowId || selectedWindow?.window_id;
            if (targetWindowId) {
                const refreshedSelected = res.data.find(w => w.window_id === targetWindowId);
                if (refreshedSelected) {
                    setSelectedWindow(refreshedSelected);
                    setActiveWindow(refreshedSelected.is_active > 0 ? refreshedSelected : (active || null));
                    fetchQueue(refreshedSelected.window_id);
                    return;
                }
            }
            if (active) { setActiveWindow(active); setSelectedWindow(active); fetchQueue(active.window_id); }
            else { setActiveWindow(null); setSelectedWindow(null); setQueue([]); }
        } catch (err) { console.error(err); }
    };

    const fetchQueue = async (window_id) => {
        try { const res = await queueService.getQueue(window_id); setQueue(res.data); } catch (err) { console.error(err); }
    };



    const handleSelectWindow = (win) => { setSelectedWindow(win); fetchQueue(win.window_id); };

    const handleStartWindow = async (window_id) => {
        try { await queueService.startWindow(window_id); fetchWindows(window_id); Swal.fire({ icon: 'success', title: 'Window Started', timer: 1500, showConfirmButton: false }); } catch (err) { Swal.fire('Error!', err.response?.data?.message || 'Failed to start window', 'error'); }
    };

    const handleStopWindow = async (window_id) => {
        const result = await Swal.fire({ title: 'Finish Session?', text: 'Are you sure you want to finish this time window?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, finish it!' });
        if (!result.isConfirmed) return;
        try { await queueService.stopWindow(window_id); fetchWindows(window_id); Swal.fire('Finished!', 'The window has been closed.', 'success'); } catch (err) { Swal.fire('Error!', err.response?.data?.message || 'Failed to stop window', 'error'); }
    };

    const handleNextPatient = async () => {
        if (!selectedWindow || selectedWindow.is_active <= 0) { Swal.fire('Wait!', 'Please start this window before calling the next patient.', 'warning'); return; }
        try { const res = await queueService.nextPatient(selectedWindow.window_id); Swal.fire({ title: 'Next Patient Called', text: res.data.message, icon: 'info', timer: 2000, showConfirmButton: false }); fetchQueue(selectedWindow.window_id); } catch (err) { Swal.fire('Error!', err.response?.data?.message || 'Error', 'error'); }
    };



    const handleOpenPrescription = async (appt) => {
        setActiveAppointment(appt);
        setPrescriptionForm({ diagnosis: '', notes: '', medicines: '', dosage: '', instructions: '' });
        setLoadingHistory(true);
        try {
            const resProfile = await userService.getPatientDetails(appt.patient_id);
            setPatientProfile(resProfile.data);
            const resHistory = await prescriptionService.getHistory(appt.patient_id);
            setPatientHistory(resHistory.data);
        } catch (err) { console.error(err); } finally { setLoadingHistory(false); }
    };

    const handleSavePrescription = async (e) => {
        e.preventDefault();
        setSavingPrescription(true);
        try {
            await prescriptionService.create({ appointment_id: activeAppointment.appointment_id, ...prescriptionForm });
            Swal.fire({ icon: 'success', title: 'Success!', text: 'Prescription created, Checkup history logged, and Appointment completed successfully!', timer: 3000, showConfirmButton: false });
            setActiveAppointment(null);
            if (selectedWindow) fetchQueue(selectedWindow.window_id);
            fetchWindows(selectedWindow?.window_id);
        } catch (err) { Swal.fire({ icon: 'error', title: 'Operation Failed', text: err.response?.data?.message || 'Failed to save prescription' }); } finally { setSavingPrescription(false); }
    };

    const handleReviewCertificate = async (status) => {
        if (status === 'Rejected' && !rejectionReason.trim()) { Swal.fire({ icon: 'warning', title: 'Reason Required', text: 'Please specify a rejection reason.' }); return; }
        setReviewing(true);
        try {
            await certificateService.reviewCertificate({ certificate_id: selectedCert.certificate_id, status, rejection_reason: status === 'Rejected' ? rejectionReason : '' });
            Swal.fire({ icon: 'success', title: 'Done', text: `Medical certificate request ${status.toLowerCase()} successfully.`, timer: 2000, showConfirmButton: false });
            setSelectedCert(null); setRejectionReason(''); fetchCertificates();
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to review certificate' }); } finally { setReviewing(false); }
    };

    const handleMarkLeave = async (e) => {
        e.preventDefault();
        const result = await Swal.fire({ title: 'Mark Leave?', text: `Marking leave on ${leaveDate} will CANCEL all existing appointments for that day. Patients will be notified by email. Proceed?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, mark leave' });
        if (!result.isConfirmed) return;
        setMarkingLeave(true);
        try { const res = await doctorService.markLeave({ leave_date: leaveDate, reason: leaveReason }); Swal.fire('Success', res.data.message, 'success'); setLeaveDate(''); fetchLeaves(); } catch (err) { Swal.fire('Error!', err.response?.data?.message || 'Failed to mark leave', 'error'); } finally { setMarkingLeave(false); }
    };

    const handleDeleteLeave = async (leave_id) => {
        const result = await Swal.fire({ title: 'Cancel Leave?', text: 'You will become available for booking again.', icon: 'question', showCancelButton: true, confirmButtonText: 'Yes, cancel leave' });
        if (!result.isConfirmed) return;
        try { await doctorService.deleteLeave(leave_id); fetchLeaves(); Swal.fire('Success', 'Leave cancelled', 'success'); } catch (err) { Swal.fire('Error!', 'Failed to cancel leave', 'error'); }
    };

    return (
        <div className="container py-4 animate-fade-in">
            {/* Dashboard Header */}
            <div className="dashboard-hero d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Doctor Dashboard</h2>
                <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">
                    <i className="bi bi-person-gear me-2"></i> Edit Profile
                </Link>
            </div>

            {/* Dashboard Navigation Tabs */}
            <ul className="nav nav-pills mb-4 gap-2 bg-light p-2 rounded-4 d-flex flex-nowrap overflow-x-auto border-0 w-100 scrollbar-hide">
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'queue' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('queue')}>
                        <i className="bi bi-calendar2-check me-2"></i> Active Queue
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'certificates' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('certificates')}>
                        <i className="bi bi-file-earmark-medical me-2"></i> Certificate Requests 
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'posts' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('posts')}>
                        <i className="bi bi-journal-medical me-2"></i> Health Posts
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'feedbacks' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('feedbacks')}>
                        <i className="bi bi-chat-left-heart me-2"></i> Patient Feedback
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link rounded-pill px-4 fw-semibold border-0 ${activeTab === 'leaves' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'}`} onClick={() => setActiveTab('leaves')}>
                        <i className="bi bi-calendar-x me-2"></i> Leave Management
                    </button>
                </li>
            </ul>

            {activeTab === 'queue' && (
                <QueueTab
                    windows={windows} selectedWindow={selectedWindow} queue={queue}
                    onSelectWindow={handleSelectWindow} onStartWindow={handleStartWindow}
                    onStopWindow={handleStopWindow} onNextPatient={handleNextPatient}
                    onOpenPrescription={handleOpenPrescription}
                />
            )}

            {activeTab === 'leaves' && (
                <LeaveTab
                    leaves={leaves} leaveDate={leaveDate} setLeaveDate={setLeaveDate}
                    leaveReason={leaveReason} setLeaveReason={setLeaveReason}
                    markingLeave={markingLeave} onMarkLeave={handleMarkLeave}
                    onDeleteLeave={handleDeleteLeave}
                />
            )}

            <PrescriptionModal
                activeAppointment={activeAppointment} patientProfile={patientProfile}
                patientHistory={patientHistory} prescriptionForm={prescriptionForm}
                setPrescriptionForm={setPrescriptionForm} loadingHistory={loadingHistory}
                savingPrescription={savingPrescription} onSave={handleSavePrescription}
                onClose={() => setActiveAppointment(null)}
            />
        </div>
    );
};

export default DoctorDashboard;