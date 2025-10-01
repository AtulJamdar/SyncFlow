import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import ClientForm from '../../../components/forms/ClientForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// API Functions
const fetchClients = async () => {
    const { data } = await apiClient.get('/clients');
    return data.data;
};

const createClient = async (newClient) => {
    const { data } = await apiClient.post('/clients', newClient);
    return data.data;
};

const updateClient = async ({ id, ...updatedData }) => {
    const { data } = await apiClient.put(`/clients/${id}`, updatedData);
    return data.data;
};

const deleteClient = async (id) => {
    await apiClient.delete(`/clients/${id}`);
};

// React Component
const ManageClients = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    // Queries
    const { data: clients, isLoading, error } = useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            toast.success('Client created successfully!');
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create client");
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateClient,
        onSuccess: () => {
            toast.success('Client updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            setIsModalOpen(false);
            setEditingClient(null);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update client');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            toast.success('Client deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete client');
        }
    });

    // Handlers
    const openCreateModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (data) => {
        if (editingClient) {
            updateMutation.mutate({ id: editingClient._id, ...data });
        } else {
            createMutation.mutate(data);
        }
    };

    const thClass = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';
    const tdClass = 'px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

    if (isLoading) return <div className="dark:text-gray-300">Loading...</div>;
    if (error) return <div className="dark:text-gray-300">An error occurred: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">Manage Clients</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    <FaPlus /> Add New Client
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className={thClass}>Name</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>Company</th>
                            <th className={thClass}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients?.map((client) => (
                            <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className={tdClass}>{client.name}</td>
                                <td className={tdClass}>{client.email}</td>
                                <td className={tdClass}>{client.company}</td>
                                <td className={`${tdClass} flex gap-2`}>
                                    <button
                                        onClick={() => openEditModal(client)}
                                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate(client._id)}
                                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal with ClientForm */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingClient ? 'Edit Client' : 'Add New Client'}
            >
                <ClientForm
                    onSubmit={handleFormSubmit}
                    initialData={editingClient}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
};

export default ManageClients;