import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import { useAuth } from '../context/AuthContext.js'; // Add this
import { useNotification } from '../context/NotificationContext.js';
import axios from 'axios';

const Login = () => {
  useEffect(() => {
    document.title = 'Login - Workout Mood Tracker';
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { showError, showSuccess } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, password);
      showSuccess('Welcome back!');
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 401) {
          showError('Invalid email or password');
        } else if (err.response && err.response.status === 500) {
          showError('An error occurred. Please try again.');
        } else {
          showError('Unable to connect to server');
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div className="mx-auto px-8 flex items-center max-w-6xl grow w-full">
        <div className="hidden md:block">
          <img src="/undraw_fitness-stats_bd09.svg" alt="" />
        </div>

        <form onSubmit={handleSubmit} action="" className="login-forms">
          <h1 className="text-3xl font-extrabold mb-10 text-center md:text-6xl ">
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
