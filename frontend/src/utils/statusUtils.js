export const getStatusPillClass = (status) => {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
};

export const getQueueBadgeClass = (status) => {
    switch (status) {
        case 'Booked': return 'bg-primary';
        case 'Walk-In': return 'bg-success';
        case 'Current': return 'bg-warning text-dark';
        case 'Completed': return 'bg-secondary';
        case 'Absent': return 'bg-danger';
        case 'Cancelled': return 'bg-dark';
        default: return 'bg-light text-dark';
    }
};

export const getCertificateBadgeClass = (status) => {
    switch (status) {
        case 'Approved': return 'bg-success-subtle text-success';
        case 'Pending': return 'bg-warning-subtle text-warning';
        case 'Rejected': return 'bg-danger-subtle text-danger';
        default: return 'bg-secondary-subtle text-secondary';
    }
};

export const getCategoryBadgeClass = (category) => {
    const cat = category?.toLowerCase();
    if (cat === 'wellness') return 'bg-success-subtle text-success';
    if (cat === 'mental health') return 'bg-primary-subtle text-primary';
    if (cat === 'nutrition') return 'bg-warning-subtle text-warning';
    return 'bg-secondary-subtle text-secondary';
};
