import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import { FaUsers, FaBriefcase, FaUserFriends } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fetchManagerData = async () => {
    // Fetch all teams and projects in parallel for efficiency
    const [teamsRes, projectsRes] = await Promise.all([
        apiClient.get('/teams'),
        apiClient.get('/projects')
    ]);
    return {
        teams: teamsRes.data.data,
        projects: projectsRes.data.data,
    };
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

const ManagerDashboard = () => {
    const { user } = useAuthStore();
    const { data, isLoading } = useQuery({ queryKey: ['managerDashboard'], queryFn: fetchManagerData });

    if (isLoading) return <div className="dark:text-gray-300">Loading dashboard...</div>;

    // Filter data relevant to the current manager
    const myTeams = data?.teams.filter(team => team.leader?._id === user._id) || [];
    const myTeamIds = myTeams.map(team => team._id);
    const myProjects = data?.projects.filter(project =>
        project.assignedTeams.some(team => myTeamIds.includes(team._id))
    ) || [];
    const totalMembers = myTeams.reduce((acc, team) => acc + team.members.length, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome, {user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Here's an overview of your teams and projects.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={<FaUserFriends size={24} className="text-white" />}
                    title="Teams Managed"
                    value={myTeams.length}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<FaBriefcase size={24} className="text-white" />}
                    title="Projects Under Management"
                    value={myProjects.length}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<FaUsers size={24} className="text-white" />}
                    title="Total Team Members"
                    value={totalMembers}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Teams Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">My Teams</h2>
                    <div className="space-y-4">
                        {myTeams.length > 0 ? myTeams.map(team => (
                            <div key={team._id} className="border dark:border-gray-700 p-4 rounded-md">
                                <h3 className="font-semibold dark:text-white">{team.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300">{team.members.length} Members</p>
                            </div>
                        )) : <p className="dark:text-gray-300">You are not leading any teams.</p>}
                    </div>
                </div>

                {/* My Projects Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Active Projects</h2>
                    <div className="space-y-4">
                        {myProjects.length > 0 ? myProjects.map(project => (
                            <div key={project._id} className="border dark:border-gray-700 p-4 rounded-md">
                                <h3 className="font-semibold dark:text-white">{project.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Client: {project.client.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">Status: {project.status.replace('-', ' ')}</p>
                            </div>
                        )) : <p className="dark:text-gray-300">No projects assigned to your teams.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;