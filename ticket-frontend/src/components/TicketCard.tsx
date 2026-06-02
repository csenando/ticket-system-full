import React from 'react';
import type { Ticket } from '../types/Ticket';

interface Props {
    ticket: Ticket;
}

export const TicketCard: React.FC<Props> = ({ ticket }) => {
    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'Open': return 'badge-open';
            case 'In Progress': return 'badge-in-progress';
            case 'Resolved': return 'badge-resolved';
            default: return 'badge-open';
        }
    };

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{ticket.title}</h3>
                <span className={`badge ${getBadgeClass(ticket.status)}`}>
                    {ticket.status}
                </span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: 1 }}>
                {ticket.description.length > 100 ? ticket.description.substring(0, 100) + '...' : ticket.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#818cf8' }}>
                    ID: #{ticket.id}
                </span>
            </div>
        </div>
    );
};
