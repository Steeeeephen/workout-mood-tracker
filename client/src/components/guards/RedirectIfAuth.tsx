import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Navigate } from 'react-router-dom';

const RedirectIfAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.id) return <Navigate to="/" replace />;

  return children;
};
export default RedirectIfAuth;
