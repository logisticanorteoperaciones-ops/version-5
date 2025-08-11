export enum UserRole {
  ADMIN = 'Administrator',
  FLEET_MANAGER = 'Gestor de Flota',
  DRIVER = 'Conductor',
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Password should not be sent to frontend
  role: UserRole;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  currentMileage: number;
  fuelType: 'Diesel' | 'Gasoline' | 'Electric';
  createdAt: string; // ISO Date string
}

export enum MaintenanceType {
  OIL_CHANGE = 'Cambio de Aceite',
  BRAKE_INSPECTION = 'Inspección de Frenos',
  TIRE_ROTATION = 'Rotación de Neumáticos',
  ANNUAL_INSPECTION = 'Inspección Anual',
  ENGINE_TUNE_UP = 'Afinación de Motor',
  DRIVER_REPORTED_ISSUE = 'Reporte del Conductor',
}

export interface MaintenanceHistory {
  id: string;
  vehicleId: string;
  serviceType: MaintenanceType;
  date: string; // ISO Date string
  cost: number;
  workshop: string;
  notes: string;
  mileageAtService: number;
}

export interface ScheduledMaintenance {
  id: string;
  vehicleId: string;
  serviceType: MaintenanceType;
  frequencyDays?: number;
  frequencyKm?: number;
}

export enum NotificationSeverity {
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
}

export interface Notification {
  id: string;
  vehicleId: string;
  message: string;
  severity: NotificationSeverity;
  createdAt: string; // ISO Date string
  isRead: boolean;
}

export enum MaintenanceRequestStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export interface MaintenanceRequest {
    id: string;
    vehicleId: string;
    reportedBy: string; // User ID
    observations: string;
    status: MaintenanceRequestStatus;
    createdAt: string; // ISO Date string
    imageData?: string; // Base64 encoded image data
}