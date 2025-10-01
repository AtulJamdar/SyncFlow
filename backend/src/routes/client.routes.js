import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
    getAllClients,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/client.controller.js';

const router = Router();

// All client routes require authentication
router.use(authMiddleware);

router.route('/')
    .get(roleCheck(['admin', 'owner', 'manager', 'accountant']), getAllClients)
    .post(roleCheck(['admin', 'owner']), createClient);

router.route('/:id')
    .put(roleCheck(['admin', 'owner']), updateClient)
    .delete(roleCheck(['admin', 'owner']), deleteClient);

export default router;