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

    const getErrorMessage = (error) =>
        error.response?.data?.message || error.message;

    // Returns { requiresVerification, email } when the account still needs email verification.
    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful!');
            return null;
        } catch (error) {
            toast.error(getErrorMessage(error));
            if (error.response?.data?.requiresVerification) {
                return { requiresVerification: true, email: error.response.data.email };
            }
            return null;
        }
    };

    // Returns the pending verification email on success; the user is logged in only after verifyEmail.
    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('/api/auth', { name, email, password }, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast.success('Tasdiqlash kodi emailingizga yuborildi');
            return data.email;
        } catch (error) {
            toast.error(getErrorMessage(error));
            return null;
        }
    };

    const verifyEmail = async (email, code) => {
        try {
            const { data } = await axios.post('/api/auth/verify-email', { email, code }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Email tasdiqlandi!');
            return true;
        } catch (error) {
            toast.error(getErrorMessage(error));
            return false;
        }
    };

    const resendVerification = async (email) => {
        try {
            const { data } = await axios.post('/api/auth/resend-verification', { email }, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success(data.message);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, resendVerification, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
