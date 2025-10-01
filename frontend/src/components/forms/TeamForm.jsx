import React, { useState } from 'react';

const TeamForm = ({ onSubmit, initialData = {}, users = [], isSubmitting }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [leader, setLeader] = useState(initialData?.leader?._id || '');
    const [members, setMembers] = useState(initialData?.members?.map(m => m._id) || []);

    // Filter potential leaders (e.g., only managers or admins can be leaders)
    const potentialLeaders = users.filter(u => ['admin', 'owner', 'manager'].includes(u.role));

    const handleMemberSelection = (e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setMembers(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, leader, members });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Leader</label>
                <select value={leader} onChange={(e) => setLeader(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
                    <option value="" disabled>Select a leader</option>
                    {potentialLeaders.map(user => (
                        <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" >Team Members (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple value={members} onChange={handleMemberSelection} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name} ({user.specialization || 'N/A'})</option>
                    ))}
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isSubmitting ? 'Saving Team...' : 'Save Team'}
            </button>
        </form>
    );
};

export default TeamForm;