import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext.jsx';

const UserNav = () => {
  const { user, setUser, logout } = useAuth(); // Need setUser for logout
  const userName = user.first_name + ' ' + user.last_name;
  const { showSuccess } = useNotification();

  const navigate = useNavigate();

  const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=0d9488&color=fff&size=50`;

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <>
      <Link to="/calendar">Calendar</Link>
      <Link className="flex items-center" to="#">
        <img className="rounded-full" src={avatarUrl} alt="" />
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium cursor-pointer"
      >
        Logout
      </button>
    </>
  );
};

export default UserNav;
