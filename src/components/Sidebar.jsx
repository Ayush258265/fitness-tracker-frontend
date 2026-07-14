import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const userId = localStorage.getItem("userId");
    const location = useLocation();
    const isLoggedIn = userId && userId !== "null";

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    return (
        <div
            style={{
                width: "250px",
                height: "100vh",
                background: "#1a1a1a",
                color: "#fff",
                padding: "20px",
                position: "fixed",
                left: 0,
                top: 0,
                overflowY: "auto",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                zIndex: 1000
            }}
        >
            <Link to="/" style={{ textDecoration: "none" }}>
                <h2 style={{ 
                    marginBottom: "30px", 
                    fontSize: "1.5rem",
                    color: "white",
                    cursor: "pointer"
                }}>
                    💪 Fitness App
                </h2>
            </Link>

            <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
                <li style={{ marginBottom: "15px" }}>
                    <Link 
                        to="/dashboard" 
                        style={{
                            ...link,
                            backgroundColor: location.pathname === "/dashboard" ? "#ff6b35" : "transparent",
                            display: "block",
                            padding: "12px",
                            borderRadius: "8px"
                        }}
                    >
                        🏠 Dashboard
                    </Link>
                </li>

                <li style={{ marginBottom: "15px" }}>
                    <Link 
                        to="/userInfo" 
                        style={{
                            ...link,
                            backgroundColor: location.pathname === "/userInfo" ? "#ff6b35" : "transparent",
                            display: "block",
                            padding: "12px",
                            borderRadius: "8px"
                        }}
                    >
                        👤 User Info
                    </Link>
                </li>

                <li style={{ marginBottom: "15px" }}>
                    <Link 
                        to="/users" 
                        style={{
                            ...link,
                            backgroundColor: location.pathname === "/users" ? "#ff6b35" : "transparent",
                            display: "block",
                            padding: "12px",
                            borderRadius: "8px"
                        }}
                    >
                        👥 Select User
                    </Link>
                </li>

                {isLoggedIn && (
                    <>
                        <li style={{ marginBottom: "15px" }}>
                            <Link 
                                to={`/todayTask/${userId}`} 
                                style={{
                                    ...link,
                                    backgroundColor: location.pathname.includes("/todayTask") ? "#ff6b35" : "transparent",
                                    display: "block",
                                    padding: "12px",
                                    borderRadius: "8px"
                                }}
                            >
                                ✅ Today's Task
                            </Link>
                        </li>

                        <li style={{ marginBottom: "15px" }}>
                            <Link 
                                to={`/workout/${userId}`} 
                                style={{
                                    ...link,
                                    backgroundColor: location.pathname.includes("/workout") ? "#ff6b35" : "transparent",
                                    display: "block",
                                    padding: "12px",
                                    borderRadius: "8px"
                                }}
                            >
                                💪 Workout
                            </Link>
                        </li>
                    </>
                )}

                {/* Logout Button - Only here */}
                <li style={{ marginBottom: "15px", marginTop: "20px" }}>
                    <button 
                        onClick={handleLogout}
                        style={{
                            ...link,
                            backgroundColor: "#f44336",
                            display: "block",
                            padding: "12px",
                            borderRadius: "8px",
                            width: "100%",
                            textAlign: "left",
                            cursor: "pointer",
                            border: "none",
                            color: "white"
                        }}
                    >
                        🚪 Logout
                    </button>
                </li>
            </ul>

            <div style={{
                marginTop: "40px",
                paddingTop: "20px",
                borderTop: "1px solid #444",
                fontSize: "12px",
                color: "#888"
            }}>
                {isLoggedIn ? `✅ Logged in (ID: ${userId})` : "❌ Not logged in"}
            </div>
        </div>
    );
}

const link = {
    color: "white",
    textDecoration: "none",
    transition: "all 0.3s ease",
    fontWeight: "500",
    fontSize: "14px"
};

export default Sidebar;