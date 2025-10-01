import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import { FaTasks, FaCalendarCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fetchUserData = async () => {
    try {
        const [teamsRes, projectsRes] = await Promise.all([
            apiClient.get('/teams/my-teams'),
            apiClient.get('/projects/my-projects'),
        ]);
        return {
            teams: teamsRes.data?.data || [],
            projects: projectsRes.data?.data || [],
        };
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        return { teams: [], projects: [] }; // fallback so UI doesn't break
    }
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`mr-4 p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const UserDashboard = () => {
    const { user } = useAuthStore();
    const { data, isLoading } = useQuery({
        queryKey: ['userDashboardSummary'],
        queryFn: fetchUserData,
    });

    if (isLoading) return <p className="dark:text-gray-300">Loading summary...</p>;

    // Safe fallback
    const teams = data?.teams || [];
    const projects = data?.projects || [];

    // Filter only projects the logged-in user is part of
    const myProjects = projects.filter(project =>
        project.assignedTeams.some(teamOnProject =>
            teams.find(t => t._id === teamOnProject._id)?.members.some(m => m._id === user._id)
        )
    );

    const activeProjectsCount = myProjects.filter(p => p.status === 'in-progress').length;
    const upcomingDeadlines = myProjects.filter(p => new Date(p.deadline) > new Date()).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">My Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Hello {user?.name}, here is your current summary.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    icon={<FaTasks size={24} className="text-white" />}
                    title="Active Projects"
                    value={activeProjectsCount}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<FaCalendarCheck size={24} className="text-white" />}
                    title="Projects with Deadlines"
                    value={upcomingDeadlines}
                    color="bg-red-500"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2 dark:text-white">Project Details</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You can view all of your assigned projects, deadlines, and team information on the My Projects page.
                </p>
                <Link
                    to="/dashboard/my-projects"
                    className="inline-block bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Go to My Projects
                </Link>
            </div>
        </div>
    );
};

export default UserDashboard;