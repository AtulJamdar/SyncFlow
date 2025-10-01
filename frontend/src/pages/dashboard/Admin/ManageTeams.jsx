import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import Modal from '../../../components/common/Modal';
import TeamForm from '../../../components/forms/TeamForm';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Fetch teams based on user role
const fetchTeamsPageData = async () => {
    const teamsRes = await apiClient.get('/teams');
    return {
        teams: teamsRes.data.data,
    };
};

// API Mutations
const createTeam = async (newTeam) => (await apiClient.post('/teams', newTeam)).data.data;
const updateTeam = async ({ id, ...data }) => (await apiClient.put(`/teams/${id}`, data)).data.data;
const deleteTeam = async (id) => await apiClient.delete(`/teams/${id}`);

const ManageTeams = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);

    const canManage = user?.role === 'admin' || user?.role === 'owner' || user?.role === 'manager';

    const { data, isLoading } = useQuery({
        queryKey: ['teamsPageData'],
        queryFn: fetchTeamsPageData
    });

    // Filter teams based on user role
    const getFilteredTeams = () => {
        if (!data?.teams) return [];

        if (user?.role === 'admin' || user?.role === 'owner') {
            // Admin and owner can see all teams
            return data.teams;
        } else if (user?.role === 'manager') {
            // Manager can see teams where they are either the leader OR a member
            return data.teams.filter(team =>
                team.leader?._id === user._id ||
                team.members?.some(member => member._id === user._id)
            );
        }
        return [];
    };

    const filteredTeams = getFilteredTeams();

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teamsPageData'] });
            setIsModalOpen(false);
            setEditingTeam(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "An error occurred"),
    };

    const createMutation = useMutation({
        mutationFn: createTeam,
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Team created!');
            mutationOptions.onSuccess();
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateTeam,
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Team updated!');
            mutationOptions.onSuccess();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTeam,
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Team deleted!');
            mutationOptions.onSuccess();
        }
    });

    const handleFormSubmit = (formData) => {
        if (editingTeam) {
            updateMutation.mutate({ id: editingTeam._id, ...formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const openCreateModal = () => {
        setEditingTeam(null);
        setIsModalOpen(true);
    };

    const openEditModal = (team) => {
        // Check if manager can edit this team (only if they are the leader)
        if (user?.role === 'manager' && team.leader?._id !== user._id) {
            toast.error('You can only edit teams where you are the leader');
            return;
        }
        setEditingTeam(team);
        setIsModalOpen(true);
    };

    // For manager, we need to extract users from their teams for the form
    const getUsersForForm = () => {
        if (user?.role === 'admin' || user?.role === 'owner') {
            // For admin/owner, we would need to fetch users, but since we removed that due to 403,
            // we'll return an empty array for now, or you might want to implement a different approach
            return [];
        } else if (user?.role === 'manager') {
            // For manager, extract users from their teams
            const allUsers = new Map();
            filteredTeams.forEach(team => {
                // Add team leader
                if (team.leader) {
                    allUsers.set(team.leader._id, team.leader);
                }
                // Add team members
                team.members.forEach(member => {
                    allUsers.set(member._id, member);
                });
            });
            return Array.from(allUsers.values());
        }
        return [];
    };

    const usersForForm = getUsersForForm();

    // Check if user can delete a specific team
    const canDeleteTeam = (team) => {
        if (user?.role === 'admin' || user?.role === 'owner') return true;
        if (user?.role === 'manager') {
            return team.leader?._id === user._id; // Only team leaders can delete
        }
        return false;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">
                    {user?.role === 'manager' ? 'My Teams' : 'Manage Teams'}
                </h1>
                {canManage && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        <FaPlus /> New Team
                    </button>
                )}
            </div>

            {isLoading ? (
                <p className="dark:text-gray-300">Loading teams...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.length > 0 ? (
                        filteredTeams.map((team) => (
                            <div key={team._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold mb-2 dark:text-white">{team.name}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        Leader: <span className="font-semibold dark:text-white">{team.leader?.name || 'N/A'}</span>
                                    </p>
                                    <div className="mb-2">
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                            team.leader?._id === user._id
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {team.leader?._id === user._id ? 'Team Leader' : 'Team Member'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 dark:text-white">Members:</h3>
                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                                            {team.members?.map((member) => (
                                                <li key={member._id} className={`${member._id === user._id ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'dark:text-gray-300'}`}>
                                                    {member.name} {member._id === user._id && '(You)'}
                                                </li>
                                            )).slice(0, 3)}
                                            {team.members?.length > 3 && (
                                                <li className="text-gray-500 dark:text-gray-400">
                                                    ...and {team.members.length - 3} more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                {canManage && (
                                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                                        <button
                                            onClick={() => openEditModal(team)}
                                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            disabled={user?.role === 'manager' && team.leader?._id !== user._id}
                                            title={user?.role === 'manager' && team.leader?._id !== user._id ? "Only team leader can edit" : "Edit team"}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!canDeleteTeam(team)) {
                                                    toast.error('You can only delete teams where you are the leader');
                                                    return;
                                                }
                                                if (window.confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
                                                    deleteMutation.mutate(team._id);
                                                }
                                            }}
                                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                            disabled={!canDeleteTeam(team)}
                                            title={!canDeleteTeam(team) ? "Only team leader can delete" : "Delete team"}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="dark:text-gray-300">
                                {user?.role === 'manager'
                                    ? "You are not a member of any teams yet."
                                    : "No teams found."
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeam ? 'Edit Team' : 'Create New Team'}>
                <TeamForm
                    onSubmit={handleFormSubmit}
                    initialData={editingTeam}
                    users={usersForForm}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    currentUserRole={user?.role}
                />
            </Modal>
        </div>
    );
};

export default ManageTeams;