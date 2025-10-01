import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const mutation = useMutation({
        mutationFn: (email) => apiClient.post('/auth/forgot-password', { email }),
        onSuccess: () => {
            toast.success("Reset link sent!");
            setMessage("If an account with that email exists, a password reset link has been sent. Please check your inbox.");
        },
        onError: (error) => toast.error(error.response?.data?.message || 'An error occurred'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        mutation.mutate(email);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Forgot Your Password?</h2>
                <p className="mb-4 text-sm text-center text-gray-600 dark:text-gray-400">Enter your email and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your-email@example.com" className="w-full input-style mb-4" required />
                    <button type="submit" disabled={mutation.isPending} className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
            </div>
        </div>
    );
};
export default ForgotPasswordPage;