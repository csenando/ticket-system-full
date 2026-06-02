import { SqlUserRepository } from '../../infrastructure/repositories/SqlUserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ticket_system_2026';

export class AuthUseCase {
    constructor(private userRepository: SqlUserRepository) {}

    async register(name: string, email: string, passwordPlain: string) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El correo ya está registrado.');
        }

        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        
        // El primer usuario siempre es Admin por defecto (para facilitar pruebas iniciales)
        // en un sistema real, sería 'Usuario Final' y otro admin le da permisos.
        const role = email.includes('admin') ? 'Administrador' : 'Usuario Final';

        const newUser = await this.userRepository.create({
            name,
            email,
            passwordHash,
            role
        });

        // Generar token
        const token = this.generateToken(newUser);
        return { user: { id: newUser.Id, name: newUser.Name, email: newUser.Email, role: newUser.Role }, token };
    }

    async login(email: string, passwordPlain: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas.');
        }

        const isValid = await bcrypt.compare(passwordPlain, user.PasswordHash);
        if (!isValid) {
            throw new Error('Credenciales inválidas.');
        }

        const token = this.generateToken(user);
        return { user: { id: user.Id, name: user.Name, email: user.Email, role: user.Role }, token };
    }

    private generateToken(user: any) {
        return jwt.sign(
            { userId: user.Id, role: user.Role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}
