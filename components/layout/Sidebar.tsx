import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const Sidebar: React.FC = () => {
  const { logout, currentUser } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors ${
      isActive
        ? 'bg-brand-accent text-white'
        : 'text-gray-200 hover:bg-brand-secondary hover:text-white'
    }`;

  return (
    <div className="bg-brand-primary text-white w-64 p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center justify-center mb-10 p-2">
           <h1 className="text-2xl font-bold text-white">Logistica Norte</h1>
        </div>
        <nav>
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard size={20} className="mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/vehicles" className={navLinkClasses}>
            <Truck size={20} className="mr-3" />
            Vehículos
          </NavLink>
           {currentUser?.role === UserRole.ADMIN && (
             <NavLink to="/users" className={navLinkClasses}>
                <Users size={20} className="mr-3" />
                Usuarios
             </NavLink>
           )}
        </nav>
      </div>
      <div>
          <button onClick={logout} className="flex items-center p-3 my-1 rounded-lg transition-colors text-gray-200 hover:bg-brand-secondary hover:text-white w-full">
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
      </div>
    </div>
  );
};

export default Sidebar;