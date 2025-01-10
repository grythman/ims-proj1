import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const { user } = useAuth();
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRoleData();
        }
    }, [user]);

    const fetchRoleData = async () => {
        try {
            const endpoint = `/${user.role.toLowerCase()}/dashboard/`;
            const response = await api.get(endpoint);
            setRoleData(response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleContext.Provider value={{ roleData, loading, refreshData: fetchRoleData }}>
            {children}
        </RoleContext.Provider>
    );
}; 