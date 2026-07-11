import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext.js';

const UserNav = () => {
  const { user, setUser, logout } = useAuth(); // Need setUser for logout
  const userName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=0d9488&color=fff&size=50`;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <>
      <div className="hidden gap-4 items-center md:flex">
        <Link to="/calendar">Calendar</Link>
        <Link className="flex items-center" to="/me">
          <img className="rounded-full" src={avatarUrl} alt="" />
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <img
          className="w-8 h-8"
          src="/burger-menu-svg.svg"
          alt="mobile menu open"
        />
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[90%] bg-white shadow-lg rounded-lg z-50 py-4">
            <div className="flex flex-col items-center gap-5">
              <Link
                to="/"
                className="text-2xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-2xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/calendar"
                className="text-2xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserNav;
