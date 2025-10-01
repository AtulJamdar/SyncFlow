import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mutation = useMutation({
        mutationFn: (newPassword) => apiClient.patch(`/auth/reset-password/${token}`, { password: newPassword }),
        onSuccess: () => {
            toast.success("Password reset successfully! Please log in.");
            navigate('/login');
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to reset password'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        mutation.mutate(password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Reset Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full input-style mb-4" required />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full input-style mb-4" required />
                    <button type="submit" disabled={mutation.isPending} className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        {mutation.isPending ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ResetPasswordPage;