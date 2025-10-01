import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import { FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const fetchInvoices = async () => {
    const { data } = await apiClient.get('/invoices');
    return data.data;
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`mr-4 p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AccountantDashboard = () => {
    const { user } = useAuthStore();
    const { data, isLoading } = useQuery({ queryKey: ['invoices'], queryFn: fetchInvoices });

    const thClass = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';
    const tdClass = 'px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

    if (isLoading) return <div className="dark:text-gray-300">Loading financial data...</div>;

    const invoices = Array.isArray(data) ? data : data?.invoices || [];

    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid');
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.amount, 0);
    const outstandingAmount = unpaidInvoices.reduce((acc, inv) => acc + inv.amount, 0);
    const recentInvoices = invoices.slice(-5).reverse();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">Accountant Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Welcome, {user.name}. Here is the current financial summary.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={<FaFileInvoiceDollar size={24} className="text-white" />}
                    title="Total Revenue (Paid)"
                    value={formatCurrency(totalRevenue)}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<FaExclamationCircle size={24} className="text-white" />}
                    title="Outstanding Amount"
                    value={formatCurrency(outstandingAmount)}
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={<FaCheckCircle size={24} className="text-white" />}
                    title="Paid Invoices"
                    value={paidInvoices.length}
                    color="bg-blue-500"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Invoices</h2>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className={thClass}>Invoice #</th>
                            <th className={thClass}>Client</th>
                            <th className={thClass}>Amount</th>
                            <th className={thClass}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentInvoices.map(invoice => (
                            <tr key={invoice._id}>
                                <td className={tdClass}>{invoice.invoiceNumber}</td>
                                <td className={tdClass}>{invoice.client?.name}</td>
                                <td className={tdClass}>{formatCurrency(invoice.amount)}</td>
                                <td className={tdClass}>
                                    <span className={`font-semibold capitalize ${
                                        invoice.status === 'paid'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountantDashboard;