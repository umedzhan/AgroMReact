import React, { useContext } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TopBar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-green-600 text-white text-sm hidden md:block">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center hover:text-green-100 cursor-pointer transition-colors">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>Store Location: Termez, Surkhandarya, Uzbekistan</span>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <span className="text-white mr-2">Eng</span>
                        <span className="text-white mr-2">|</span>
                        <span className="text-white">USD</span>
                    </div>
                    <div className="border-l border-green-400 h-4 mx-2"></div>
                    {!user ? (
                        <div className="flex space-x-4">
                            <Link to="/login" className="hover:text-green-100">Sign In</Link>
                            <span>/</span>
                            <Link to="/register" className="hover:text-green-100">Sign Up</Link>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <span>Hi, {user.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
