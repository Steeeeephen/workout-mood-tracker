import {createContext, useContext, useState} from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null)

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000)
    }

    const clearError = () => setError(null);

    return (
        <ErrorContext.Provider value={{ children, error, showError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);