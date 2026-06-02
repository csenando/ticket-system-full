import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { SqlUserRepository } from '../../infrastructure/repositories/SqlUserRepository';

const userRepository = new SqlUserRepository();

export class UserController {
    static async getAgents(req: AuthRequest, res: Response): Promise<void> {
        try {
            const agents = await userRepository.findAgents();
            res.status(200).json(agents);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const users = await userRepository.findAll();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRole(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id as string);
            const { role } = req.body;

            if (isNaN(userId) || !role) {
                res.status(400).json({ error: 'ID de usuario y rol son obligatorios' });
                return;
            }

            const validRoles = ['Usuario Final', 'Agente IT', 'Administrador'];
            if (!validRoles.includes(role)) {
                res.status(400).json({ error: 'Rol inválido' });
                return;
            }

            const updatedUser = await userRepository.updateRole(userId, role);
            if (!updatedUser) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
