import React, { createContext, useState, useContext } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({});

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext; 