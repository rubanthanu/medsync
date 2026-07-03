import { useState } from 'react';
import * as adminService from '../../services/adminService';
import Swal from 'sweetalert2';
import useFetch from '../../hooks/useFetch';
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards';
import AdminTabs from './AdminTabs';


const AdminDashboard = () => {
    const { data: stats } = useFetch(adminService.getStats, { initialData: { total_appointments: 0, total_patients: 0, total_certificates: 0, total_prescriptions: 0 } });
    const { data: users, refetch: fetchUsers } = useFetch(adminService.getUsers);
    const { data: windows, refetch: fetchWindows } = useFetch(adminService.getAppointmentWindows);
    const [activeTab, setActiveTab] = useState('users');

 
     return (
        <div className="container py-4 animate-fade-in">
            <AdminHeader />
            <StatsCards stats={stats} />
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

           
            

            

           
        </div>
    );
};

export default AdminDashboard;
