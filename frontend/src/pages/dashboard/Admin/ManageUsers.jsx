import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api';
import Modal from '../../../components/common/Modal';
import UserForm from '../../../components/forms/UserForm';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

// API Functions
const fetchUsers = async () => (await apiClient.get('/users')).data.data;
const updateUser = async ({ id, ...data }) => (await apiClient.put(`/users/${id}`, data)).data.data;
const deleteUser = async (id) => await apiClient.delete(`/users/${id}`);

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            setEditingUser(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "An error occurred"),
    };

    const updateMutation = useMutation({ mutationFn: updateUser, ...mutationOptions, onSuccess: () => { toast.success('User updated!'); mutationOptions.onSuccess(); } });
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success('User deleted!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: mutationOptions.onError,
    });

    const handleFormSubmit = (formData) => {
        if (!editingUser) return;
        updateMutation.mutate({ id: editingUser._id, ...formData });
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            deleteMutation.mutate(userId);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const thClass = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';
    const tdClass = 'px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Manage Users</h1>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className={thClass}>Name</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>Role</th>
                            <th className={thClass}>Specialization</th>
                            <th className={thClass}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 dark:text-gray-300">
                                    Loading users...
                                </td>
                            </tr>
                        ) : (
                            users?.map(user => (
                                <tr key={user._id}>
                                    <td className={tdClass}>{user.name}</td>
                                    <td className={tdClass}>{user.email}</td>
                                    <td className={tdClass + ' capitalize'}>{user.role}</td>
                                    <td className={tdClass}>{user.specialization || 'N/A'}</td>
                                    <td className={tdClass}>
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit User: ${editingUser.name}`}>
                    <UserForm
                        onSubmit={handleFormSubmit}
                        initialData={editingUser}
                        isSubmitting={updateMutation.isPending}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManageUsers;