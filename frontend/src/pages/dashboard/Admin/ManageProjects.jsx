import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api';
import Modal from '../../../components/common/Modal';
import ProjectForm from '../../../components/forms/ProjectForm';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Fetch all projects, clients, and teams
const fetchProjectsData = async () => {
    const [projects, clients, teams] = await Promise.all([
        apiClient.get('/projects').then(res => res.data.data),
        apiClient.get('/clients').then(res => res.data.data),
        apiClient.get('/teams').then(res => res.data.data),
    ]);
    return { projects, clients, teams };
};

// API mutations
const createProject = async (newProject) =>
    (await apiClient.post('/projects', newProject)).data.data;

const updateProject = async ({ id, updates }) =>
    (await apiClient.put(`/projects/${id}`, updates)).data.data;

const deleteProject = async (id) =>
    await apiClient.delete(`/projects/${id}`);

const ManageProjects = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    // Queries
    const { data, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjectsData,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsModalOpen(false);
            toast.success("Project created successfully!");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Error creating project"),
    });

    const updateMutation = useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsModalOpen(false);
            setEditingProject(null);
            toast.success("Project updated successfully!");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Error updating project"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Project deleted successfully!");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Error deleting project"),
    });

    // Handle Form Submit (create or update)
    const handleFormSubmit = (formData) => {
        if (editingProject) {
            updateMutation.mutate({ id: editingProject._id, updates: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    // Open modal for creating
    const openCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    // Open modal for editing
    const openEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const thClass = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';
    const tdClass = 'px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">Projects</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    <FaPlus /> New Project
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className={thClass}>Title</th>
                            <th className={thClass}>Client</th>
                            <th className={thClass}>Assigned Teams</th>
                            <th className={thClass}>Status</th>
                            <th className={thClass}>Deadline</th>
                            <th className={thClass}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 dark:text-gray-300">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            data?.projects.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className={tdClass}>
                                        <p className="font-semibold dark:text-white">{project.title}</p>
                                    </td>
                                    <td className={tdClass}>{project.client?.name}</td>
                                    <td className={tdClass}>{project.assignedTeams.map(t => t.name).join(', ') || 'N/A'}</td>
                                    <td className={tdClass}>
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full capitalize ${
                                            project.status === 'completed'
                                                ? 'bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-300'
                                                : project.status === 'in-progress'
                                                    ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100'
                                        }`}>
                                            {project.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className={tdClass}>{new Date(project.deadline).toLocaleDateString()}</td>
                                    <td className={`${tdClass} flex gap-2`}>
                                        <button
                                            onClick={() => openEditModal(project)}
                                            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(project._id)}
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                }}
                title={editingProject ? "Edit Project" : "Create New Project"}
            >
                <ProjectForm
                    onSubmit={handleFormSubmit}
                    clients={data?.clients || []}
                    teams={data?.teams || []}
                    initialData={editingProject}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
};

export default ManageProjects;