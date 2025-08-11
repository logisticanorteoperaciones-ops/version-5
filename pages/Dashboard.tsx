
import React, { useEffect, useMemo } from 'react';
import { useFleetData } from '../hooks/useFleetData';
import { Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import DonutChart from '../components/ui/DonutChart';
import { NotificationSeverity } from '../types';

const Dashboard: React.FC = () => {
  const { vehicles, notifications, loading, fetchNotifications, fetchVehicles } = useFleetData();

  useEffect(() => {
    // Initial fetch is in provider, this is to allow refresh
    fetchNotifications();
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { healthData, fuelData } = useMemo(() => {
    if (loading || vehicles.length === 0) {
      return { healthData: [], fuelData: [] };
    }

    // Health Data Calculation
    const dangerVehicleIds = new Set(notifications.filter(n => n.severity === NotificationSeverity.DANGER).map(n => n.vehicleId));
    const warningVehicleIds = new Set(notifications.filter(n => n.severity === NotificationSeverity.WARNING && !dangerVehicleIds.has(n.vehicleId)).map(n => n.vehicleId));
    
    const dangerCount = dangerVehicleIds.size;
    const warningCount = warningVehicleIds.size;
    const okCount = vehicles.length - dangerCount - warningCount;

    const newHealthData = [
      { label: 'En Regla', value: okCount, color: '#2E7D32' },
      { label: 'Advertencia', value: warningCount, color: '#FF8F00' },
      { label: 'Vencido', value: dangerCount, color: '#C62828' },
    ];

    // Fuel Data Calculation
    const fuelCounts = vehicles.reduce((acc, vehicle) => {
        acc[vehicle.fuelType] = (acc[vehicle.fuelType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const newFuelData = [
        { label: 'Diesel', value: fuelCounts['Diesel'] || 0, color: '#0D47A1' },
        { label: 'Gasolina', value: fuelCounts['Gasoline'] || 0, color: '#1E88E5' },
        { label: 'Eléctrico', value: fuelCounts['Electric'] || 0, color: '#90CAF9' },
    ];

    return { healthData: newHealthData, fuelData: newFuelData };
  }, [vehicles, notifications, loading]);

  const upcomingNotifications = notifications.filter(n => !n.isRead);

  if (loading && vehicles.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-neutral-black mb-4">Resumen de la Flota</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DonutChart title="Salud de la Flota" data={healthData} />
                <DonutChart title="Distribución de Combustible" data={fuelData} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center text-center">
                <Truck size={48} className="text-brand-primary mb-2" />
                <p className="text-5xl font-bold text-neutral-black">{vehicles.length}</p>
                <p className="text-lg text-gray-500">Vehículos Totales</p>
          </div>
       </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-neutral-black mb-4">Notificaciones de Mantenimiento</h2>
        {loading && upcomingNotifications.length === 0 ? (
           <p className="text-center text-gray-500">Cargando notificaciones...</p>
        ) : upcomingNotifications.length > 0 ? (
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {upcomingNotifications.map(notification => (
               <Link to={`/vehicles/${notification.vehicleId}`} key={notification.id} className="block">
                <NotificationCard notification={notification} />
               </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8 flex flex-col items-center">
            <CheckCircle size={48} className="text-status-success mb-4" />
            <h3 className="text-lg font-semibold text-neutral-dark">Todo en orden</h3>
            <p className="text-gray-500">No hay mantenimientos próximos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
