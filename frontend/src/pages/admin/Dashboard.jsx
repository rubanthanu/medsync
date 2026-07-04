import { useState } from 'react';
import * as adminService from '../../services/adminService';
import Swal from 'sweetalert2';
import useFetch from '../../hooks/useFetch';
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards';
import AdminTabs from './AdminTabs';
import UserManagement from './UserManagement';
import AppointmentWindows from './AppointmentWindows';



const AdminDashboard = () => {
    const { data: stats } = useFetch(adminService.getStats, { initialData: { total_appointments: 0, total_patients: 0, total_certificates: 0, total_prescriptions: 0 } });
    const { data: users, refetch: fetchUsers } = useFetch(adminService.getUsers);
    const { data: windows, refetch: fetchWindows } = useFetch(adminService.getAppointmentWindows);
    const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '', role_id: '4' });
    const [showAddUser, setShowAddUser] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    const toggleStatus = async (user_id, current_status) => {
        const newStatus = current_status === 'Active' ? 'Blocked' : 'Active';
        try {
            await adminService.updateUserStatus(user_id, newStatus);
            fetchUsers();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to update user status' });
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.createUser(newUser);
            setNewUser({ full_name: '', email: '', password: '', role_id: '4' });
            setShowAddUser(false);
            fetchUsers();
            Swal.fire('Success!', 'User created successfully!', 'success');
        } catch (err) {
            Swal.fire('Error!', err.response?.data?.message || 'Failed to create user', 'error');
        }
    };
    const handleUpdateMaxSlots = async (window_id, max_slots) => {
        try {
            await adminService.updateWindowSlots(window_id, max_slots);
            fetchWindows();
            Swal.fire('Success!', 'Maximum patients updated successfully!', 'success');
        } catch (err) {
            Swal.fire('Error!', err.response?.data?.message || 'Failed to update slots', 'error');
        }
    };
 
     return (
        <div className="container py-4 animate-fade-in">
            <AdminHeader />
            <StatsCards stats={stats} />
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'users' && (
                <UserManagement
                    users={users}
                    showAddUser={showAddUser}
                    setShowAddUser={setShowAddUser}
                    newUser={newUser}
                    setNewUser={setNewUser}
                    onAddUser={handleAddUser}
                    onToggleStatus={toggleStatus}
                />
            )}
           
             {activeTab === 'windows' && (
                <AppointmentWindows windows={windows} onUpdateMaxSlots={handleUpdateMaxSlots} />
            )}

            

           
        </div>
    );
};

export default AdminDashboard;
