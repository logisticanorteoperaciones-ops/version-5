import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import Modal from './ui/Modal';

interface CameraCaptureModalProps {
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }, [stream]);

    useEffect(() => {
        const startCamera = async () => {
            setLoading(true);
            setError(null);
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("No se pudo acceder a la cámara. Asegúrese de haber otorgado los permisos necesarios.");
            } finally {
                setLoading(false);
            }
        };

        startCamera();

        return () => {
            stopStream();
        };
    }, [stopStream]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const imageData = canvas.toDataURL('image/jpeg');
            onCapture(imageData);
            handleClose();
        }
    };
    
    const handleClose = () => {
        stopStream();
        onClose();
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title="Tomar Foto">
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-lg">
                        <Loader2 size={40} className="animate-spin text-brand-primary" />
                        <p className="mt-2 text-neutral-dark">Iniciando cámara...</p>
                    </div>
                )}
                {error && (
                     <div className="p-4 text-center text-status-danger bg-red-50 rounded-lg">
                         {error}
                     </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-auto rounded-lg ${loading || error ? 'hidden' : 'block'}`}
                    onCanPlay={() => setLoading(false)}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!loading && !error && (
                    <div className="mt-4 flex justify-center">
                        <button 
                            onClick={handleCapture}
                            className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
                            aria-label="Tomar foto"
                        >
                            <Camera size={32} />
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CameraCaptureModal;