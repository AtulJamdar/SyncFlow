import { Router } from 'express';
import { sseHandler } from '../controllers/events.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Protect the events endpoint
router.get('/', authMiddleware, sseHandler);

export default router;