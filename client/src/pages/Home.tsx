import React from 'react';
import Auth from './Auth.js';
import { useAuth } from '../context/AuthContext.js';
import Dashboard from './Dashboard.js';

const Home = () => {
  const { user } = useAuth();

  return <>{user ? <Dashboard /> : <Auth />}</>;
};
export default Home;
