import { Ticket } from '../entities/Ticket';

export interface ITicketRepository {
    create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
    findById(id: number): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
    updateStatus(id: number, status: string): Promise<Ticket | null>;
    assignToAgent(id: number, agentId: number | null): Promise<Ticket | null>;
}
