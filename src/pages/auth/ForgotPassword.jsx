import React, { useState } from 'react';
import { Await, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/admin.js';
import { toast } from 'react-hot-toast';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await forgotPassword({ email });
      if (response.status) {
        setSubmitted(true);  // Show confirmation message
      } else {
        setError(response.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Check your email
            </h3>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              If an account exists for {email}, you will receive a password reset link.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 dark:text-green-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send reset link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}