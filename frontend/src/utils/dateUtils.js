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
   const localDate = new Date();
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getMaxDateISO = (daysAhead) => {
       const localDate = new Date();
    localDate.setDate(localDate.getDate() + daysAhead);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};