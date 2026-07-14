import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

interface Ticket {
    id: number;
    title: string;
    priority: string;
    status: string;
    category: string;
    userId: number;
    createdAt: string;
}

export const Dashboard: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newCategory, setNewCategory] = useState('Hardware');
    const [newPriority, setNewPriority] = useState('Media');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al obtener los tickets');
            const data = await response.json();
            setTickets(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            formData.append('description', newDesc);
            formData.append('category', newCategory);
            formData.append('priority', newPriority);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Error al crear el ticket');
            
            setIsModalOpen(false);
            setNewTitle('');
            setNewDesc('');
            setNewCategory('Hardware');
            setNewPriority('Media');
            setImageFile(null);
            fetchTickets(); // Refresh
        } catch(err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [token]);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Abierto': return <span className="badge badge-open">ABIERTO</span>;
            case 'En Progreso': return <span className="badge badge-progress">EN PROGRESO</span>;
            case 'Cerrado': return <span className="badge badge-resolved">CERRADO</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2>{user?.role === 'Usuario Final' ? 'Mis Tickets' : 'Cola de Tickets'}</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                    <Plus size={16} /> Crear Ticket
                </button>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            <div className="panel" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-light)', backgroundColor: '#fafbfc' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Título</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Categoría</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Prioridad</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Creado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>Cargando...</td></tr>
                        ) : tickets.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>No hay tickets en la cola.</td></tr>
                        ) : (
                            tickets.map(ticket => (
                                <tr 
                                    key={ticket.id} 
                                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                                    style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                                    className="hover:bg-gray-50"
                                >
                                    <td style={{ padding: '1rem' }}>#{ticket.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--primary)' }}>
                                        {ticket.title}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{ticket.category}</td>
                                    <td style={{ padding: '1rem' }}>{ticket.priority}</td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(ticket.status)}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sliding Drawer de Creación */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 100, transition: 'opacity 0.3s' }}>
                    <div className="ticket-modal" style={{ 
                        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', overflowY: 'auto', backgroundColor: '#ffffff', 
                        boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', padding: '2rem', display: 'flex', flexDirection: 'column',
                        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <style>{`
                            @keyframes slideInRight {
                                from { transform: translateX(100%); }
                                to { transform: translateX(0); }
                            }
                        `}</style>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>Nuevo Ticket IT</h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Completa los detalles para que podamos ayudarte lo más rápido posible.</p>
                        
                        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: '600', color: '#334155' }}>Título del Problema</label>
                                <input required className="form-control" placeholder="Ej. La impresora de recepción no enciende" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontWeight: '600', color: '#334155' }}>Categoría</label>
                                    <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                        <option value="Hardware">Hardware / Equipos</option>
                                        <option value="Software">Software / Aplicaciones</option>
                                        <option value="Redes">Redes / Internet</option>
                                        <option value="Accesos">Accesos / Cuentas</option>
                                        <option value="Soporte">Soporte General</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontWeight: '600', color: '#334155' }}>Prioridad</label>
                                    <select className="form-control" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Critica">Crítica (Urgente)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label className="form-label" style={{ fontWeight: '600', color: '#334155' }}>Descripción Detallada</label>
                                <textarea required className="form-control" style={{ flex: 1, minHeight: '150px', resize: 'none' }} placeholder="Describe exactamente el problema, mensajes de error, y cuándo empezó a ocurrir..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ fontWeight: '600', color: '#334155' }}>Adjuntar Imagen (Opcional)</label>
                                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', backgroundColor: '#f8fafc', position: 'relative' }}>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImageFile(e.target.files[0]);
                                            }
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📎</div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                            {imageFile ? imageFile.name : 'Haz clic o arrastra capturas de pantalla aquí'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <button type="button" className="btn" style={{ backgroundColor: 'transparent', color: '#64748b', fontWeight: '500' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: '600' }} disabled={submitting}>
                                    {submitting ? 'Enviando...' : 'Crear Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
