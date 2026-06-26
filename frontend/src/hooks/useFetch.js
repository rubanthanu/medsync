import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFn, options = {}) => {
    const { immediate = true, initialData = [], transform } = options;
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchFn(...args);
            const result = transform ? transform(res.data) : res.data;
            setData(result);
            setLoaded(true);
            return res;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, transform]);

    useEffect(() => {
        if (immediate) execute();
    }, []); 

    return { data, setData, loading, loaded, error, refetch: execute };
};

export default useFetch;