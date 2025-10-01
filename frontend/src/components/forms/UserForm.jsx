import React, { useState } from 'react';

const ROLES = ['admin', 'manager', 'accountant', 'user'];

const UserForm = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [role, setRole] = useState(initialData?.role || 'user');
    const [specialization, setSpecialization] = useState(initialData?.specialization || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ role, specialization });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" value={initialData.name || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" disabled />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" value={initialData.email || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" disabled />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign New Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    {ROLES.map(r => (
                        <option key={r} value={r} className="capitalize">{r}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Specialization</label>
                <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Frontend Developer" className="mt-1 block w-full input-style" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
        </form>
    );
};

export default UserForm;