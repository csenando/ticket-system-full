import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class CreateTicketUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    async execute(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
        // Validation could be added here before calling repository
        if (!ticketData.title || !ticketData.description) {
            throw new Error('Title and Description are required');
        }
        
        return await this.ticketRepository.create(ticketData);
    }
}
