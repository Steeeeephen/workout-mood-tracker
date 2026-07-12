import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../config/api.ts';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      setIsUpdating(true);

      e.preventDefault();

      const token = localStorage.getItem('token');

      if (formData.password !== formData.confirmPassword) {
        showError("Passwords don't match. Please try again.");
        return;
      }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {}),
      };

      const response = await api.patch('users/me/update', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    document.title = 'Profile - Workout Mood Tracker';
  }, []);

  return (
    <>
      <div className="w-full mx-auto md:w-10/12 md:m-auto grow">
        <h1 className="text-2xl font-bold md:text-5xl">Profile</h1>
        {user?.first_name} {user?.last_name}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <label htmlFor="first_name" className="text-lg font-semibold">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name ?? ''}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />

            <label htmlFor="last_name" className="text-lg font-semibold">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              defaultValue={user?.last_name}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />

            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user?.email}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <label htmlFor="password" className="text-lg font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <label htmlFor="confirmPassword" className="text-lg font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Leave blank to keep current password"
              id="confirmPassword"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
              }}
            />
          </div>
          <button
            className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50"
            type="submit"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </>
  );
};
export default Profile;
