import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h1>
        <p className="text-gray-500 mb-6">Access your dashboard</p>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {/* <div className="text-xs text-gray-500 mt-2">
            Demo: owner@factory.com / Owner@123  customer1@company.com / Customer@123
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;

