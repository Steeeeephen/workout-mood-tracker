import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import UserNav from './UserNav.js';
import React from 'react';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <div className="text-center md:text-lg bg-amber-200 py-1">
        Please note! This site is for demo purposes only and it's advised you do
        not enter any sensitive information.
      </div>
      <nav className="flex relative justify-between w-11/12 mx-auto items-center py-6 md:w-3/4">
        <Link to="/">
          <h1 className="text-2xl md:text-5xl">
            <span className="font-extrabold">Workout</span> Mood Tracker
          </h1>
        </Link>

        <div>{isAuthenticated ? <UserNav /> : ''}</div>
      </nav>
    </>
  );
};

export default Navbar;
