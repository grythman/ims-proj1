import { useState, useEffect } from 'react';
import api from '../services/api';

const cache = new Map();

export const useApi = (endpoint, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { 
        refresh = 0, 
        useCache = true,
        params = {}
    } = options;

    useEffect(() => {
        const fetchData = async () => {
            const cacheKey = `${endpoint}${JSON.stringify(params)}`;
            
            if (useCache && cache.has(cacheKey)) {
                setData(cache.get(cacheKey));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(endpoint, { params });
                setData(response.data);
                
                if (useCache) {
                    cache.set(cacheKey, response.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, refresh, JSON.stringify(params)]);

    return { data, loading, error, setData };
}; 