import React, { useEffect, useState } from 'react';
// Force vite HMR cache reset
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, Clock, User, AlertCircle } from 'lucide-react';

export const TicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [ticketRes, commentsRes] = await Promise.all([
                fetch(`/api/tickets/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`/api/tickets/${id}/comments`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!ticketRes.ok) throw new Error('Error al cargar el ticket');
            
            setTicket(await ticketRes.json());
            setComments(await commentsRes.json());

            const agentsRes = await fetch('/api/users/agents', { headers: { 'Authorization': `Bearer ${token}` } });
            if (agentsRes.ok) {
                setAgents(await agentsRes.json());
            }

            const usersRes = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
            if (usersRes.ok) {
                setAllUsers(await usersRes.json());
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, token]);

    const updateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/tickets/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setIsStatusMenuOpen(false);
                fetchData();
            } else {
                alert('Error al actualizar estado');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateAgent = async (agentId: number | null) => {
        try {
            const res = await fetch(`/api/tickets/${id}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ agentId })
            });
            if (res.ok) {
                setIsAgentMenuOpen(false);
                fetchData();
            } else {
                alert('Error al asignar agente');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/tickets/${id}/comments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });
            if (response.ok) {
                setNewComment('');
                fetchData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando ticket...</div>;
    if (!ticket) return <div style={{ padding: '2rem' }}>Ticket no encontrado o sin acceso.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div className="flex items-center gap-4" style={{ backgroundColor: '#ffffff', padding: '1.5rem 2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <ArrowLeft size={20} color="#64748b" />
                </button>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '700' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '1.25rem' }}>#{ticket.id}</span>
                    <span style={{ color: '#0f172a' }}>{ticket.title}</span>
                </h2>
                {/* Eliminados los Floating Actions */}
            </div>

            <div className="ticket-detail-container" style={{ display: 'flex', gap: '2rem', flex: 1, alignItems: 'flex-start' }}>
                {/* Columna Principal: Detalles y Comentarios */}
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="panel">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={18} /> Descripción
                        </h4>
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{ticket.description}</p>
                        {ticket.imageUrl && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Archivo Adjunto</h4>
                                <img 
                                    src={ticket.imageUrl} 
                                    alt="Captura adjunta" 
                                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                                />
                            </div>
                        )}
                    </div>

                    <div className="panel">
                        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Actividad ({comments.length})
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                            {comments.map((comment: any) => {
                                const isMe = comment.UserName === user?.name; // Asumiendo que podemos deducir si soy yo, o simplemente estilizar diferente al agente
                                const isAdminOrIT = comment.UserRole === 'Administrador' || comment.UserRole === 'Agente IT';
                                
                                return (
                                <div key={comment.Id} style={{ display: 'flex', gap: '1rem', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAdminOrIT ? '#3b82f6' : '#e2e8f0', color: isAdminOrIT ? 'white' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                                        {comment.UserName.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                            <span style={{ fontWeight: '600', color: '#334155', fontSize: '0.875rem' }}>{comment.UserName}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                {new Date(comment.CreatedAt).toLocaleString()}
                                            </span>
                                            {comment.IsSystemMessage && (
                                                <span className="badge" style={{ backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.7rem' }}>SISTEMA</span>
                                            )}
                                        </div>
                                        <div style={{ 
                                            padding: '1rem', 
                                            backgroundColor: comment.IsSystemMessage ? '#fef3c7' : (isMe ? '#eff6ff' : '#f8fafc'), 
                                            color: '#1e293b',
                                            borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px', 
                                            border: comment.IsSystemMessage ? '1px solid #fde68a' : (isMe ? '1px solid #bfdbfe' : '1px solid #e2e8f0'),
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                            lineHeight: '1.5'
                                        }}>
                                            {comment.Content}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>

                        <form onSubmit={handleAddComment}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <textarea 
                                    className="form-control" 
                                    rows={3} 
                                    placeholder="Escribe un comentario o actualización..."
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" disabled={submitting || !newComment.trim()}>
                                    {submitting ? 'Enviando...' : 'Comentar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Barra Lateral: Metadatos */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="panel">
                        <h4 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>Detalles</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>ESTADO</label>
                                <div style={{ marginTop: '0.25rem', position: 'relative' }}>
                                    <div 
                                        onClick={() => (user?.role === 'Administrador' || user?.role === 'Agente IT') && setIsStatusMenuOpen(!isStatusMenuOpen)}
                                        style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            cursor: (user?.role === 'Administrador' || user?.role === 'Agente IT') ? 'pointer' : 'default',
                                            transition: 'transform 0.2s',
                                            transform: isStatusMenuOpen ? 'scale(0.98)' : 'scale(1)'
                                        }}
                                    >
                                        <span className={`badge badge-${ticket.status === 'Cerrado' ? 'resolved' : ticket.status === 'En Progreso' ? 'progress' : 'open'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', userSelect: 'none' }}>
                                            {ticket.status.toUpperCase()} {(user?.role === 'Administrador' || user?.role === 'Agente IT') && ' ▾'}
                                        </span>
                                    </div>

                                    {/* Glassmorphism Dropdown */}
                                    {isStatusMenuOpen && (
                                        <>
                                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsStatusMenuOpen(false)} />
                                            <div style={{ 
                                                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', zIndex: 50,
                                                width: '240px', padding: '0.5rem', borderRadius: '16px',
                                                background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                                display: 'flex', flexDirection: 'column', gap: '4px',
                                                animation: 'fadeIn 0.2s ease-out'
                                            }}>
                                                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                                                
                                                <button onClick={() => updateStatus('Abierto')} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', 
                                                    border: 'none', background: ticket.status === 'Abierto' ? 'rgba(239, 246, 255, 0.8)' : 'transparent', 
                                                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                                    color: '#1e293b', fontWeight: ticket.status === 'Abierto' ? '600' : '500', transition: 'background 0.2s'
                                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 246, 255, 0.8)'} onMouseOut={e => e.currentTarget.style.background = ticket.status === 'Abierto' ? 'rgba(239, 246, 255, 0.8)' : 'transparent'}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                                                    Abierto
                                                    {ticket.status === 'Abierto' && <span style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</span>}
                                                </button>

                                                <button onClick={() => updateStatus('En Progreso')} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', 
                                                    border: 'none', background: ticket.status === 'En Progreso' ? 'rgba(255, 251, 235, 0.8)' : 'transparent', 
                                                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                                    color: '#1e293b', fontWeight: ticket.status === 'En Progreso' ? '600' : '500', transition: 'background 0.2s'
                                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 251, 235, 0.8)'} onMouseOut={e => e.currentTarget.style.background = ticket.status === 'En Progreso' ? 'rgba(255, 251, 235, 0.8)' : 'transparent'}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                                                    En Progreso
                                                    {ticket.status === 'En Progreso' && <span style={{ marginLeft: 'auto', color: '#f59e0b' }}>✓</span>}
                                                </button>

                                                <button onClick={() => updateStatus('Cerrado')} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', 
                                                    border: 'none', background: ticket.status === 'Cerrado' ? 'rgba(236, 253, 245, 0.8)' : 'transparent', 
                                                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                                    color: '#1e293b', fontWeight: ticket.status === 'Cerrado' ? '600' : '500', transition: 'background 0.2s'
                                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(236, 253, 245, 0.8)'} onMouseOut={e => e.currentTarget.style.background = ticket.status === 'Cerrado' ? 'rgba(236, 253, 245, 0.8)' : 'transparent'}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                                                    Cerrado
                                                    {ticket.status === 'Cerrado' && <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>PRIORIDAD</label>
                                <div style={{ marginTop: '0.25rem', fontWeight: '500' }}>{ticket.priority}</div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>CATEGORÍA</label>
                                <div style={{ marginTop: '0.25rem' }}>{ticket.category || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <h4 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>Personas</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>ASIGNADO A</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    
                                    <div style={{ position: 'relative' }}>
                                        {user?.role === 'Administrador' ? (
                                            <>
                                                <div 
                                                    onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                                                    style={{ 
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                        cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '12px',
                                                        background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155',
                                                        transition: 'transform 0.2s', transform: isAgentMenuOpen ? 'scale(0.98)' : 'scale(1)'
                                                    }}
                                                >
                                                    <User size={16} color="#64748b" />
                                                    <span style={{ fontWeight: '500' }}>
                                                        {ticket.assignedAgentId 
                                                            ? agents.find(a => String(a.Id) === String(ticket.assignedAgentId))?.Name || `Agente #${ticket.assignedAgentId}` 
                                                            : 'Sin asignar'}
                                                    </span>
                                                    <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>▾</span>
                                                </div>

                                                {/* Glassmorphism Dropdown */}
                                                {isAgentMenuOpen && (
                                                    <>
                                                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsAgentMenuOpen(false)} />
                                                        <div style={{ 
                                                            position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', zIndex: 50,
                                                            width: '240px', padding: '0.5rem', borderRadius: '16px',
                                                            background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                                            display: 'flex', flexDirection: 'column', gap: '4px',
                                                            maxHeight: '220px', overflowY: 'auto',
                                                            animation: 'fadeIn 0.2s ease-out'
                                                        }}>
                                                            <button onClick={() => updateAgent(null)} style={{ 
                                                                display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', 
                                                                border: 'none', background: !ticket.assignedAgentId ? 'rgba(241, 245, 249, 0.8)' : 'transparent', 
                                                                borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                                                color: '#475569', fontWeight: !ticket.assignedAgentId ? '600' : '400', transition: 'background 0.2s'
                                                            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)'} onMouseOut={e => e.currentTarget.style.background = !ticket.assignedAgentId ? 'rgba(241, 245, 249, 0.8)' : 'transparent'}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={12} color="#94a3b8"/></div>
                                                                -- Sin asignar --
                                                                {!ticket.assignedAgentId && <span style={{ marginLeft: 'auto', color: '#64748b' }}>✓</span>}
                                                            </button>

                                                            {agents.map(a => (
                                                                <button key={a.Id} onClick={() => updateAgent(a.Id)} style={{ 
                                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', 
                                                                    border: 'none', background: String(ticket.assignedAgentId) === String(a.Id) ? 'rgba(239, 246, 255, 0.8)' : 'transparent', 
                                                                    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                                                    color: '#1e293b', fontWeight: String(ticket.assignedAgentId) === String(a.Id) ? '600' : '500', transition: 'background 0.2s'
                                                                }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 246, 255, 0.8)'} onMouseOut={e => e.currentTarget.style.background = String(ticket.assignedAgentId) === String(a.Id) ? 'rgba(239, 246, 255, 0.8)' : 'transparent'}>
                                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.7rem', flexShrink: 0 }}>
                                                                        {a.Name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.Name}</span>
                                                                    {String(ticket.assignedAgentId) === String(a.Id) && <span style={{ marginLeft: 'auto', color: '#3b82f6', flexShrink: 0 }}>✓</span>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            /* Modo vista para usuarios y agentes */
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                                                <User size={16} color="#64748b" />
                                                <span style={{ fontWeight: '500' }}>
                                                    {ticket.assignedAgentId 
                                                        ? agents.find(a => String(a.Id) === String(ticket.assignedAgentId))?.Name || `Agente #${ticket.assignedAgentId}` 
                                                        : 'Sin asignar'}
                                                </span>
                                            </div>
                                        )}
                                    </div>                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>SOLICITANTE</label>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                                    <User size={16} color="#64748b" />
                                    <span style={{ fontWeight: '500' }}>
                                        {allUsers.find(u => String(u.Id) === String(ticket.userId))?.Name || `Usuario #${ticket.userId}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <Clock size={16} />
                            <span>Creado el {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
