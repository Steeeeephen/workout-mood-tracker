// It's to the point where fetching entries is so common, it only makes sense to have a context for it.

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import api from '../config/api.ts';
import { useAuth } from './AuthContext.tsx';
import { useNotification } from './NotificationContext.tsx';
import { Entry } from '../types/types.ts';

interface FetchEntryContextType {
  entries: Entry[];
  isLoading: boolean;
  setEntries: (entries: Entry[]) => void;
  fetchEntries: () => Promise<void>;
}

export const FetchEntriesContext = createContext<FetchEntryContextType | null>(
  null,
);

export const FetchEntriesProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showError } = useNotification();

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/entries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(response.data);
    } catch (err) {
      console.error(err);
      showError('Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  return (
    <FetchEntriesContext.Provider
      value={{ entries, setEntries, isLoading, fetchEntries }}
    >
      {children}
    </FetchEntriesContext.Provider>
  );
};

export const useFetchEntries = () => {
  const context = useContext(FetchEntriesContext);
  if (!context) {
    throw new Error('useFetchEntries must be used within FetchEntryProvider');
  }
  return context;
};
