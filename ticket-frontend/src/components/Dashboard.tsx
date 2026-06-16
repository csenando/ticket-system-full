import React, { useEffect, useState } from 'react';
import type { Ticket } from '../types/Ticket';
import { TicketCard } from './TicketCard';
import { TicketForm } from './TicketForm';

export const Dashboard: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tickets');
            if (!response.ok) {
                throw new Error('Error de conexión con el backend.');
            }
            const data = await response.json();
            setTickets(data);
            setError('');
        } catch (err: any) {
            setError(err.message + ' (Asegúrate de que el backend esté corriendo y SQL Server esté configurado)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleTicketCreated = () => {
        setShowForm(false);
        fetchTickets();
    };

    return (
        <div className="app-container">
            <header className="header">
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Portal de Soporte IT
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona y visualiza los tickets del departamento de Sistemas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Volver al Listado' : '+ Nuevo Ticket'}
                </button>
            </header>

            {showForm ? (
                <TicketForm onTicketCreated={handleTicketCreated} />
            ) : (
                <>
                    {error && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: '#fca5a5', borderRadius: '8px', marginBottom: '2rem' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <h2>Cargando tickets...</h2>
                        </div>
                    ) : (
                        <div className="ticket-grid">
                            {tickets.length === 0 && !error ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                                    <h3 style={{ color: 'var(--text-main)' }}>No hay tickets activos</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>El departamento de Sistemas está al día.</p>
                                </div>
                            ) : (
                                tickets.map(ticket => (
                                    <TicketCard key={ticket.id} ticket={ticket} />
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
