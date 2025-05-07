import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/admin.js';
import { toast } from 'react-hot-toast';

export function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            const response = await resetPassword({ email, token, password, confirmPassword });
            if (response.status) {
                toast.success('Password reset successfully!');
                navigate('/login');
            } else {
                toast.error(response.message || 'Failed to reset password');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
                Reset Your Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" value={email} readOnly />
                <input type="hidden" value={token} readOnly />

                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
