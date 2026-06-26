export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
};

export const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
};

export const formatDateLong = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const getTodayISO = () => {
    return new Date().toISOString().split('T')[0];
};

export const getMaxDateISO = (daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
};