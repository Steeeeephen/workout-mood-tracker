import './auth.css';
import { useState } from 'react';
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
    <div className="w-1/2 mx-auto">
      <form action="" className="login-forms w-1/2 mt-24">
        <h3 className="text-2xl mb-10 text-center">Register </h3>

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="registerEmail"
          placeholder="Email"
          className="text-input"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="firstName" className="sr-only">
          First Name
        </label>
        <input
          type="text"
          name="first_name"
          id="firstName"
          placeholder="First Name"
          className="text-input"
          value={formData.first_name}
          onChange={handleChange}
        />

        <label htmlFor="lastName" className="sr-only">
          Last Name
        </label>
        <input
          type="text"
          name="last_name"
          id="lastName"
          placeholder="Last Name"
          className="text-input"
          value={formData.last_name}
          onChange={handleChange}
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="registerPassword"
          placeholder="Password"
          className="text-input"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword" className="sr-only">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          className="text-input"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          type="submit"
          className="btn-submit bg-green-400 rounded p-1"
          disabled={isRegistering}
        >
          {isRegistering ? 'Loading' : 'Register'}
        </button>

        <p className="text-center">Already have an account? Login here.</p>
      </form>
    </div>
  );
};
export default Register;
