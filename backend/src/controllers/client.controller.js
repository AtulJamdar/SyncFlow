import Client from '../models/Client.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendEventToAll } from './events.controller.js';


// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin, Manager, Accountant)
export const getAllClients = async(req, res, next) => {
    try {
        const clients = await Client.find().populate('createdBy', 'name email');
        res.status(200).json(new ApiResponse(200, clients, 'Clients retrieved successfully'));
    } catch (error) {
        next(new ApiError(500, 'Error retrieving clients'));
    }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Admin)
export const createClient = async(req, res, next) => {
    const { name, email, company } = req.body;
    if (!name || !email) {
        return next(new ApiError(400, 'Name and email are required'));
    }
    try {
        const newClient = await Client.create({
            name,
            email,
            company,
            createdBy: req.user._id,
        });

        // --- SEND SSE EVENT ---
        const eventData = {
            type: 'NEW_CLIENT',
            payload: {
                message: `${req.user.name} added a new client: ${newClient.name}`,
                clientId: newClient._id,
            }
        };
        sendEventToAll(eventData); // ✅ push update to all connected clients
        // ----------------------

        res.status(201).json(new ApiResponse(201, newClient, 'Client created successfully'));
    } catch (error) {
        next(new ApiError(500, 'Error creating client'));
    }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private (Admin)
export const updateClient = async(req, res, next) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) {
            return next(new ApiError(404, 'Client not found'));
        }
        res.status(200).json(new ApiResponse(200, client, 'Client updated successfully'));
    } catch (error) {
        next(new ApiError(500, 'Error updating client'));
    }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
export const deleteClient = async(req, res, next) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return next(new ApiError(404, 'Client not found'));
        }
        res.status(200).json(new ApiResponse(200, {}, 'Client deleted successfully'));
    } catch (error) {
        next(new ApiError(500, 'Error deleting client'));
    }
};