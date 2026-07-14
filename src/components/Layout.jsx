import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ 
                marginLeft: "250px",
                padding: "30px",
                width: "calc(100% - 250px)",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box"
            }}>
                {children}
            </div>
        </div>
    );
}

export default Layout;