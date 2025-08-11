
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './hooks/useFleetData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserRole } from './types';

// Layouts & Pages
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import VehiclesList from './pages/VehiclesList';
import VehicleDetail from './pages/VehicleDetail';
import Login from './pages/Login';
import DriverDashboard from './pages/DriverDashboard';
import Users from './pages/Users';
import AIAssistant from './components/AIAssistant';

const AdminLayout: React.FC = () => (
  <div className="flex h-screen bg-neutral-light text-neutral-dark">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light p-6 md:p-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehiclesList />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route 
            path="/users"
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
    <AIAssistant />
  </div>
);

const AppRouter: React.FC = () => {
    const { currentUser } = useAuth();
    
    // If auth state is still loading, don't render routes yet
    if (currentUser === undefined) {
        return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    }

    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route 
                path="/driver-dashboard"
                element={
                    <ProtectedRoute roles={[UserRole.DRIVER]}>
                        <DriverDashboard />
                    </ProtectedRoute>
                }
            />
            
            <Route 
                path="/*"
                element={
                    <ProtectedRoute roles={[UserRole.ADMIN, UserRole.FLEET_MANAGER]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
            <AppRouter/>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
