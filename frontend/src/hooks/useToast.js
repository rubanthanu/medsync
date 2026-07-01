import { useState, useEffect, useCallback } from 'react';


const useToast = (duration = 3500) => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), duration);
        return () => clearTimeout(timer);
    }, [toast, duration]);

    const showToast = useCallback((type, message) => {
        setToast({ type, message });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
};

export default useToast;