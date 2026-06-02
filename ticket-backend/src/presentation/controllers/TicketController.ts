import { Request, Response } from 'express';
import { CreateTicketUseCase } from '../../application/use-cases/CreateTicketUseCase';
import { GetAllTicketsUseCase } from '../../application/use-cases/GetAllTicketsUseCase';
import { GetTicketByIdUseCase } from '../../application/use-cases/GetTicketByIdUseCase';
import { UpdateTicketStatusUseCase } from '../../application/use-cases/UpdateTicketStatusUseCase';
import { AssignTicketUseCase } from '../../application/use-cases/AssignTicketUseCase';
import { SqlTicketRepository } from '../../infrastructure/repositories/SqlTicketRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

const ticketRepository = new SqlTicketRepository();
const createTicketUseCase = new CreateTicketUseCase(ticketRepository);
const getAllTicketsUseCase = new GetAllTicketsUseCase(ticketRepository);
const getTicketByIdUseCase = new GetTicketByIdUseCase(ticketRepository);
const updateTicketStatusUseCase = new UpdateTicketStatusUseCase(ticketRepository);
const assignTicketUseCase = new AssignTicketUseCase(ticketRepository);

export class TicketController {
    static async assignAgent(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ticketId = parseInt(req.params.id as string);
            const { agentId } = req.body;

            if (isNaN(ticketId)) {
                res.status(400).json({ error: 'ID de ticket inválido' });
                return;
            }

            const updatedTicket = await assignTicketUseCase.execute(ticketId, agentId === null ? null : parseInt(agentId));
            res.status(200).json(updatedTicket);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ticketId = parseInt(req.params.id as string);
            const { status } = req.body;

            if (isNaN(ticketId) || !status) {
                res.status(400).json({ error: 'ID de ticket y estado son obligatorios' });
                return;
            }

            const updatedTicket = await updateTicketStatusUseCase.execute(ticketId, status);
            res.status(200).json(updatedTicket);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getById(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Usuario no autenticado' });
                return;
            }
            const ticketId = parseInt(req.params.id as string);
            if (isNaN(ticketId)) {
                res.status(400).json({ error: 'ID de ticket inválido' });
                return;
            }
            const ticket = await getTicketByIdUseCase.execute(ticketId, req.user.userId, req.user.role);
            if (!ticket) {
                res.status(404).json({ error: 'Ticket no encontrado' });
                return;
            }
            res.status(200).json(ticket);
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    }

    static async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Usuario no autenticado' });
                return;
            }

            const ticketData = { 
                ...req.body, 
                userId: req.user.userId,
                priority: req.body.priority || 'Media',
                status: req.body.status || 'Abierto',
                category: req.body.category || 'Soporte'
            }; 
            const newTicket = await createTicketUseCase.execute(ticketData);
            res.status(201).json(newTicket);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Usuario no autenticado' });
                return;
            }
            const tickets = await getAllTicketsUseCase.execute(req.user.userId, req.user.role);
            res.status(200).json(tickets);
        } catch (error: any) {
            console.error('[TicketController] Error en getAll:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
