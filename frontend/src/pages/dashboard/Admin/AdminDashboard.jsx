import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import { FaUsers, FaBriefcase, FaFileInvoiceDollar } from 'react-icons/fa';

// In a real app, you would create a dedicated /api/analytics/summary endpoint
// For now, we fetch everything and get the counts on the client-side
const fetchDashboardData = async () => {
    const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
        apiClient.get('/clients'),
        apiClient.get('/projects'),
        apiClient.get('/invoices')
    ]);
    return {
        clients: clientsRes.data.data,
        projects: projectsRes.data.data,
        invoices: invoicesRes.data.data,
    };
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`mr-4 p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { data, isLoading } = useQuery({ queryKey: ['adminDashboard'], queryFn: fetchDashboardData });

    const totalRevenue = data?.invoices
        .filter(inv => inv.status === 'paid')
        .reduce((acc, inv) => acc + inv.amount, 0) || 0;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>
            {isLoading ? (
                <div className="dark:text-gray-300">Loading stats...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        icon={<FaUsers size={24} className="text-white" />}
                        title="Total Clients"
                        value={data?.clients.length}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={<FaBriefcase size={24} className="text-white" />}
                        title="Active Projects"
                        value={data?.projects.filter(p => p.status === 'in-progress').length}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        icon={<FaFileInvoiceDollar size={24} className="text-white" />}
                        title="Total Revenue"
                        value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue)}
                        color="bg-green-500"
                    />
                </div>
            )}
            {/* You would add Recharts components here */}
        </div>
    );
};

export default AdminDashboard;