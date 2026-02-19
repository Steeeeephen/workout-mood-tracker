import React from 'react';
import { Link } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="mt-24 mx-auto px-8 flex items-center gap-16 max-w-6xl">
      <div className="flex flex-col gap-5 flex-1">
        <h1 className="text-8xl font-extrabold leading-tight">
          Find what works for you.
        </h1>
        <h2 className="text-5xl font-semibold text-teal-800">
          {' '}
          One workout at a time
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {/*Lorem ipsum dolor sit amet, consectetur adipisicing elit...*/}
        </p>

        <div className="flex gap-8 mt-8 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-teal-600 text-2xl">✓</span>
            <span>Track workouts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-600 text-2xl">✓</span>
            <span>Log your progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-600 text-2xl">✓</span>
            <span>Stay motivated</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md min-w-[140px] text-center"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors min-w-[140px] text-center"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="flex-1">
        <img
          src="/undraw_fitness-influencer-avatar_04j0.svg"
          alt="Fitness tracking dashboard"
          // className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Auth;
