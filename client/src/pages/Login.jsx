import React, { useState } from 'react';
import api from '../config/api.js';
import { useNavigate } from 'react-router-dom'; // Add this
import { useAuth } from '../context/AuthContext.jsx'; // Add this
import { useNotification } from '../context/NotificationContext.jsx';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { showError, showSuccess } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, password);
      console.log('Login worked!');
      showSuccess('Welcome back!');
      navigate('/');
    } catch (err) {
      showError('Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div className="mt-12 mx-auto px-8 flex items-center gap-16 max-w-6xl">
        <div className="">
          <img src="/undraw_fitness-stats_bd09.svg" alt="" />
        </div>

        <form
          onSubmit={handleSubmit}
          action=""
          className="login-forms flex-1 space-y-4"
        >
          <h1 className="text-6xl font-extrabold mb-10 text-center">
            Welcome Back!
          </h1>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="login-email"
            placeholder="Email"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="login-password"
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
