import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import { getAllProjects, getMyProjects, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';

const router = Router();
router.use(authMiddleware);

// All authenticated users can view their projects
router.get('/my-projects', getMyProjects);

//All authenticated users can view projects
router.get('/', getAllProjects);

// Only Admins can create, update, or delete projects
router.post('/', roleCheck(['admin', 'owner']), createProject);
router.put('/:id', roleCheck(['admin', 'owner']), updateProject);
router.delete('/:id', roleCheck(['admin', 'owner']), deleteProject);

export default router;