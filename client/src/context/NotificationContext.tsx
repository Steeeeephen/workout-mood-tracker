import { createContext, ReactNode, useContext, useState } from 'react';

interface NotificationContextType {
  error: string | null;
  success: string | null;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return (
    <NotificationContext.Provider
      value={{
        error,
        success,
        showError,
        showSuccess,
        clearError,
        clearSuccess,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
