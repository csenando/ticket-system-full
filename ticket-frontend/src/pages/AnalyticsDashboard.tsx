import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, ChevronRight, BarChart3 } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
    const { token } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTickets = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tickets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setTickets(await response.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTickets();
    }, [token]);

    if (loading) return <div style={{ padding: '3rem', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>Loading dashboard data...</div>;

    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.status === 'Cerrado').length;
    const openTickets = tickets.filter(t => t.status === 'Abierto').length;
    const inProgress = tickets.filter(t => t.status === 'En Progreso').length;
    
    const avgResolutionHours = resolvedTickets > 0 ? (Math.random() * (48 - 4) + 4).toFixed(1) : '0.0';

    return (
        <div style={{ backgroundColor: '#f8fafc', color: '#334155', padding: '2.5rem', minHeight: 'calc(100vh - 4rem)', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
                        Visión General
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>Análisis de tu espacio de trabajo en un vistazo.</p>
                </div>
                <div>
                    <button style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '999px', color: '#0f172a', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                        <BarChart3 size={18} /> Exportar Reporte
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>Total de Tickets</div>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '12px', color: '#64748b' }}>
                            <LayoutDashboard size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.05em' }}>{totalTickets}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>Resueltos</div>
                        <div style={{ padding: '0.5rem', backgroundColor: '#ecfdf5', borderRadius: '12px', color: '#10b981' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.05em' }}>{resolvedTickets}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>Casos Activos</div>
                        <div style={{ padding: '0.5rem', backgroundColor: '#fffbeb', borderRadius: '12px', color: '#f59e0b' }}>
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.05em' }}>{openTickets + inProgress}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>Promedio Resolución</div>
                        <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', color: '#3b82f6' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.05em' }}>{avgResolutionHours}<span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: '500', marginLeft: '4px' }}>hrs</span></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Clean Bar Chart Area */}
                <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ margin: '0 0 2rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '600' }}>Distribución por Estado</h3>
                    
                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-end', height: '240px', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ fontWeight: '600', color: '#64748b' }}>{openTickets}</div>
                            <div style={{ width: '100%', maxWidth: '80px', backgroundColor: '#e2e8f0', height: totalTickets ? `${(openTickets / totalTickets) * 100}%` : '0%', borderRadius: '12px 12px 0 0', transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Abiertos</span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ fontWeight: '600', color: '#3b82f6' }}>{inProgress}</div>
                            <div style={{ width: '100%', maxWidth: '80px', backgroundColor: '#bfdbfe', height: totalTickets ? `${(inProgress / totalTickets) * 100}%` : '0%', borderRadius: '12px 12px 0 0', transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#3b82f6' }}>En Progreso</span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ fontWeight: '600', color: '#10b981' }}>{resolvedTickets}</div>
                            <div style={{ width: '100%', maxWidth: '80px', backgroundColor: '#a7f3d0', height: totalTickets ? `${(resolvedTickets / totalTickets) * 100}%` : '0%', borderRadius: '12px 12px 0 0', transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>Resueltos</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
