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
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      <div className="mt-24 mx-auto px-8 flex items-center gap-16 max-w-6xl">
        <div className="">
          <img src="/undraw_fitness-stats_bd09.svg" alt="" />
        </div>

        <form onSubmit={handleSubmit} action="" className="login-forms flex-1">
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
            className="text-input border-b-2  p-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="login-password"
            placeholder="Password"
            className="text-input mb-10 border-b-2  p-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            className="btn-submit bg-green-400 rounded p-1"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </button>
          <span className="m-auto pt-10">
            Forgot password? Click{' '}
            <a className="text-blue-600" href="#">
              here
            </a>
            .
          </span>
        </form>
      </div>
    </>
  );
};
export default Login;
