import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class UpdateTicketStatusUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    async execute(ticketId: number, status: string): Promise<Ticket | null> {
        const validStatuses = ['Abierto', 'En Progreso', 'Cerrado'];
        if (!validStatuses.includes(status)) {
            throw new Error('Estado de ticket inválido');
        }

        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        return await this.ticketRepository.updateStatus(ticketId, status);
    }
}
