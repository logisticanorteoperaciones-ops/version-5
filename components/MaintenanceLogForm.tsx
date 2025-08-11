
import React, { useState } from 'react';
import { useFleetData } from '../hooks/useFleetData';
import { MaintenanceType } from '../types';

interface MaintenanceLogFormProps {
  vehicleId: string;
  onSuccess: () => void;
}

const MaintenanceLogForm: React.FC<MaintenanceLogFormProps> = ({ vehicleId, onSuccess }) => {
  const { logMaintenance } = useFleetData();
  const [formData, setFormData] = useState({
    serviceType: MaintenanceType.OIL_CHANGE,
    date: new Date().toISOString().split('T')[0],
    cost: 0,
    workshop: '',
    notes: '',
    mileageAtService: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'cost' || name === 'mileageAtService' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await logMaintenance({ ...formData, vehicleId });
      onSuccess();
    } catch (error) {
      console.error("Failed to log maintenance", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
        <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className="p-2 border rounded-lg w-full bg-white text-neutral-black">
            {Object.values(MaintenanceType).filter(type => type !== MaintenanceType.DRIVER_REPORTED_ISSUE).map(type => (
            <option key={type} value={type}>{type}</option>
            ))}
        </select>
      </div>

       <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha del Servicio</label>
        <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="mileageAtService" className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
            <input id="mileageAtService" type="number" name="mileageAtService" value={formData.mileageAtService} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black" placeholder="Ej: 150000"/>
        </div>
        <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
            <input id="cost" type="number" name="cost" value={formData.cost} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black" placeholder="Ej: 350"/>
        </div>
      </div>

      <div>
        <label htmlFor="workshop" className="block text-sm font-medium text-gray-700 mb-1">Taller</label>
        <input id="workshop" type="text" name="workshop" placeholder="Nombre del taller" value={formData.workshop} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
        <textarea id="notes" name="notes" placeholder="Detalles del servicio, piezas cambiadas, etc." value={formData.notes} onChange={handleChange} className="p-2 border rounded-lg w-full h-24 bg-white text-neutral-black"/>
      </div>
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white p-3 mt-2 rounded-lg font-semibold hover:bg-brand-secondary disabled:bg-gray-400">
        {isSubmitting ? 'Registrando...' : 'Registrar Mantenimiento'}
      </button>
    </form>
  );
};

export default MaintenanceLogForm;
