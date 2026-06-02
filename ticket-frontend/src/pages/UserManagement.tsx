import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserCheck, Shield } from 'lucide-react';

interface AppUser {
    Id: number;
    Name: string;
    Email: string;
    Role: string;
    CreatedAt: string;
}

export const UserManagement: React.FC = () => {
    const { token, user: currentUser } = useAuth();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://ticket-backend-api-lp89.onrender.com/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            setUsers(await response.json());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            const response = await fetch(`https://ticket-backend-api-lp89.onrender.com/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) throw new Error('Error al actualizar rol');
            fetchUsers(); // Refresh
        } catch (err: any) {
            alert(err.message);
        }
    };

    const getRoleIcon = (role: string) => {
        switch(role) {
            case 'Administrador': return <ShieldAlert size={16} color="var(--danger)" />;
            case 'Agente IT': return <Shield size={16} color="var(--primary)" />;
            default: return <UserCheck size={16} color="var(--success)" />;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2>Gestión de Usuarios</h2>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            <div className="panel" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-light)', backgroundColor: '#fafbfc' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Rol Actual</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Acción (Cambiar Rol)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center' }}>Cargando...</td></tr>
                        ) : users.map(u => (
                            <tr key={u.Id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1rem' }}>{u.Id}</td>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{u.Name} {currentUser?.id === u.Id ? '(Tú)' : ''}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.Email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getRoleIcon(u.Role)}
                                        {u.Role}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <select 
                                        className="form-control" 
                                        style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                                        value={u.Role}
                                        onChange={(e) => handleRoleChange(u.Id, e.target.value)}
                                        disabled={currentUser?.id === u.Id} // El admin no puede cambiarse su propio rol para evitar bloquearse
                                    >
                                        <option value="Usuario Final">Usuario Final</option>
                                        <option value="Agente IT">Agente IT</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
