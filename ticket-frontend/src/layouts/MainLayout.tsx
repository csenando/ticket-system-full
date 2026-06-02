import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Ticket, Users, LayoutDashboard } from 'lucide-react';

export const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        T
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TicketService</span>
                </div>
                
                <nav style={{ padding: '1rem 0', flex: 1 }}>
                    <ul style={{ listStyle: 'none' }}>
                        <li>
                            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', color: 'var(--text-main)' }}>
                                <Ticket size={18} />
                                Tickets
                            </Link>
                        </li>
                        {user?.role === 'Administrador' && (
                            <>
                                <li>
                                    <Link to="/admin/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', color: 'var(--text-main)' }}>
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', color: 'var(--text-main)' }}>
                                        <Users size={18} />
                                        Usuarios
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div style={{ fontWeight: '600' }}>
                        Centro de Soporte IT
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', fontWeight: 'bold' }}>
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
// Force Vite HMR reload
