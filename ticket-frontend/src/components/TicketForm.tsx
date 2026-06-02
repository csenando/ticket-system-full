import React, { useState } from 'react';

interface Props {
    onTicketCreated: () => void;
}

export const TicketForm: React.FC<Props> = ({ onTicketCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error('Error al crear el ticket');
            }

            setTitle('');
            setDescription('');
            onTicketCreated();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 className="title-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Nuevo Ticket de Soporte</h2>
            
            {error && (
                <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: '#fca5a5', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <div className="input-group">
                <label className="input-label" htmlFor="title">Título del Problema</label>
                <input 
                    id="title"
                    className="input-field" 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                    placeholder="Ej. No enciende la computadora"
                />
            </div>

            <div className="input-group">
                <label className="input-label" htmlFor="description">Descripción Detallada</label>
                <textarea 
                    id="description"
                    className="input-field" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                    rows={4}
                    placeholder="Describe el problema con el mayor detalle posible..."
                />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
        </form>
    );
};
