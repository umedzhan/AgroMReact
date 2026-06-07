import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for logged in user on mount and validate session
    useEffect(() => {
        const checkUserSession = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.token) {
                // Keep local mock account authenticated for local frontend testing
                if (userInfo.email === 'test@gmail.com') {
                    setUser(userInfo);
                    setLoading(false);
                    return;
                }

                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/auth/profile', config);
                    // Sync backend state with auth context
                    setUser({ ...userInfo, ...data });
                } catch (error) {
                    console.error("Token verification failed, clearing session:", error);
                    localStorage.removeItem('userInfo');
                    setUser(null);
                    toast.error('Sessiya muddati tugagan. Iltimos qayta tizimga kiring.');
                }
            }
            setLoading(false);
        };
        checkUserSession();
    }, []);

    // Login function
    const login = async (email, password) => {
        if (email === 'test@gmail.com' && (password === 'test' || password === 'test123456')) {
            const mockData = {
                _id: 'mock-test-id',
                name: 'Test User',
                email: 'test@gmail.com',
                isAdmin: true,
                token: 'mock-jwt-token'
            };
            setUser(mockData);
            localStorage.setItem('userInfo', JSON.stringify(mockData));
            toast.success('Login successful!');
            return true;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('/api/auth/login', { email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful!');
            return true;
        } catch (error) {
            const message = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            toast.error(message);
            return false;
        }
    };

    // Register function
    const register = async (name, email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('/api/auth', { name, email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            const message = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            toast.error(message);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
