import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../config/api.js';
import { User } from '../types/types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  // setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  // setLoading: Dispatch<SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Retrieve the token from users localStorage.
      const token = localStorage.getItem('token');

      // If the token does not exist set loading state to false and return function.
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // if the token exists...
        const response = await api.get('/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Remove token on auth failure (user deleted, token expired, network error, etc.)
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    const userResponse = await api.get('/users/me');
    setUser(userResponse.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
