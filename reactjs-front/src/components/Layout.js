import React from 'react';

const Layout = ({ children }) => {
    return (
        <>
            <div className="fixed_layout"></div>
            <div className="layout">
                {children}
            </div>
        </>
    );
};

export default Layout;