import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class GetTicketByIdUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    async execute(id: number, userId: number, role: string): Promise<Ticket | null> {
        const ticket = await this.ticketRepository.findById(id);
        
        if (!ticket) return null;

        // Security check: If End User, ensure they own the ticket
        if (role === 'Usuario Final' && ticket.userId !== userId) {
            throw new Error('No tienes permiso para ver este ticket');
        }
        
        return ticket;
    }
}
