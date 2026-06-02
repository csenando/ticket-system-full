import { Request, Response } from 'express';
import { AuthUseCase } from '../../application/use-cases/AuthUseCase';
import { SqlUserRepository } from '../../infrastructure/repositories/SqlUserRepository';

const userRepository = new SqlUserRepository();
const authUseCase = new AuthUseCase(userRepository);

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
                return;
            }

            const result = await authUseCase.register(name, email, password);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email y contraseña son obligatorios' });
                return;
            }

            const result = await authUseCase.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
