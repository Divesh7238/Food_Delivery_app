import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://bhukkadmebackend.onrender.com/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a120b] p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#2D1D8E] to-[#4a372a] p-8 rounded-xl shadow-lg border-4 border-amber-700/30 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform">
          Login to Bhukkad Bites
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#2D1D8E] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-600 transition-all duration-200 hover:scale-[1.02]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#2D1D8E] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-600 transition-all duration-200 hover:scale-[1.02]"
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center text-amber-200 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="mr-2 accent-amber-500"
              />
              Remember me
            </label>
            <Link to="/signup" className="text-amber-400 hover:text-amber-600 text-sm transition-all duration-300">
              Create Account
            </Link>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
