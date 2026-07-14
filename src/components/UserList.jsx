import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        
        // Check if user is admin (email = admin@example.com or userId = 1)
        if (userEmail === "admin@example.com" || userId === "1") {
            setIsAdmin(true);
            fetchAllUsers();
        } else {
            // Regular user - only show their own profile
            setIsAdmin(false);
            fetchUser(userId);
        }
    }, []);

    const fetchAllUsers = () => {
        fetch("http://localhost:8080/user/get/all/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const fetchUser = (id) => {
        fetch(`http://localhost:8080/user/get/user/${id}`)
            .then(res => res.json())
            .then(data => {
                setUsers([data]);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const handleSelect = (id, userName) => {
        localStorage.setItem("userId", id);
        localStorage.setItem("userName", userName);
        navigate(`/todayTask/${id}`);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h1>👥 {isAdmin ? "All Users" : "Your Profile"}</h1>
                <p>{isAdmin ? "Choose a profile to continue" : "Manage your fitness journey"}</p>
                {isAdmin && (
                    <div className="admin-badge">🔑 Admin Access</div>
                )}
            </div>

            <div className="user-grid">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-avatar">
                            {user.user?.charAt(0).toUpperCase() || "👤"}
                        </div>
                        <div className="user-info">
                            <h3>{user.user}</h3>
                            <div className="user-details">
                                <span>🎂 {user.age} yrs</span>
                                <span>📏 {user.height} cm</span>
                                <span>⚖️ {user.weight} kg</span>
                            </div>
                            <div className="user-meta">
                                <span>🎯 {user.goal || "Not set"}</span>
                                <span>🥗 {user.dietType || "Not set"}</span>
                            </div>
                            {isAdmin && (
                                <div className="user-id">🆔 ID: {user.id}</div>
                            )}
                        </div>
                        <button 
                            className="select-btn"
                            onClick={() => handleSelect(user.id, user.user)}
                        >
                            {isAdmin ? "Select User →" : "My Profile →"}
                        </button>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="no-users">
                    <p>No users found.</p>
                    {isAdmin && (
                        <button onClick={() => navigate("/user-form")}>Create User</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserList;