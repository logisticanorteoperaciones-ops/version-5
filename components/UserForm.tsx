
import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { User, UserRole } from '../types';

interface UserFormProps {
    onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: UserRole.DRIVER,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name || !formData.username || !formData.password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await api.addUser(formData as Omit<User, 'id'>);
            onSuccess();
        } catch (error) {
            console.error("Failed to add user", error);
            setError('No se pudo crear el usuario.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
                type="text"
                name="name"
                placeholder="Nombre y Apellido"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-2 border rounded-lg w-full bg-white text-neutral-black"
            />
            <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                required
                className="p-2 border rounded-lg w-full bg-white text-neutral-black"
            />
             <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-2 border rounded-lg w-full bg-white text-neutral-black"
            />
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-2 border rounded-lg w-full bg-white text-neutral-black"
            >
                <option value={UserRole.DRIVER}>Conductor</option>
                <option value={UserRole.FLEET_MANAGER}>Gestor de Flota</option>
                 <option value={UserRole.ADMIN}>Administrator</option>
            </select>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary text-white p-3 rounded-lg font-semibold hover:bg-brand-secondary disabled:bg-gray-400"
            >
                {isSubmitting ? 'Creando Usuario...' : 'Crear Usuario'}
            </button>
        </form>
    );
};

export default UserForm;