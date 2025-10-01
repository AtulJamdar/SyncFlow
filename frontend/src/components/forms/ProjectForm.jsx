import React, { useState } from 'react';

const ProjectForm = ({ onSubmit, initialData = {}, clients = [], teams = [], isSubmitting }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [deadline, setDeadline] = useState(initialData?.deadline?.split('T')[0] || '');
    const [status, setStatus] = useState(initialData?.status || 'not-started');
    const [selectedClient, setSelectedClient] = useState(initialData?.client?._id || '');
    const [assignedTeams, setAssignedTeams] = useState(initialData?.assignedTeams?.map(t => t._id) || []);


    const handleTeamSelection = (e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setAssignedTeams(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, deadline, status, client: selectedClient, assignedTeams });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Client</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
                    <option value="" disabled>Select a client</option>
                    {clients.map(client => <option key={client._id} value={client._id}>{client.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Teams (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple value={assignedTeams} onChange={handleTeamSelection} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    {teams.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
        </form>
    );
};
// Add a shared CSS class in index.css: .input-style { @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500; }
export default ProjectForm;