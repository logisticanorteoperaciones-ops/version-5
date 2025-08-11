

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../services/mockApi';
import { Vehicle, Notification, MaintenanceHistory, ScheduledMaintenance, MaintenanceRequest } from '../types';

interface DataContextType {
  vehicles: Vehicle[];
  notifications: Notification[];
  loading: boolean;
  fetchVehicles: () => void;
  fetchNotifications: () => void;
  getVehicleDetails: (id: string) => Promise<{ vehicle: Vehicle | undefined; history: MaintenanceHistory[]; scheduled: ScheduledMaintenance[]; requests: MaintenanceRequest[] }>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<Vehicle>;
  logMaintenance: (log: Omit<MaintenanceHistory, 'id'>) => Promise<MaintenanceHistory>;
  scheduleMaintenance: (schedule: Omit<ScheduledMaintenance, 'id'>) => Promise<ScheduledMaintenance>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    const data = await api.getVehicles();
    setVehicles(data);
    setLoading(false);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const data = await api.getNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);
  
  const getVehicleDetails = useCallback(async (id: string) => {
    setLoading(true);
    const [vehicle, history, scheduled, requests] = await Promise.all([
        api.getVehicleById(id),
        api.getMaintenanceHistoryForVehicle(id),
        api.getScheduledMaintenanceForVehicle(id),
        api.getMaintenanceRequestsForVehicle(id)
    ]);
    setLoading(false);
    return { vehicle, history, scheduled, requests };
  }, []);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    setLoading(true);
    const newVehicle = await api.addVehicle(vehicle);
    fetchVehicles(); // Refresh list
    return newVehicle;
  };
  
  const logMaintenance = async (log: Omit<MaintenanceHistory, 'id'>) => {
    setLoading(true);
    const newLog = await api.logMaintenance(log);
    fetchNotifications(); // Refresh notifications after logging
    return newLog;
  };

  const scheduleMaintenance = async (schedule: Omit<ScheduledMaintenance, 'id'>) => {
    setLoading(true);
    const newSchedule = await api.scheduleMaintenance(schedule);
    fetchNotifications(); // Refresh notifications after scheduling
    return newSchedule;
  };


  useEffect(() => {
    fetchVehicles();
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider value={{ vehicles, notifications, loading, fetchVehicles, fetchNotifications, getVehicleDetails, addVehicle, logMaintenance, scheduleMaintenance }}>
      {children}
    </DataContext.Provider>
  );
};

export const useFleetData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useFleetData must be used within a DataProvider');
  }
  return context;
};