import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import { getAllUsers, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = Router();

// All user routes are protected and for admins only
router.use(authMiddleware);
router.use(roleCheck(['admin', 'owner']));

router.route('/').get(getAllUsers);
router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

export default router;