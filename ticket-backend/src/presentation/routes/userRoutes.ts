import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Endpoints disponibles para cualquier usuario logueado
router.get('/agents', authenticateToken, UserController.getAgents);
router.get('/', authenticateToken, UserController.getAllUsers);

// Rutas de administración
router.use(authenticateToken);
router.use(requireRole(['Administrador']));
router.put('/:id/role', UserController.updateRole);

export default router;
