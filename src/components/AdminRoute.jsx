import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    return user && (user.isAdmin || user.isFarmer) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
