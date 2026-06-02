import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class GetAllTicketsUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    async execute(userId: number, role: string): Promise<Ticket[]> {
        const allTickets = await this.ticketRepository.findAll();
        
        if (role === 'Usuario Final') {
            return allTickets.filter(t => t.userId === userId);
        }
        
        if (role === 'Agente IT') {
            return allTickets.filter(t => t.assignedAgentId === userId);
        }
        
        return allTickets;
    }
}
