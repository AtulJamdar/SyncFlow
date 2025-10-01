import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const getAdminAnalytics = async(req, res, next) => {
    try {
        // This line reads the time period sent from the frontend. This is the key change.
        const { period = 'monthly' } = req.query;

        let dateFilter = {};
        let groupStage = {};
        let sortStage = {};

        // The switch statement changes the database query based on the period
        switch (period) {
            case 'daily':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                dateFilter = { status: 'paid', createdAt: { $gte: thirtyDaysAgo } };
                groupStage = {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
                    total: { $sum: '$amount' }
                };
                sortStage = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
                break;

            case 'yearly':
                dateFilter = { status: 'paid' };
                groupStage = {
                    _id: { year: { $year: '$createdAt' } },
                    total: { $sum: '$amount' }
                };
                sortStage = { '_id.year': 1 };
                break;

            case 'monthly':
            default:
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                dateFilter = { status: 'paid', createdAt: { $gte: oneYearAgo } };
                groupStage = {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    total: { $sum: '$amount' }
                };
                sortStage = { '_id.year': 1, '_id.month': 1 };
                break;
        }

        // The 'revenue' variable is now dynamic based on the logic above
        const revenue = await Invoice.aggregate([
            { $match: dateFilter },
            { $group: groupStage },
            { $sort: sortStage }
        ]);

        const projectStatusCounts = await Project.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const invoiceTotals = await Invoice.aggregate([
            { $group: { _id: '$status', total: { $sum: '$amount' } } }
        ]);

        const analyticsData = {
            revenue, // The key here is 'revenue', not 'monthlyRevenue'
            projectStatus: projectStatusCounts,
            invoiceTotals
        };

        res.status(200).json(new ApiResponse(200, analyticsData, `Analytics data retrieved for ${period} period`));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};