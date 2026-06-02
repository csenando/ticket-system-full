import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';
import { EmailService } from '../../infrastructure/services/EmailService';

// Add IUserRepository locally since we don't have it imported here yet
interface IUserRepository {
    findById(id: number): Promise<any | null>;
}

export class AssignTicketUseCase {
    constructor(
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private emailService: EmailService
    ) {}

    async execute(ticketId: number, agentId: number | null): Promise<Ticket | null> {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        // If assigning, change status to In Progress automatically
        if (agentId !== null && ticket.status === 'Abierto') {
            await this.ticketRepository.updateStatus(ticketId, 'En Progreso');
        }

        const updatedTicket = await this.ticketRepository.assignToAgent(ticketId, agentId);

        // Send email notification if agent is assigned
        if (agentId !== null) {
            const agent = await this.userRepository.findById(agentId);
            if (agent && agent.email) {
                await this.emailService.sendTicketAssignedEmail(agent.email, agent.name, ticket.title, ticketId.toString());
            }
        }

        return updatedTicket;
    }
}
