import Team from '../models/Team.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getMyTeams = async(req, res) => {
    try {
        const teams = await Team.find({ members: req.user._id }).populate("members");
        res.json({ data: teams });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllTeams = async(req, res, next) => {
    try {
        const teams = await Team.find().populate('leader', 'name').populate('members', 'name specialization');
        res.status(200).json(new ApiResponse(200, teams, 'Teams retrieved successfully'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const createTeam = async(req, res, next) => {
    const { name, leader, members } = req.body;
    if (!name) return next(new ApiError(400, 'Team name is required'));
    try {
        const newTeam = await Team.create({ name, leader, members });
        res.status(201).json(new ApiResponse(201, newTeam, 'Team created successfully'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const updateTeam = async(req, res, next) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) return next(new ApiError(404, 'Team not found'));
        res.status(200).json(new ApiResponse(200, team, 'Team updated successfully'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const deleteTeam = async(req, res, next) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return next(new ApiError(404, 'Team not found'));
        // Note: You might want to handle what happens to projects assigned to this team
        res.status(200).json(new ApiResponse(200, {}, 'Team deleted successfully'));
    } catch (error) { next(new ApiError(500, error.message)); }
};