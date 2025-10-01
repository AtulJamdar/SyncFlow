import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import { getAdminAnalytics } from '../controllers/analytics.controller.js';

const router = Router();
router.use(authMiddleware, roleCheck(['admin', 'owner']));

router.get('/', getAdminAnalytics);

export default router;