
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/mockApi';
import { Vehicle } from '../types';
import { useFleetData } from '../hooks/useFleetData';
import { Truck, LogOut, Loader2, CheckCircle, AlertCircle, TrendingUp, Wrench, Send, Camera, Upload, X } from 'lucide-react';
import CameraCaptureModal from '../components/CameraCaptureModal';

const DriverDashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { vehicles, loading: vehiclesLoading, fetchVehicles } = useFleetData();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [newMileage, setNewMileage] = useState('');
    const [observations, setObservations] = useState('');
    const [photoData, setPhotoData] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [isCameraAvailable, setIsCameraAvailable] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        fetchVehicles();
        // Check for camera availability
        navigator.mediaDevices?.enumerateDevices()
            .then(devices => {
                const hasCamera = devices.some(device => device.kind === 'videoinput');
                setIsCameraAvailable(hasCamera);
            });
    }, [fetchVehicles]);

    const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vehicleId = e.target.value;
        const vehicle = vehicles.find(v => v.id === vehicleId) || null;
        setSelectedVehicle(vehicle);
        setFeedback(null);
        setPhotoData(null);
        if (vehicle) {
            setNewMileage(String(vehicle.currentMileage));
        } else {
            setNewMileage('');
        }
    };

    const handleMileageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle || isSubmitting) return;

        const mileageValue = parseInt(newMileage, 10);
        if (isNaN(mileageValue)) {
            setFeedback({ type: 'error', message: 'Por favor, ingrese un número válido.' });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);
        try {
            await api.updateVehicleMileage(selectedVehicle.id, mileageValue);
            setFeedback({ type: 'success', message: '¡Kilometraje actualizado exitosamente!' });
            await fetchVehicles(); // Refresh list to get updated mileage
            setSelectedVehicle(prev => prev ? {...prev, currentMileage: mileageValue} : null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };
    
    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle || !observations.trim() || !currentUser || isSubmitting) return;

        setIsSubmitting(true);
        setFeedback(null);
        try {
            await api.reportMaintenanceNeed({
                vehicleId: selectedVehicle.id,
                reportedBy: currentUser.id,
                observations: observations.trim(),
                imageData: photoData || undefined
            });
            setFeedback({ type: 'success', message: '¡Reporte enviado exitosamente!' });
            setObservations('');
            setPhotoData(null);
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
        <div className="min-h-screen bg-neutral-light flex flex-col">
            <header className="bg-brand-primary shadow-md">
                <div className="max-w-4xl mx-auto p-4 flex justify-between items-center text-white">
                    <div className="flex items-center">
                        <Truck size={28} className="mr-3" />
                        <h1 className="text-xl font-bold">Portal del Conductor</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:block">{currentUser?.name}</span>
                        <button onClick={logout} className="flex items-center text-white hover:text-brand-accent transition-colors">
                            <LogOut size={20} className="mr-1" />
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 space-y-6">
                    {vehiclesLoading && vehicles.length === 0 ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 size={40} className="animate-spin text-brand-primary" />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="vehicle-select" className="block text-lg font-medium text-gray-700 mb-2">Seleccionar Vehículo</label>
                            <select
                                id="vehicle-select"
                                onChange={handleVehicleChange}
                                defaultValue=""
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white text-neutral-black"
                            >
                                <option value="" disabled>-- Elija un vehículo --</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedVehicle && (
                        <div className="space-y-8 pt-4 border-t">
                             {/* Mileage Update Form */}
                             <div>
                                <h3 className="text-xl font-semibold text-neutral-black mb-3">Actualizar Kilometraje</h3>
                                <div className="bg-neutral-light p-4 rounded-lg text-center mb-4">
                                    <p className="text-sm text-gray-500">Kilometraje Actual</p>
                                    <p className="text-4xl font-bold text-neutral-dark">{selectedVehicle.currentMileage.toLocaleString()} <span className="text-xl">km</span></p>
                                </div>
                                <form onSubmit={handleMileageSubmit} className="space-y-4">
                                    <div className="relative">
                                        <TrendingUp size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" value={newMileage} onChange={(e) => setNewMileage(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white text-neutral-black" placeholder="Ingrese el nuevo kilometraje"/>
                                    </div>
                                    <button type="submit" disabled={isSubmitting || String(selectedVehicle.currentMileage) === newMileage} className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-status-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Guardar Kilometraje'}
                                    </button>
                                </form>
                            </div>

                            {/* Maintenance Report Form */}
                             <div className="pt-6 border-t">
                                <h3 className="text-xl font-semibold text-neutral-black mb-3">Reportar Necesidad de Mantenimiento</h3>
                                <form onSubmit={handleReportSubmit} className="space-y-4">
                                    <div>
                                        <textarea value={observations} onChange={(e) => setObservations(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white text-neutral-black" placeholder="Describa la anomalía o necesidad del vehículo..."></textarea>
                                    </div>

                                    {photoData && (
                                        <div className="relative group">
                                            <img src={photoData} alt="Vista previa" className="rounded-lg w-full max-h-48 object-cover"/>
                                            <button 
                                                type="button" 
                                                onClick={() => setPhotoData(null)}
                                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={18}/>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center p-2 border border-dashed rounded-lg text-neutral-dark hover:bg-neutral-light">
                                            <Upload size={18} className="mr-2"/> Subir Foto
                                        </button>
                                        {isCameraAvailable && (
                                            <button type="button" onClick={() => setIsCameraOpen(true)} className="flex-1 flex items-center justify-center p-2 border border-dashed rounded-lg text-neutral-dark hover:bg-neutral-light">
                                                <Camera size={18} className="mr-2"/> Tomar Foto
                                            </button>
                                        )}
                                    </div>

                                    <button type="submit" disabled={isSubmitting || !observations.trim()} className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400">
                                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Wrench size={18} className="mr-2"/> Enviar Reporte</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    
                    {feedback && (
                        <div className={`mt-4 flex items-center p-3 rounded-lg text-sm ${ feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {feedback.type === 'success' ? <CheckCircle size={20} className="mr-2"/> : <AlertCircle size={20} className="mr-2"/>}
                            {feedback.message}
                        </div>
                    )}
                </div>
            </main>
        </div>
        {isCameraOpen && (
             <CameraCaptureModal 
                onClose={() => setIsCameraOpen(false)}
                onCapture={(imageData) => {
                    setPhotoData(imageData);
                    setIsCameraOpen(false);
                }}
             />
        )}
        </>
    );
};

export default DriverDashboard;