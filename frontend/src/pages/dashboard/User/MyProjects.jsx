import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';

// The data fetching logic is similar to the old dashboard, fetching all necessary info
const fetchUserData = async () => {
    const [teamsRes, projectsRes] = await Promise.all([
        apiClient.get('/teams/my-teams'),
        apiClient.get('/projects/my-projects')
    ]);
    return {
        teams: teamsRes.data.data,
        projects: projectsRes.data.data,
    };
};

const MyProjects = () => {
    const { user } = useAuthStore();
    const { data, isLoading } = useQuery({ queryKey: ['userDataForProjects'], queryFn: fetchUserData });

    if (isLoading) return <div className="p-8 text-center dark:text-gray-300">Loading your projects...</div>;

    // Filter to find projects the current user is a member of
    const myProjects = data?.projects.filter(project =>
        project.assignedTeams.some(teamOnProject =>
            data.teams.find(t => t._id === teamOnProject._id)?.members.some(m => m._id === user._id)
        )
    ) || [];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-white">My Assigned Projects</h1>
            {myProjects.length > 0 ? (
                <div className="space-y-6">
                    {myProjects.map(project => (
                        <div key={project._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{project.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Client: {project.client.name}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                    project.status === 'completed'
                                        ? 'bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-300'
                                        : project.status === 'in-progress'
                                            ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300'
                                            : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100'
                                }`}>
                                    {project.status.replace('-', ' ')}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                                <div className="mt-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team(s) on this Project:</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {project.assignedTeams.map(team => (
                                            <span key={team._id} className="text-xs bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                                {team.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 text-center rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold dark:text-white">No Projects Assigned</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">You are not currently assigned to any projects.</p>
                </div>
            )}
        </div>
    );
};

export default MyProjects;