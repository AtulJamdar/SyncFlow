import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import { getAllInvoices, createInvoice, updateInvoice, deleteInvoice } from '../controllers/invoice.controller.js';

const router = Router();
router.use(authMiddleware);

// Admins and Accountants can view all invoices
router.get('/', roleCheck(['admin', 'owner', 'accountant']), getAllInvoices);

// Only Admins and Accountants can manage invoices
router.post('/', roleCheck(['admin', 'owner', 'accountant']), createInvoice);
router.put('/:id', roleCheck(['admin', 'owner', 'accountant']), updateInvoice);
router.delete('/:id', roleCheck(['admin', 'owner', 'accountant']), deleteInvoice);

export default router;