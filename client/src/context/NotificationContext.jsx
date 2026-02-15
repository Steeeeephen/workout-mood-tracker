import {createContext, useContext, useState} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000)
    }

    const showSuccess = (message) => {
        setSuccess(message);
        setTimeout(()=> setSuccess(null), 3000);
    }

    const clearError = () => setError(null);
    const clearSuccess = () => setSuccess(null);

    return (
        <NotificationContext.Provider value={{
            error,
            success,
            showError,
            showSuccess,
            clearError,
            clearSuccess
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification  = () => useContext(NotificationContext);