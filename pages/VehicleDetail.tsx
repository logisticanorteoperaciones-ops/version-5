

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFleetData } from '../hooks/useFleetData';
import { Vehicle, MaintenanceHistory, ScheduledMaintenance, MaintenanceRequest } from '../types';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import MaintenanceLogForm from '../components/MaintenanceLogForm';
import MaintenanceScheduleForm from '../components/MaintenanceScheduleForm';
import VehicleDetailSkeleton from '../components/skeletons/VehicleDetailSkeleton';
import MaintenanceTimeline from '../components/MaintenanceTimeline';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVehicleDetails, loading } = useFleetData();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>();
  const [history, setHistory] = useState<MaintenanceHistory[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledMaintenance[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLogModalOpen, setLogModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (id) {
      const { vehicle, history, scheduled, requests } = await getVehicleDetails(id);
      setVehicle(vehicle);
      setHistory(history);
      setScheduled(scheduled);
      setRequests(requests);
    }
  }, [id, getVehicleDetails]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !vehicle) {
    return <VehicleDetailSkeleton />;
  }

  if (!vehicle) {
    return (
        <div className="text-center p-10">
            <h2 className="text-2xl font-bold text-neutral-dark mb-4">Vehículo no encontrado</h2>
            <Link to="/vehicles" className="text-brand-primary font-semibold hover:underline">
                <ChevronLeft size={20} className="mr-1 inline-block" />
                Volver a la lista de vehículos
            </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/vehicles" className="flex items-center text-brand-primary font-semibold hover:underline">
        <ChevronLeft size={20} className="mr-1" />
        Volver a la lista de vehículos
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-neutral-black">{vehicle.brand} {vehicle.model}</h1>
                <p className="text-lg text-gray-500">{vehicle.plate}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold">{vehicle.currentMileage.toLocaleString()} km</p>
                <p className="text-sm text-gray-500">Kilometraje Actual</p>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t pt-4 text-sm text-neutral-dark">
            <div><span className="font-semibold text-neutral-black">Año:</span> {vehicle.year}</div>
            <div><span className="font-semibold text-neutral-black">VIN:</span> {vehicle.vin}</div>
            <div><span className="font-semibold text-neutral-black">Combustible:</span> {vehicle.fuelType}</div>
            <div><span className="font-semibold text-neutral-black">En Flota Desde:</span> {new Date(vehicle.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-black">Línea de Tiempo de Mantenimiento</h2>
              <div className="flex items-center space-x-2">
                 <button onClick={() => setLogModalOpen(true)} className="flex items-center bg-brand-accent text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors">
                    <PlusCircle size={16} className="mr-2" /> Registrar Servicio
                </button>
                 <button onClick={() => setScheduleModalOpen(true)} className="flex items-center bg-neutral-dark text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-neutral-black transition-colors">
                    <PlusCircle size={16} className="mr-2" /> Programar Servicio
                </button>
              </div>
          </div>
          <MaintenanceTimeline vehicle={vehicle} history={history} scheduled={scheduled} requests={requests} />
       </div>


      <Modal isOpen={isLogModalOpen} onClose={() => setLogModalOpen(false)} title={`Registrar Mantenimiento para ${vehicle.plate}`}>
          <MaintenanceLogForm vehicleId={vehicle.id} onSuccess={() => { setLogModalOpen(false); fetchData(); }} />
      </Modal>

      <Modal isOpen={isScheduleModalOpen} onClose={() => setScheduleModalOpen(false)} title={`Programar Mantenimiento para ${vehicle.plate}`}>
          <MaintenanceScheduleForm vehicleId={vehicle.id} onSuccess={() => { setScheduleModalOpen(false); fetchData(); }} />
      </Modal>

    </div>
  );
};

export default VehicleDetail;