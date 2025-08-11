
import React, { useState } from 'react';
import { useFleetData } from '../hooks/useFleetData';
import { Vehicle } from '../types';

interface VehicleFormProps {
  onSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess }) => {
  const { addVehicle } = useFleetData();
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    currentMileage: 0,
    fuelType: 'Diesel' as 'Diesel' | 'Gasoline' | 'Electric',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' || name === 'currentMileage' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addVehicle(formData as Omit<Vehicle, 'id' | 'createdAt'>);
      onSuccess();
    } catch (error) {
      console.error("Failed to add vehicle", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="plate" placeholder="Matrícula" value={formData.plate} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <input type="text" name="brand" placeholder="Marca" value={formData.brand} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <input type="text" name="model" placeholder="Modelo" value={formData.model} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <input type="number" name="year" placeholder="Año" value={formData.year} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <input type="text" name="vin" placeholder="VIN" value={formData.vin} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <input type="number" name="currentMileage" placeholder="Kilometraje Actual" value={formData.currentMileage} onChange={handleChange} required className="p-2 border rounded-lg w-full bg-white text-neutral-black"/>
        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="p-2 border rounded-lg w-full bg-white text-neutral-black">
          <option value="Diesel">Diesel</option>
          <option value="Gasoline">Gasolina</option>
          <option value="Electric">Eléctrico</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white p-3 rounded-lg font-semibold hover:bg-brand-secondary disabled:bg-gray-400">
        {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
      </button>
    </form>
  );
};

export default VehicleForm;