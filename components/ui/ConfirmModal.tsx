import React, { ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, children, isDestructive = true }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start">
           {isDestructive && <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-status-danger" aria-hidden="true" />
            </div>}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-neutral-black">{title}</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {children}
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
            <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
            >
                Cancelar
            </button>
             <button
                type="button"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDestructive ? 'bg-status-danger hover:bg-red-700 focus:ring-red-500' : 'bg-brand-primary hover:bg-brand-secondary focus:ring-brand-accent'}`}
                onClick={onConfirm}
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;