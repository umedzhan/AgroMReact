import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
    useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const { login, user, loading } = useContext(AuthContext);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{tUZ("Tizimga kirish")}</h1>

                {loading && <div className="mb-4 text-center"><Loader /></div>}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            {tUZ("Elektron pochta manzili")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder={tUZ("Elektron pochtani kiriting")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {tUZ("Parol")}
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder={tUZ("Parolni kiriting")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
                    >
                        {tUZ("Tizimga kirish")}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        {tUZ("Yangi mijozmisiz?")}{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-green-600 hover:text-green-800 font-semibold">
                            {tUZ("Ro'yxatdan o'tish")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
