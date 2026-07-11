import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../config/api.ts';

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    // password: '',
  });

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      console.log(formData);
      const token = localStorage.getItem('token');

      const payload = {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        // password: e.target.password.value,
        // confirmPassword: e.target.confirmPassword.value,
      };

      console.log(`Payload: ${JSON.stringify(payload)}`);

      await api.patch('users/me/update', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = 'Profile - Workout Mood Tracker';
  });

  return (
    <>
      <div className="w-full mx-auto md:w-10/12 md:m-auto grow">
        <h1 className="text-2xl font-bold md:text-5xl">Profile</h1>

        {user?.first_name}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <label htmlFor="first_name" className="text-lg font-semibold">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              defaultValue={user?.first_name}
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
            />

            <label htmlFor="password" className="text-lg font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Leave blank to keep current password"
              id="confirmPassword"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50">
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};
export default Profile;
