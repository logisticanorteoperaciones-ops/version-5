import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/mockApi';
import { User, UserRole } from '../types';
import { PlusCircle, Users as UsersIcon, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import UserForm from '../components/UserForm';
import TableSkeleton from '../components/skeletons/TableSkeleton';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/ui/ConfirmModal';

const Users: React.FC = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedUsers = await api.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
            setError("No se pudo cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddSuccess = () => {
        setIsFormModalOpen(false);
        fetchUsers();
    };
    
    const handleDeleteRequest = (user: User) => {
        setError(null);
        setUserToDelete(user);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        
        try {
            await api.deleteUser(userToDelete.id);
            setUserToDelete(null);
            fetchUsers(); // Refresh the list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
            console.error("Failed to delete user:", err);
            setError(errorMessage);
            setUserToDelete(null); // Close modal on error
        }
    };


    const roleBadges: Record<UserRole, string> = {
        [UserRole.ADMIN]: 'bg-status-danger text-white',
        [UserRole.FLEET_MANAGER]: 'bg-brand-accent text-white',
        [UserRole.DRIVER]: 'bg-status-warning text-neutral-black',
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-neutral-black flex items-center">
                        <UsersIcon className="mr-2" />
                        Gestión de Usuarios
                    </h2>
                    <button
                        onClick={() => setIsFormModalOpen(true)}
                        className="flex items-center bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        Añadir Usuario
                    </button>
                </div>
                
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                {loading ? (
                    <TableSkeleton />
                ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-light">
                                <tr>
                                    <th className="p-3 font-semibold text-neutral-dark">Nombre</th>
                                    <th className="p-3 font-semibold text-neutral-dark">Nombre de Usuario</th>
                                    <th className="p-3 font-semibold text-neutral-dark">Rol</th>
                                    <th className="p-3 font-semibold text-neutral-dark text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-neutral-medium">
                                        <td className="p-3 font-medium text-neutral-black">{user.name}</td>
                                        <td className="p-3 text-neutral-dark">{user.username}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${roleBadges[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleDeleteRequest(user)}
                                                disabled={currentUser?.id === user.id}
                                                className="text-gray-400 hover:text-status-danger disabled:text-gray-300 disabled:cursor-not-allowed"
                                                title={currentUser?.id === user.id ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Añadir Nuevo Usuario">
                    <UserForm onSuccess={handleAddSuccess} />
                </Modal>
            </div>
            
            {userToDelete && (
                <ConfirmModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirmar Eliminación"
                >
                    <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?</p>
                    <p className="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                </ConfirmModal>
            )}
        </>
    );
};

export default Users;