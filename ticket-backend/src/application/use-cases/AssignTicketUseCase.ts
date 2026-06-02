import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class AssignTicketUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    async execute(ticketId: number, agentId: number | null): Promise<Ticket | null> {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        // If assigning, change status to In Progress automatically
        if (agentId !== null && ticket.status === 'Abierto') {
            await this.ticketRepository.updateStatus(ticketId, 'En Progreso');
        }

        return await this.ticketRepository.assignToAgent(ticketId, agentId);
    }
}
