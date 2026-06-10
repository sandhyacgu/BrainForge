import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = authService.getUser();
        return (savedUser && authService.isLoggedIn()) ? savedUser : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const register = async (username, email, password) => {
        const data = await authService.register(username, email, password);
        authService.saveAuth(data);
        setUser({ username: data.username, email: data.email, role: data.role });
        return data;
    };

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        authService.saveAuth(data);
        setUser({ username: data.username, email: data.email, role: data.role });
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

export default AuthContext;