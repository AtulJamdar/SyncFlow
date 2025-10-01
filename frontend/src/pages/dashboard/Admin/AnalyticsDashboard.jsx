import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// This component provides the Daily, Monthly, Yearly buttons
const TimePeriodSelector = ({ period, setPeriod }) => {
    const options = ['daily', 'monthly', 'yearly'];
    return (
        <div className="flex space-x-2 rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => setPeriod(option)}
                    className={`w-full rounded-md py-1.5 text-sm font-medium transition-colors
                        ${period === option
                            ? 'bg-white shadow text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                            : 'text-gray-600 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600'
                        }
                    `}
                >
                    <span className="capitalize">{option}</span>
                </button>
            ))}
        </div>
    );
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// This helper function formats the chart labels correctly for each period
const formatRevenueData = (data, period) => {
    if (!data) return [];
    return data.map(item => {
        let name;
        switch (period) {
            case 'daily':
                name = `${MONTH_NAMES[item._id.month - 1]} ${item._id.day}`;
                break;
            case 'yearly':
                name = `${item._id.year}`;
                break;
            case 'monthly':
            default:
                name = `${MONTH_NAMES[item._id.month - 1]} ${String(item._id.year).slice(-2)}`;
                break;
        }
        return { name, Revenue: item.total };
    });
};

const AnalyticsDashboard = () => {
    // 1. State to hold the current time period
    const [timePeriod, setTimePeriod] = useState('monthly');

    // 2. The function to fetch data is now dynamic
    const fetchAnalytics = async (period) => {
        const { data } = await apiClient.get(`/analytics?period=${period}`);
        return data.data;
    };

    // 3. The useQuery hook depends on `timePeriod`. When it changes, data is refetched.
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', timePeriod],
        queryFn: () => fetchAnalytics(timePeriod)
    });

    // The data is now correctly processed using the helper function
    const projectStatusData = data?.projectStatus.map(item => ({ name: item._id.replace('-', ' ').toUpperCase(), value: item.count })) || [];
    const revenueData = formatRevenueData(data?.revenue, timePeriod); // Uses data.revenue
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Business Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-white">Revenue Overview</h2>
                            {/* The interactive buttons are rendered here */}
                            <TimePeriodSelector period={timePeriod} setPeriod={setTimePeriod} />
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full dark:text-gray-300">
                                    Loading chart...
                                </div>
                            ) : (
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280' }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => new Intl.NumberFormat('en-IN').format(value)}
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280' }}
                                    />
                                    <Tooltip
                                        formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            borderColor: '#374151',
                                            color: '#f9fafb'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Revenue" fill="#8884d8" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Project Status</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full dark:text-gray-300">
                                    Loading chart...
                                </div>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={projectStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {projectStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            borderColor: '#374151',
                                            color: '#f9fafb'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;