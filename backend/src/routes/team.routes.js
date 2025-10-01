import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import { getAllTeams, getMyTeams, createTeam, updateTeam, deleteTeam } from '../controllers/team.controller.js';

const router = Router();
router.use(authMiddleware);

// Normal users can view their own teams
router.get('/my-teams', getMyTeams);

// Admins and Managers can view all teams
router.get('/', roleCheck(['admin', 'owner', 'manager']), getAllTeams);

// Only Admins and Managers can create, update, or delete teams
router.post('/', roleCheck(['admin', 'owner', 'manager']), createTeam);
router.put('/:id', roleCheck(['admin', 'owner', 'manager']), updateTeam);
router.delete('/:id', roleCheck(['admin', 'owner', 'manager']), deleteTeam);

export default router;