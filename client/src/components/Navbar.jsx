import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import UserNav from './UserNav.jsx';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="flex justify-between w-3/4 mx-auto items-center py-6">
      <Link to="/">
        <h1 className="text-4xl">
          <span className="font-extrabold">Workout</span> Mood Tracker
        </h1>
      </Link>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? <UserNav /> : ''}
      </div>
    </nav>
  );
};

export default Navbar;
