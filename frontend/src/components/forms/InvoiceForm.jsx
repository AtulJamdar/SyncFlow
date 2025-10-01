import React, { useState, useEffect } from 'react';

const InvoiceForm = ({ onSubmit, initialData = {}, projects = [], isSubmitting }) => {
    const [selectedProject, setSelectedProject] = useState(initialData?.project?._id || '');
    const [client, setClient] = useState(initialData?.client || null);
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [status, setStatus] = useState(initialData?.status || 'unpaid');
    const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.split('T')[0] : '');

    // Effect to auto-populate the client when a project is selected
    useEffect(() => {
        if (selectedProject) {
            const project = projects.find(p => p._id === selectedProject);
            if (project) {
                setClient(project.client);
            }
        } else {
            setClient(null);
        }
    }, [selectedProject, projects]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!client) {
            alert("Please select a valid project.");
            return;
        }
        onSubmit({
            project: selectedProject,
            client: client._id,
            amount,
            status,
            dueDate
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Project</label>
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                >
                    <option value="" disabled>-- Choose a project --</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>{project.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                <input
                    type="text"
                    value={client ? client.name : 'Select a project to see the client'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    disabled
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (INR)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isSubmitting ? 'Saving Invoice...' : 'Save Invoice'}
            </button>
        </form>
    );
};

export default InvoiceForm;
