
import React, { useState } from 'react';
import { useFleetData } from '../hooks/useFleetData';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { Vehicle } from '../types';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/VehicleForm';
import TableSkeleton from '../components/skeletons/TableSkeleton';

const VehiclesList: React.FC = () => {
  const { vehicles, loading } = useFleetData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-black">Flota de Vehículos</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-white text-neutral-black"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
          >
            <PlusCircle size={20} className="mr-2" />
            Añadir Vehículo
          </button>
        </div>
      </div>

      {loading && vehicles.length === 0 ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-light">
              <tr>
                <th className="p-3 font-semibold">Matrícula</th>
                <th className="p-3 font-semibold">Marca y Modelo</th>
                <th className="p-3 font-semibold">Año</th>
                <th className="p-3 font-semibold">Kilometraje Actual</th>
                <th className="p-3 font-semibold">Tipo de Combustible</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? filteredVehicles.map((vehicle: Vehicle) => (
                <tr 
                  key={vehicle.id} 
                  className="border-b border-neutral-medium hover:bg-neutral-light cursor-pointer"
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                  <td className="p-3 font-medium text-brand-primary">{vehicle.plate}</td>
                  <td className="p-3">{vehicle.brand} {vehicle.model}</td>
                  <td className="p-3">{vehicle.year}</td>
                  <td className="p-3">{vehicle.currentMileage.toLocaleString()} km</td>
                  <td className="p-3">{vehicle.fuelType}</td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                        No se encontraron vehículos que coincidan con la búsqueda.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Vehículo">
          <VehicleForm onSuccess={() => setIsModalOpen(false)} />
       </Modal>
    </div>
  );
};

export default VehiclesList;