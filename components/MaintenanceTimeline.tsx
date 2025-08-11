import React, { useMemo, useState } from 'react';
import { Vehicle, MaintenanceHistory, ScheduledMaintenance, MaintenanceType, MaintenanceRequest } from '../types';
import { Droplet, CircleDashed, Disc3, RefreshCw, ClipboardCheck, Settings2, Wrench, CheckCircle, AlertTriangle, CalendarClock, Image as ImageIcon } from 'lucide-react';
import Modal from './ui/Modal';

interface TimelineProps {
    vehicle: Vehicle;
    history: MaintenanceHistory[];
    scheduled: ScheduledMaintenance[];
    requests: MaintenanceRequest[];
}

const getMaintenanceIcon = (type: MaintenanceType) => {
    const iconProps = { size: 20, className: "text-white" };
    const icons: Record<MaintenanceType, React.ReactNode> = {
        [MaintenanceType.OIL_CHANGE]: <Droplet {...iconProps} />,
        [MaintenanceType.BRAKE_INSPECTION]: <Disc3 {...iconProps} />,
        [MaintenanceType.TIRE_ROTATION]: <RefreshCw {...iconProps} />,
        [MaintenanceType.ANNUAL_INSPECTION]: <ClipboardCheck {...iconProps} />,
        [MaintenanceType.ENGINE_TUNE_UP]: <Settings2 {...iconProps} />,
        [MaintenanceType.DRIVER_REPORTED_ISSUE]: <Wrench {...iconProps} />,
    };
    return icons[type] || <Wrench {...iconProps} />;
};

const MaintenanceTimeline: React.FC<TimelineProps> = ({ vehicle, history, scheduled, requests }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const openImageModal = (imageData: string) => {
        setViewingImage(imageData);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setViewingImage(null);
        setIsImageModalOpen(false);
    };
    
    const timelineEvents = useMemo(() => {
        const now = new Date();
        const events: any[] = [];

        // History events
        history.forEach(h => events.push({
            date: new Date(h.date),
            type: 'history',
            status: 'completed',
            data: h
        }));
        
        // Driver reported issues (open)
        requests.forEach(r => {
            events.push({
                date: new Date(r.createdAt),
                type: 'request',
                status: 'overdue', // treat as attention needed
                data: {
                    serviceType: MaintenanceType.DRIVER_REPORTED_ISSUE,
                    ...r
                }
            });
        });

        // Scheduled events
        scheduled.forEach(s => {
            if (s.frequencyDays) {
                 const lastService = history
                    .filter(h => h.vehicleId === s.vehicleId && h.serviceType === s.serviceType)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                
                const baseDate = new Date(lastService?.date || vehicle.createdAt);
                const dueDate = new Date(baseDate.setDate(baseDate.getDate() + s.frequencyDays));

                let status = 'upcoming';
                if (dueDate < now) status = 'overdue';

                events.push({
                    date: dueDate,
                    type: 'scheduled',
                    status,
                    data: s
                });
            }
             if (s.frequencyKm) {
                 const lastService = history
                    .filter(h => h.vehicleId === s.vehicleId && h.serviceType === s.serviceType)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                 const lastServiceMileage = lastService?.mileageAtService || 0;
                 const dueMileage = lastServiceMileage + s.frequencyKm;

                 if (vehicle.currentMileage >= dueMileage) {
                    // If it's already overdue by mileage, and not already on the timeline by date, add it as overdue.
                    if (!events.some(e => e.data.id === s.id && e.type === 'scheduled')) {
                         events.push({
                            date: new Date(), // show as today if overdue by km
                            type: 'scheduled_km',
                            status: 'overdue',
                            data: s,
                            dueMileage
                        });
                    }
                 }
             }
        });

        return events.sort((a, b) => b.date.getTime() - a.date.getTime());

    }, [history, scheduled, requests, vehicle]);

    if(timelineEvents.length === 0) {
        return (
            <div className="text-center text-gray-400 py-8 flex flex-col items-center">
                <CircleDashed size={48} className="text-neutral-medium mb-4" />
                <h3 className="text-lg font-semibold text-neutral-dark">Sin Historial</h3>
                <p className="text-gray-500">No hay mantenimientos registrados o programados para este vehículo.</p>
          </div>
        )
    }

    return (
        <>
        <div className="relative pl-8 border-l-2 border-neutral-medium">
            {timelineEvents.map((event, index) => {
                const isHistory = event.type === 'history';
                const isRequest = event.type === 'request';
                const isKmOnly = event.type === 'scheduled_km';
                const { serviceType, imageData } = event.data;

                const statusConfig = {
                    completed: { color: 'bg-status-success', icon: <CheckCircle size={16} className="mr-2"/>, label: 'Completado' },
                    upcoming: { color: 'bg-status-warning', icon: <CalendarClock size={16} className="mr-2"/>, label: 'Próximo' },
                    overdue: { color: 'bg-status-danger', icon: <AlertTriangle size={16} className="mr-2"/>, label: 'Vencido' },
                };

                const currentStatus = statusConfig[event.status as keyof typeof statusConfig];

                return (
                    <div key={`${event.type}-${event.data.id}-${index}`} className="mb-8">
                        <div className={`absolute -left-[21px] w-10 h-10 rounded-full ${currentStatus.color} flex items-center justify-center`}>
                           {getMaintenanceIcon(serviceType)}
                        </div>
                        <div className="p-4 bg-neutral-light rounded-lg ml-8 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                               <p className="font-bold text-neutral-black">{serviceType}</p>
                               <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${currentStatus.color} text-white`}>
                                   {currentStatus.icon} {isRequest ? "Reportado" : currentStatus.label}
                               </span>
                            </div>
                           
                            <p className="text-sm text-gray-600">
                                {isHistory ? `Realizado el ${event.date.toLocaleDateString()}` : 
                                 isRequest ? `Reportado el ${event.date.toLocaleDateString()}` : 
                                 `Vence aprox. el ${event.date.toLocaleDateString()}`}
                            </p>
                            
                            {isHistory && (
                                <div className="text-xs text-gray-500 mt-1">
                                    <span>Taller: {event.data.workshop}</span> | <span>Costo: ${event.data.cost}</span> | <span>KM: {event.data.mileageAtService.toLocaleString()}</span>
                                </div>
                            )}
                            
                            {isRequest && (
                                <div className="mt-2 p-2 bg-white rounded border border-neutral-medium">
                                    <p className="italic text-sm text-gray-700">"{event.data.observations}"</p>
                                    <p className="text-xs text-right font-semibold mt-1 text-gray-500">- {event.data.reportedBy}</p>
                                    {imageData && (
                                        <div className="mt-2">
                                            <button onClick={() => openImageModal(imageData)} className="w-full">
                                                <img src={imageData} alt="Prueba del reporte" className="rounded-lg max-h-40 w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                             {!isHistory && !isRequest && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {event.data.frequencyDays && `Programado cada ${event.data.frequencyDays} días. `}
                                    {event.data.frequencyKm && `Programado cada ${event.data.frequencyKm.toLocaleString()} km.`}
                                </p>
                             )}

                             {isKmOnly && (
                                 <p className="text-xs font-bold text-status-danger mt-1">
                                     Servicio requerido por kilometraje (Vencido a los {event.dueMileage.toLocaleString()} km).
                                 </p>
                             )}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {viewingImage && (
             <Modal isOpen={isImageModalOpen} onClose={closeImageModal} title="Evidencia del Reporte">
                 <img src={viewingImage} alt="Evidencia del reporte en tamaño completo" className="w-full h-auto rounded-lg" />
            </Modal>
        )}
        </>
    );
};

export default MaintenanceTimeline;