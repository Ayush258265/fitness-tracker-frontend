// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import WorkoutStats from "../components/WorkoutStats";
// import "../styles/dashboard.css";

// function Dashboard() {
//     const [user, setUser] = useState(null);
//     const [totalCalories, setTotalCalories] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const userId = localStorage.getItem("userId");

//         if (!userId) {
//             navigate("/users");
//             return;
//         }

//         fetch(`http://localhost:8080/user/get/user/${userId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("User Data:", data);
//                 setUser(data);
//             })
//             .catch(err => console.error(err));
        
//         fetch(`http://localhost:8080/workout/history/stats/${userId}`)
//             .then(res => res.json())
//             .then(data => setTotalCalories(data.totalCalories || 0))
//             .catch(err => console.error(err));
//     }, [navigate]);

//     if (!user) return (
//         <div className="loading-container">
//             <div className="loader"></div>
//             <h2>Loading your fitness data...</h2>
//         </div>
//     );

//     return (
//         <div className="dashboard-container">
//             {/* Welcome Header */}
//             <div className="welcome-header">
//                 <h1>Welcome back, {user.user}! 👋</h1>
//                 <p>Ready to crush your fitness goals today?</p>
//             </div>

//             {/* User Stats Cards */}
//             <div className="stats-grid">
//                 <div className="stat-card">
//                     <div className="stat-icon">📊</div>
//                     <div className="stat-info">
//                         <h3>Age</h3>
//                         <p>{user.age} years</p>
//                     </div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-icon">📏</div>
//                     <div className="stat-info">
//                         <h3>Height</h3>
//                         <p>{user.height} cm</p>
//                     </div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-icon">⚖️</div>
//                     <div className="stat-info">
//                         <h3>Weight</h3>
//                         <p>{user.weight} kg</p>
//                     </div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-icon">🎯</div>
//                     <div className="stat-info">
//                         <h3>Goal</h3>
//                         <p>{user.goal}</p>
//                     </div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-icon">🥗</div>
//                     <div className="stat-info">
//                         <h3>Diet Type</h3>
//                         <p>{user.dietType}</p>
//                     </div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-icon">🔥</div>
//                     <div className="stat-info">
//                         <h3>Total Calories</h3>
//                         <p>{totalCalories} kcal</p>
//                     </div>
//                 </div>
//             </div>

//             {/* BMI Calculator Section */}
//             <div className="bmi-section">
//                 <h2>Your BMI Status</h2>
//                 <div className="bmi-card">
//                     <div className="bmi-value">
//                         {((user.weight / ((user.height/100) ** 2)).toFixed(1))}
//                     </div>
//                     <div className="bmi-status">
//                         {((user.weight / ((user.height/100) ** 2)) < 18.5) && "Underweight"}
//                         {((user.weight / ((user.height/100) ** 2)) >= 18.5 && (user.weight / ((user.height/100) ** 2)) < 25) && "Normal Weight"}
//                         {((user.weight / ((user.height/100) ** 2)) >= 25 && (user.weight / ((user.height/100) ** 2)) < 30) && "Overweight"}
//                         {((user.weight / ((user.height/100) ** 2)) >= 30) && "Obese"}
//                     </div>
//                 </div>
//             </div>

//             {/* Workout Stats Section */}
//             <WorkoutStats userId={user.id} />

//             {/* Action Buttons */}
//             <div className="action-buttons">
//                 <button 
//                     className="btn btn-primary"
//                     onClick={() => navigate("/userInfo")}
//                 >
//                     ✏️ Edit Profile
//                 </button>

//                 <button 
//                     className="btn btn-success"
//                     onClick={() => navigate(`/todayTask/${user.id}`)}
//                 >
//                     ✅ Today's Tasks
//                 </button>

//                 <button 
//                     className="btn btn-danger"
//                     onClick={() => navigate(`/workout/${user.id}`)}
//                 >
//                     💪 Start Workout
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import WorkoutStats from "../components/WorkoutStats";
import "../styles/dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [totalCalories, setTotalCalories] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            navigate("/users");
            return;
        }

        fetch(`${API_BASE_URL}/user/get/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("User Data:", data);
                setUser(data);
            })
            .catch(err => console.error(err));
        
        fetch(`${API_BASE_URL}/workout/history/stats/${userId}`)
            .then(res => res.json())
            .then(data => setTotalCalories(data.totalCalories || 0))
            .catch(err => console.error(err));
    }, [navigate]);

    if (!user) return (
        <div className="loading-container">
            <div className="loader"></div>
            <h2>Loading your fitness data...</h2>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="welcome-header">
                <h1>Welcome back, {user.user}! 👋</h1>
                <p>Ready to crush your fitness goals today?</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>Age</h3>
                        <p>{user.age} years</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📏</div>
                    <div className="stat-info">
                        <h3>Height</h3>
                        <p>{user.height} cm</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚖️</div>
                    <div className="stat-info">
                        <h3>Weight</h3>
                        <p>{user.weight} kg</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                        <h3>Goal</h3>
                        <p>{user.goal}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🥗</div>
                    <div className="stat-info">
                        <h3>Diet Type</h3>
                        <p>{user.dietType}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <h3>Total Calories</h3>
                        <p>{totalCalories} kcal</p>
                    </div>
                </div>
            </div>

            <div className="bmi-section">
                <h2>Your BMI Status</h2>
                <div className="bmi-card">
                    <div className="bmi-value">
                        {((user.weight / ((user.height/100) ** 2)).toFixed(1))}
                    </div>
                    <div className="bmi-status">
                        {((user.weight / ((user.height/100) ** 2)) < 18.5) && "Underweight"}
                        {((user.weight / ((user.height/100) ** 2)) >= 18.5 && (user.weight / ((user.height/100) ** 2)) < 25) && "Normal Weight"}
                        {((user.weight / ((user.height/100) ** 2)) >= 25 && (user.weight / ((user.height/100) ** 2)) < 30) && "Overweight"}
                        {((user.weight / ((user.height/100) ** 2)) >= 30) && "Obese"}
                    </div>
                </div>
            </div>

            <WorkoutStats userId={user.id} />

            <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => navigate("/userInfo")}>
                    ✏️ Edit Profile
                </button>
                <button className="btn btn-success" onClick={() => navigate(`/todayTask/${user.id}`)}>
                    ✅ Today's Tasks
                </button>
                <button className="btn btn-danger" onClick={() => navigate(`/workout/${user.id}`)}>
                    💪 Start Workout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;