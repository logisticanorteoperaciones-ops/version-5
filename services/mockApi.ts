import { Vehicle, MaintenanceHistory, ScheduledMaintenance, Notification, User, UserRole, MaintenanceType, NotificationSeverity, MaintenanceRequest, MaintenanceRequestStatus } from '../types';

// --- MOCK DATABASE ---
let users: User[] = [
  { id: 'user-1', name: 'Alicia Admin', username: 'admin', password: 'password', role: UserRole.ADMIN },
  { id: 'user-2', name: 'Bernardo Gestor', username: 'manager', password: 'password', role: UserRole.FLEET_MANAGER },
  { id: 'user-3', name: 'Carlos Conductor', username: 'carlos', password: 'password', role: UserRole.DRIVER },
  { id: 'user-4', name: 'Diana Conductora', username: 'diana', password: 'password', role: UserRole.DRIVER },
];

let vehicles: Vehicle[] = [
  { id: 'v-1', plate: 'TRK-001', brand: 'Volvo', model: 'VNL 860', year: 2022, vin: 'VIN001', currentMileage: 155000, fuelType: 'Diesel', createdAt: '2022-01-10T10:00:00Z' },
  { id: 'v-2', plate: 'VAN-002', brand: 'Ford', model: 'Transit', year: 2023, vin: 'VIN002', currentMileage: 48500, fuelType: 'Gasoline', createdAt: '2023-03-15T10:00:00Z' },
  { id: 'v-3', plate: 'TRK-003', brand: 'Kenworth', model: 'T680', year: 2021, vin: 'VIN003', currentMileage: 210000, fuelType: 'Diesel', createdAt: '2021-08-20T10:00:00Z' },
];

let maintenanceHistory: MaintenanceHistory[] = [
    { id: 'mh-1', vehicleId: 'v-1', serviceType: MaintenanceType.OIL_CHANGE, date: '2024-05-10T10:00:00Z', cost: 350, workshop: 'Taller Central', notes: 'Cambio de aceite y filtros.', mileageAtService: 140000 },
    { id: 'mh-2', vehicleId: 'v-1', serviceType: MaintenanceType.BRAKE_INSPECTION, date: '2024-02-15T10:00:00Z', cost: 200, workshop: 'Frenos Seguros', notes: 'Pastillas al 50%.', mileageAtService: 125000 },
    { id: 'mh-3', vehicleId: 'v-2', serviceType: MaintenanceType.OIL_CHANGE, date: '2024-06-01T10:00:00Z', cost: 150, workshop: 'Servicio Rápido', notes: 'Aceite sintético.', mileageAtService: 40100 },
];

let scheduledMaintenances: ScheduledMaintenance[] = [
  { id: 'sm-1', vehicleId: 'v-1', serviceType: MaintenanceType.OIL_CHANGE, frequencyKm: 15000 },
  { id: 'sm-2', vehicleId: 'v-1', serviceType: MaintenanceType.BRAKE_INSPECTION, frequencyDays: 180 }, // 6 months
  { id: 'sm-3', vehicleId: 'v-2', serviceType: MaintenanceType.OIL_CHANGE, frequencyKm: 10000 },
  { id: 'sm-4', vehicleId: 'v-2', serviceType: MaintenanceType.ANNUAL_INSPECTION, frequencyDays: 365 },
  { id: 'sm-5', vehicleId: 'v-3', serviceType: MaintenanceType.OIL_CHANGE, frequencyKm: 20000 },
];

let notifications: Notification[] = [];
let maintenanceRequests: MaintenanceRequest[] = [];

const simulateDelay = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

// --- NOTIFICATION LOGIC ---
const generateNotifications = () => {
  const newNotifications: Notification[] = [];
  const now = new Date();
  
  // Clear old notifications to regenerate them
  notifications = [];

  for (const schedule of scheduledMaintenances) {
    const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
    if (!vehicle) continue;

    const lastMaintenance = maintenanceHistory
      .filter(h => h.vehicleId === schedule.vehicleId && h.serviceType === schedule.serviceType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Time-based check
    if (schedule.frequencyDays) {
      const lastServiceDate = new Date(lastMaintenance?.date || vehicle.createdAt);
      const dueDate = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + schedule.frequencyDays));
      const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
      
      const daysThreshold = 14; // Notify 14 days in advance

      if (daysUntilDue <= daysThreshold) {
        let message = `Mantenimiento de '${schedule.serviceType}' para el vehículo ${vehicle.plate} es requerido en ${Math.ceil(daysUntilDue)} días.`;
        let severity = NotificationSeverity.WARNING;
        if (daysUntilDue <= 0) {
          message = `Mantenimiento de '${schedule.serviceType}' para el vehículo ${vehicle.plate} está vencido.`;
          severity = NotificationSeverity.DANGER;
        }
        newNotifications.push({ id: `notif-${Date.now()}-${schedule.id}`, vehicleId: vehicle.id, message, severity, createdAt: now.toISOString(), isRead: false });
      }
    }

    // Mileage-based check
    if (schedule.frequencyKm) {
        const lastServiceMileage = lastMaintenance?.mileageAtService || 0;
        const dueMileage = lastServiceMileage + schedule.frequencyKm;
        const kmUntilDue = dueMileage - vehicle.currentMileage;
        
        const kmThreshold = 2000; // Notify 2000 km in advance

        if (kmUntilDue <= kmThreshold) {
            let message = `Mantenimiento de '${schedule.serviceType}' para el vehículo ${vehicle.plate} es requerido en aprox. ${kmUntilDue} km.`;
            let severity = NotificationSeverity.WARNING;
            if (kmUntilDue <= 0) {
                 message = `Mantenimiento de '${schedule.serviceType}' para el vehículo ${vehicle.plate} está vencido por kilometraje.`;
                 severity = NotificationSeverity.DANGER;
            }
            // Avoid duplicate notifications if time-based already triggered it
            if (!newNotifications.some(n => n.message.includes(schedule.serviceType) && n.vehicleId === vehicle.id)) {
                 newNotifications.push({ id: `notif-${Date.now()}-${schedule.id}`, vehicleId: vehicle.id, message, severity, createdAt: now.toISOString(), isRead: false });
            }
        }
    }
  }
  notifications.push(...newNotifications.filter(nn => !notifications.some(n => n.message === nn.message)));
};


// --- API FUNCTIONS ---

export const api = {
  login: (username: string, password?: string): Promise<User | undefined> => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    // In a real app, you'd check a hashed password here.
    if(user && user.password === password) {
        const { password, ...userToReturn } = user;
        return simulateDelay(userToReturn);
    }
    return simulateDelay(undefined, 300);
  },
  
  getUsers: () => {
    const usersWithoutPasswords = users.map(u => {
        const { password, ...user } = u;
        return user;
    });
    return simulateDelay(usersWithoutPasswords);
  },
  
  addUser: (userData: Omit<User, 'id'>) => {
    const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
    };
    users.push(newUser);
    const { password, ...userToReturn } = newUser;
    return simulateDelay(userToReturn);
  },

  deleteUser: (userId: string): Promise<{ success: boolean; message: string }> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return Promise.reject(new Error("Usuario no encontrado."));
    }
    
    const userToDelete = users[userIndex];
    const isAdmin = userToDelete.role === UserRole.ADMIN;
    const adminCount = users.filter(u => u.role === UserRole.ADMIN).length;

    if (isAdmin && adminCount === 1) {
      return Promise.reject(new Error("No se puede eliminar al único administrador del sistema."));
    }

    users.splice(userIndex, 1);
    return simulateDelay({ success: true, message: "Usuario eliminado con éxito." });
  },

  getVehicles: () => simulateDelay(vehicles),
  getVehicleById: (id: string) => simulateDelay(vehicles.find(v => v.id === id)),
  
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
        ...vehicleData,
        id: `v-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    vehicles.push(newVehicle);
    return simulateDelay(newVehicle);
  },

  updateVehicleMileage: (id: string, newMileage: number) => {
    const vehicle = vehicles.find(v => v.id === id);
    if(vehicle) {
        if (newMileage < vehicle.currentMileage) {
             return Promise.reject(new Error("El nuevo kilometraje no puede ser menor que el actual."));
        }
        vehicle.currentMileage = newMileage;
        generateNotifications(); // Recalculate notifications after mileage update
        return simulateDelay(vehicle);
    }
    return Promise.reject(new Error("Vehículo no encontrado"));
  },
  
  reportMaintenanceNeed: (data: { vehicleId: string; reportedBy: string; observations: string; imageData?: string; }) => {
    const newRequest: MaintenanceRequest = {
        id: `mr-${Date.now()}`,
        ...data,
        status: MaintenanceRequestStatus.OPEN,
        createdAt: new Date().toISOString(),
    };
    maintenanceRequests.push(newRequest);

    // Also create a notification for managers
    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    const reporter = users.find(u => u.id === data.reportedBy);
    const message = `Reporte de ${reporter?.name || 'conductor'}: "${data.observations}" para el vehículo ${vehicle?.plate}.`;
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}-mr`,
      vehicleId: data.vehicleId,
      message: message,
      severity: NotificationSeverity.INFO,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    notifications.push(newNotification);

    return simulateDelay(newRequest);
  },

  getNotifications: () => {
    generateNotifications();
    // Make sure all open maintenance requests have a notification
    maintenanceRequests.filter(mr => mr.status === 'OPEN').forEach(mr => {
      const hasNotif = notifications.some(n => n.message.includes(mr.observations));
      if (!hasNotif) {
        const vehicle = vehicles.find(v => v.id === mr.vehicleId);
        const reporter = users.find(u => u.id === mr.reportedBy);
        const message = `Reporte de ${reporter?.name || 'conductor'}: "${mr.observations}" para el vehículo ${vehicle?.plate}.`;
        notifications.push({
          id: `notif-${mr.id}`,
          vehicleId: mr.vehicleId,
          message: message,
          severity: NotificationSeverity.INFO,
          createdAt: mr.createdAt,
          isRead: false
        });
      }
    });

    return simulateDelay(notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  getMaintenanceRequestsForVehicle: (vehicleId: string) => {
    const requests = maintenanceRequests
        .filter(r => r.vehicleId === vehicleId && r.status === MaintenanceRequestStatus.OPEN)
        .map(r => {
            const reporter = users.find(u => u.id === r.reportedBy);
            return {
                ...r,
                reportedBy: reporter ? reporter.name : 'Desconocido' // Replace ID with name
            }
        })
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return simulateDelay(requests);
  },

  getMaintenanceHistoryForVehicle: (vehicleId: string) => {
    const history = maintenanceHistory.filter(h => h.vehicleId === vehicleId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return simulateDelay(history);
  },
  
  getScheduledMaintenanceForVehicle: (vehicleId: string) => {
    const scheduled = scheduledMaintenances.filter(s => s.vehicleId === vehicleId);
    return simulateDelay(scheduled);
  },

  logMaintenance: (logData: Omit<MaintenanceHistory, 'id'>) => {
    const newLog: MaintenanceHistory = {
        ...logData,
        id: `mh-${Date.now()}`,
    };
    maintenanceHistory.push(newLog);
    // Also update vehicle mileage
    const vehicle = vehicles.find(v => v.id === logData.vehicleId);
    if(vehicle && logData.mileageAtService > vehicle.currentMileage) {
        vehicle.currentMileage = logData.mileageAtService;
    }
    generateNotifications(); // Recalculate notifications
    return simulateDelay(newLog);
  },

  scheduleMaintenance: (scheduleData: Omit<ScheduledMaintenance, 'id'>) => {
    const newSchedule: ScheduledMaintenance = {
        ...scheduleData,
        id: `sm-${Date.now()}`,
    };
    scheduledMaintenances.push(newSchedule);
    generateNotifications(); // Recalculate notifications
    return simulateDelay(newSchedule);
  },

  getAllDataForAI: () => {
    return simulateDelay({
      vehicles,
      maintenanceHistory,
      scheduledMaintenances,
      notifications,
      maintenanceRequests
    })
  }
};