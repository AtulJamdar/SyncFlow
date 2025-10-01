import Project from '../models/Project.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getMyProjects = async(req, res) => {
    try {
        const projects = await Project.find({
                "assignedTeams": { $exists: true, $ne: [] }
            })
            .populate("client")
            .populate({
                path: "assignedTeams",
                populate: { path: "members" }
            });

        // Filter projects where user is a member of any assigned team
        const myProjects = projects.filter(project =>
            project.assignedTeams.some(team =>
                team.members.some(member => member._id.equals(req.user._id))
            )
        );

        res.json({ data: myProjects });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllProjects = async(req, res, next) => {
    try {
        const projects = await Project.find()
            .populate('client', 'name company')
            .populate({
                path: 'assignedTeams',
                select: 'name leader members',
                populate: { path: 'leader members', select: 'name' }
            });
        res.status(200).json(new ApiResponse(200, projects, 'Projects retrieved'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const createProject = async(req, res, next) => {
    const { title, description, deadline, status, client, assignedTeams } = req.body;
    if (!title || !client) return next(new ApiError(400, 'Title and Client are required'));
    try {
        const newProject = await Project.create({ title, description, deadline, status, client, assignedTeams });
        res.status(201).json(new ApiResponse(201, newProject, 'Project created'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const updateProject = async(req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return next(new ApiError(404, 'Project not found'));
        res.status(200).json(new ApiResponse(200, project, 'Project updated'));
    } catch (error) { next(new ApiError(500, error.message)); }
};

export const deleteProject = async(req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return next(new ApiError(404, 'Project not found'));
        res.status(200).json(new ApiResponse(200, {}, 'Project deleted'));
    } catch (error) { next(new ApiError(500, error.message)); }
};