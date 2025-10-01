import Invoice from '../models/Invoice.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getAllInvoices = async(req, res, next) => {
    try {
        const invoices = await Invoice.find()
            .populate('project', 'title')
            .populate('client', 'name');
        res.status(200).json(new ApiResponse(200, invoices, 'Invoices retrieved'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const createInvoice = async(req, res, next) => {
    const { project, client, amount, status, dueDate } = req.body;
    if (!project || !client || !amount || !dueDate) {
        return next(new ApiError(400, 'All fields are required'));
    }
    // Generate a unique invoice number
    const invoiceNumber = `INV-${Date.now()}`;
    try {
        const newInvoice = await Invoice.create({ invoiceNumber, project, client, amount, status, dueDate });
        res.status(201).json(new ApiResponse(201, newInvoice, 'Invoice created'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const updateInvoice = async(req, res, next) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) return next(new ApiError(404, 'Invoice not found'));
        res.status(200).json(new ApiResponse(200, invoice, 'Invoice updated'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const deleteInvoice = async(req, res, next) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return next(new ApiError(404, 'Invoice not found'));
        res.status(200).json(new ApiResponse(200, {}, 'Invoice deleted'));
    } catch (error) { next(new ApiError(500, error.message)); }
};