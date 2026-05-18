import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Auth = () => {
  useEffect(() => {
    document.title = 'Workout Mood Tracker';
  }, []);

  return (
    <>
      <div className="grow mx-auto px-8 flex flex-col-reverse items-center max-w-6xl w-full md:flex-row md:gap">
        <div className="flex flex-col text-center gap-6 flex-1 md:text-start">
          <h1 className="text-4xl font-extrabold leading-tight md:text-8xl">
            Find what works for you.
          </h1>
          <h2 className="text-3xl text-teal-800 md:font-semibold">
            {' '}
            One workout at a time
          </h2>
          <div className="flex text-start text-gray-600 md:gap-8 md:mt-8">
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

          <div className="flex justify-center gap-4 md:justify-start">
            <Link
              to="/login"
              className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md min-w-35 text-center"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors min-w-35 text-center"
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
    </>
  );
};

export default Auth;
