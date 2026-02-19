import './auth.css';
import React, { useState } from 'react';
import api from '../config/api.js';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  // Common pattern for handling forms in react: don't create separate pieces of state for each field. Use one piece of state called formData (or something like that)
  // as an object with each property being a field in the form.
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await api.post('/auth/register', formData);
      showSuccess('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      showError('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="mt-12 mx-auto px-8 flex justify-between items-center gap-36 max-w-6xl">
      <div>
        <img src="/undraw_working-out_6ksl.svg" alt="" />
      </div>

      <div className="w-1/2 mx-auto">
        <form onSubmit={handleSubmit} className="login-forms flex-1 space-y-4">
          <h1 className="text-6xl font-extrabold mb-10 text-center">
            Sign Up!
          </h1>

          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="registerEmail"
            placeholder="Email"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="firstName"
            placeholder="First Name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            id="lastName"
            placeholder="Last Name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="registerPassword"
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50"
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
