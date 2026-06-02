import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { SqlCommentRepository } from '../../infrastructure/repositories/SqlCommentRepository';

const commentRepository = new SqlCommentRepository();

export class CommentController {
    static async getComments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ticketId = parseInt(req.params.id as string);
            if (isNaN(ticketId)) {
                res.status(400).json({ error: 'ID de ticket inválido' });
                return;
            }

            const comments = await commentRepository.findByTicketId(ticketId);
            res.status(200).json(comments);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addComment(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }

            const ticketId = parseInt(req.params.id as string);
            const { content } = req.body;

            if (isNaN(ticketId) || !content) {
                res.status(400).json({ error: 'ID de ticket y contenido son obligatorios' });
                return;
            }

            const newComment = await commentRepository.create({
                ticketId,
                userId: req.user.userId,
                content
            });

            res.status(201).json(newComment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
