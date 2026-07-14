import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { CommentController } from '../controllers/CommentController';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Endpoint dedicated to serving images without nginx interference
router.get('/image', TicketController.getImage);

router.use(authenticateToken);

router.post('/', upload.single('image'), TicketController.create);
router.get('/', TicketController.getAll);

router.get('/:id', TicketController.getById);
router.put('/:id/status', requireRole(['Agente IT', 'Administrador']), TicketController.updateStatus);
router.put('/:id/assign', requireRole(['Agente IT', 'Administrador']), TicketController.assignAgent);

router.get('/:id/comments', CommentController.getComments);
router.post('/:id/comments', CommentController.addComment);

export default router;
