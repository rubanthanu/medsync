import { useState, useEffect } from 'react';
import * as appointmentService from '../../services/appointmentService';
import * as queueService from '../../services/queueService';
import Swal from 'sweetalert2';
import DashboardHeader from './DashboardHeader';
import QuickBookingForm from './QuickBookingForm';
import WindowQueueTable from './WindowQueueTable';
import { getTodayISO } from '../../utils/dateUtils';


const ReceptionistDashboard = () => {
    const [windows, setWindows] = useState([]);
    const [selectedWindow, setSelectedWindow] = useState(null);
    const [queue, setQueue] = useState([]);
    const [activeTab, setActiveTab] = useState('queue');
    const [bookingData, setBookingData] = useState({ email: '', window_id: '', appointment_date: getTodayISO() });
    const [bookingMsg, setBookingMsg] = useState({ text: '', type: '' });
    
    useEffect(() => {
        fetchWindows();
    }, []);

    const fetchWindows = async () => {
        try {
            const res = await appointmentService.getWindows();
            setWindows(res.data);
            if(res.data.length > 0 && !selectedWindow) {
                handleSelectWindow(res.data[0]);
                setBookingData(prev => ({ ...prev, window_id: res.data[0].window_id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectWindow = async (win) => {
        setSelectedWindow(win);
        try {
            const res = await queueService.getQueue(win.window_id);
            setQueue(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (appointment_id, status) => {
        try {
            await queueService.updateStatus(appointment_id, status);
            handleSelectWindow(selectedWindow);
            Swal.fire({ icon: 'success', title: 'Status Updated', timer: 1000, showConfirmButton: false });
        } catch (err) {
            Swal.fire('Error!', err.response?.data?.message || 'Error updating status', 'error');
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingMsg({ text: 'Processing...', type: 'info' });
        try {
            await appointmentService.staffBook(bookingData);
            setBookingMsg({ text: 'Booking successful!', type: 'success' });
            setBookingData({ ...bookingData, email: '' });
            if (activeTab === 'queue' && selectedWindow?.window_id == bookingData.window_id) {
                handleSelectWindow(selectedWindow);
            }
        } catch (err) {
            setBookingMsg({ text: err.response?.data?.message || 'Error booking appointment', type: 'danger' });
        }
    };

    return (
        <div className="container py-4 animate-fade-in">
            <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="row g-4">
                {/* Left Column: Quick Booking Form */}
                <div className="col-lg-4">
                 <QuickBookingForm 
                        windows={windows}
                        bookingData={bookingData}
                        setBookingData={setBookingData}
                        onSubmit={handleBookingSubmit}
                        bookingMsg={bookingMsg}
                    />
                </div>
                
                {/* Right Column: Dynamic Content */}
                <div className="col-lg-8">
                    
                        <WindowQueueTable 
                            windows={windows}
                            selectedWindow={selectedWindow}
                            onSelectWindow={handleSelectWindow}
                            queue={queue}
                            onUpdateStatus={updateStatus}
                        />
                
                
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
