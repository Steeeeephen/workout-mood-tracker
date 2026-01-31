import {createContext, useContext, useEffect, useState} from "react";
import api from '../config/api.js';


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if(!token){
                setLoading(false)
                return;
            }

            try {
                const response = await api.get('/users/me');
                setUser(response.data);
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        setIsAuthenticated(true);
        return response.data;
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )

};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};