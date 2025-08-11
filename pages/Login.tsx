
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await login(username, password);
    if (user) {
      if (user.role === UserRole.DRIVER) {
        navigate('/driver-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError('Credenciales inválidas. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-center text-brand-primary">Logistica Norte</h1>
          </div>
          <h2 className="text-2xl font-bold text-neutral-black">Iniciar Sesión</h2>
          <p className="text-gray-500 mt-1">Bienvenido al portal de flota</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Nombre de usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white text-neutral-black"
              placeholder="Nombre de usuario"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white text-neutral-black"
              placeholder="Contraseña"
            />
          </div>
          
          {error && (
            <div className="flex items-center p-3 rounded-lg bg-red-100 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
            </div>
           )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 transition-colors"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <div className="flex items-center">
                    <LogIn size={20} className="mr-2" />
                    <span>Iniciar Sesión</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;