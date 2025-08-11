
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFleetData } from '../../hooks/useFleetData';

const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { notifications } = useFleetData();
  
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    switch(path) {
      case 'dashboard': return 'Dashboard';
      case 'vehicles': return 'Flota de Vehículos';
      case 'users': return 'Gestión de Usuarios';
      default: return 'Logistica Norte';
    }
  };
  
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <h1 className="text-xl md:text-2xl font-bold text-neutral-black">{getTitle()}</h1>
      <div className="flex items-center space-x-4">
        <button className="relative text-neutral-dark hover:text-brand-primary">
          <Bell size={24} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-status-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadNotifications}
            </span>
          )}
        </button>
        <div className="flex items-center space-x-2">
           <div className="bg-brand-secondary rounded-full h-8 w-8 flex items-center justify-center">
            <User size={18} className="text-white"/>
          </div>
          <span className="hidden md:block text-sm font-medium">{currentUser?.name || 'Usuario'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;