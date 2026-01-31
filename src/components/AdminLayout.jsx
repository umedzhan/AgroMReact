import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <AdminSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
