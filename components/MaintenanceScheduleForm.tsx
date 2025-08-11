
import React, { useState } from 'react';
import { useFleetData } from '../hooks/useFleetData';
import { MaintenanceType } from '../types';

interface MaintenanceScheduleFormProps {
  vehicleId: string;
  onSuccess: () => void;
}

const MaintenanceScheduleForm: React.FC<MaintenanceScheduleFormProps> = ({ vehicleId, onSuccess }) => {
  const { scheduleMaintenance } = useFleetData();
  const [formData, setFormData] = useState({
    serviceType: MaintenanceType.OIL_CHANGE,
    frequencyDays: undefined as number | undefined,
    frequencyKm: undefined as number | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Allow clearing the input
    const numValue = value === '' ? undefined : parseInt(value, 10);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, serviceType: e.target.value as MaintenanceType }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.frequencyDays && !formData.frequencyKm) {
        alert('Debe especificar una frecuencia en días o en kilómetros.');
        return;
    }
    setIsSubmitting(true);
    try {
      await scheduleMaintenance({ ...formData, vehicleId });
      onSuccess();
    } catch (error) {
      console.error("Failed to schedule maintenance", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select name="serviceType" value={formData.serviceType} onChange={handleServiceTypeChange} className="p-2 border rounded-lg w-full bg-white text-neutral-black">
        {Object.values(MaintenanceType).filter(type => type !== MaintenanceType.DRIVER_REPORTED_ISSUE).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      
      <p className="text-sm text-gray-500 text-center">Defina la frecuencia (puede usar una o ambas).</p>
      
      <div className="flex items-center space-x-2">
        <input 
            type="number" 
            name="frequencyKm" 
            placeholder="Frecuencia por Kilometraje" 
            value={formData.frequencyKm || ''} 
            onChange={handleChange} 
            className="p-2 border rounded-lg w-full bg-white text-neutral-black"
        />
         <span className="text-gray-600">km</span>
      </div>

       <div className="flex items-center space-x-2">
        <input 
            type="number" 
            name="frequencyDays" 
            placeholder="Frecuencia por Días" 
            value={formData.frequencyDays || ''} 
            onChange={handleChange} 
            className="p-2 border rounded-lg w-full bg-white text-neutral-black"
        />
        <span className="text-gray-600">días</span>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white p-3 rounded-lg font-semibold hover:bg-brand-secondary disabled:bg-gray-400">
        {isSubmitting ? 'Programando...' : 'Programar Mantenimiento'}
      </button>
    </form>
  );
};

export default MaintenanceScheduleForm;