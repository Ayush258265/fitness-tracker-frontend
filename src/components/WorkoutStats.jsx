// import React, { useState, useEffect, useCallback } from "react";
// import "../styles/workoutStats.css";

// function WorkoutStats({ userId }) {
//     const [stats, setStats] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const fetchStats = useCallback(async () => {
//         if (!userId) return;
        
//         try {
//             const response = await fetch(`http://localhost:8080/workout/history/weekly-summary/${userId}`);
//             const data = await response.json();
//             console.log("Stats data:", data);
//             setStats(data);
//             setIsLoading(false);
//         } catch (error) {
//             console.error("Error fetching stats:", error);
//             setIsLoading(false);
//         }
//     }, [userId]);

//     useEffect(() => {
//         fetchStats();
//     }, [fetchStats]);

//     // Show loading state
//     if (isLoading) {
//         return (
//             <div className="stats-loading">
//                 <div className="loader"></div>
//                 <p>Loading your performance...</p>
//             </div>
//         );
//     }

//     // Show error/empty state if no stats
//     if (!stats || !stats.weeklyWorkouts) {
//         return (
//             <div className="stats-error">
//                 <p>No workout data available. Start your first workout!</p>
//             </div>
//         );
//     }

//     // Make sure weeklyWorkouts is an array
//     const weeklyWorkouts = Array.isArray(stats.weeklyWorkouts) ? stats.weeklyWorkouts : [];
    
//     // Find max workout count for bar chart scaling
//     const maxWorkouts = weeklyWorkouts.length > 0 
//         ? Math.max(...weeklyWorkouts.map(day => day.workoutCount || 0), 1)
//         : 1;

//     return (
//         <div className="workout-stats-container">
//             <div className="stats-header">
//                 <h2>📊 Your Performance</h2>
//                 <p>Track your fitness journey</p>
//             </div>

//             {/* Stats Cards */}
//             <div className="stats-cards-row">
//                 <div className="stat-card">
//                     <div className="stat-emoji">🔥</div>
//                     <div className="stat-value">{stats.currentStreak || 0}</div>
//                     <div className="stat-label">Current Streak</div>
//                     {stats.bestStreak > 0 && (
//                         <div className="stat-sub">Best: {stats.bestStreak} days</div>
//                     )}
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-emoji">💪</div>
//                     <div className="stat-value">{stats.totalWorkouts || 0}</div>
//                     <div className="stat-label">Total Workouts</div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-emoji">⚡</div>
//                     <div className="stat-value">{stats.totalCalories || 0}</div>
//                     <div className="stat-label">Calories Burned</div>
//                 </div>
//             </div>

//             {/* Streak Progress Ring */}
//             {(stats.currentStreak > 0 || stats.bestStreak > 0) && (
//                 <div className="streak-ring-container">
//                     <div className="streak-ring">
//                         <div className="streak-number">{stats.currentStreak || 0}</div>
//                         <div className="streak-label">Day Streak</div>
//                     </div>
//                     {stats.bestStreak > 0 && (
//                         <div className="streak-goal">
//                             Best: {stats.bestStreak} days
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Bar Graph Section - Only show if there's data */}
//             {weeklyWorkouts.length > 0 && (
//                 <div className="bar-chart-section">
//                     <h3>Weekly Workout Activity</h3>
//                     <div className="bar-chart">
//                         {weeklyWorkouts.map((day, index) => (
//                             <div key={index} className="bar-item">
//                                 <div className="bar-label">{day.day || "???"}</div>
//                                 <div 
//                                     className="bar" 
//                                     style={{ 
//                                         height: `${((day.workoutCount || 0) / maxWorkouts) * 150}px`,
//                                         backgroundColor: (day.workoutCount || 0) > 0 ? "#ff6b35" : "#e0e0e0"
//                                     }}
//                                 >
//                                     {(day.workoutCount || 0) > 0 && (
//                                         <span className="bar-value">{day.workoutCount}</span>
//                                     )}
//                                 </div>
//                                 <div className="bar-calories">
//                                     {(day.calories || 0) > 0 ? `${day.calories} cal` : ''}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Weekly Summary Text */}
//             {weeklyWorkouts.length > 0 && (
//                 <div className="weekly-summary">
//                     <h3>This Week</h3>
//                     <div className="summary-stats">
//                         <div className="summary-item">
//                             <span>Total Workouts:</span>
//                             <strong>{weeklyWorkouts.reduce((sum, day) => sum + (day.workoutCount || 0), 0)}</strong>
//                         </div>
//                         <div className="summary-item">
//                             <span>Total Calories:</span>
//                             <strong>{weeklyWorkouts.reduce((sum, day) => sum + (day.calories || 0), 0)} cal</strong>
//                         </div>
//                         <div className="summary-item">
//                             <span>Active Days:</span>
//                             <strong>{weeklyWorkouts.filter(day => (day.workoutCount || 0) > 0).length} / 7</strong>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Motivation Message */}
//             {(!stats.currentStreak || stats.currentStreak === 0) && (!stats.totalWorkouts || stats.totalWorkouts === 0) && (
//                 <div className="motivation-message">
//                     <p>🌟 Ready to start your fitness journey?</p>
//                     <p>Complete your first workout to see your stats!</p>
//                 </div>
//             )}

//             {(stats.currentStreak || 0) >= 3 && (
//                 <div className="streak-message">
//                     🔥 Amazing! You're on a {stats.currentStreak}-day streak! Keep going!
//                 </div>
//             )}
//         </div>
//     );
// }

// export default WorkoutStats;

import React, { useState, useEffect, useCallback } from "react";
import API_BASE_URL from "../config/api";
import "../styles/workoutStats.css";

function WorkoutStats({ userId }) {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/workout/history/weekly-summary/${userId}`);
            const data = await response.json();
            console.log("Stats data:", data);
            setStats(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (isLoading) {
        return (
            <div className="stats-loading">
                <div className="loader"></div>
                <p>Loading your performance...</p>
            </div>
        );
    }

    if (!stats || !stats.weeklyWorkouts) {
        return (
            <div className="stats-error">
                <p>No workout data available. Start your first workout!</p>
            </div>
        );
    }

    const weeklyWorkouts = Array.isArray(stats.weeklyWorkouts) ? stats.weeklyWorkouts : [];
    const maxWorkouts = weeklyWorkouts.length > 0 
        ? Math.max(...weeklyWorkouts.map(day => day.workoutCount || 0), 1)
        : 1;

    return (
        <div className="workout-stats-container">
            <div className="stats-header">
                <h2>📊 Your Performance</h2>
                <p>Track your fitness journey</p>
            </div>

            <div className="stats-cards-row">
                <div className="stat-card">
                    <div className="stat-emoji">🔥</div>
                    <div className="stat-value">{stats.currentStreak || 0}</div>
                    <div className="stat-label">Current Streak</div>
                    {stats.bestStreak > 0 && (
                        <div className="stat-sub">Best: {stats.bestStreak} days</div>
                    )}
                </div>

                <div className="stat-card">
                    <div className="stat-emoji">💪</div>
                    <div className="stat-value">{stats.totalWorkouts || 0}</div>
                    <div className="stat-label">Total Workouts</div>
                </div>

                <div className="stat-card">
                    <div className="stat-emoji">⚡</div>
                    <div className="stat-value">{stats.totalCalories || 0}</div>
                    <div className="stat-label">Calories Burned</div>
                </div>
            </div>

            {(stats.currentStreak > 0 || stats.bestStreak > 0) && (
                <div className="streak-ring-container">
                    <div className="streak-ring">
                        <div className="streak-number">{stats.currentStreak || 0}</div>
                        <div className="streak-label">Day Streak</div>
                    </div>
                    {stats.bestStreak > 0 && (
                        <div className="streak-goal">
                            Best: {stats.bestStreak} days
                        </div>
                    )}
                </div>
            )}

            {weeklyWorkouts.length > 0 && (
                <div className="bar-chart-section">
                    <h3>Weekly Workout Activity</h3>
                    <div className="bar-chart">
                        {weeklyWorkouts.map((day, index) => (
                            <div key={index} className="bar-item">
                                <div className="bar-label">{day.day || "???"}</div>
                                <div 
                                    className="bar" 
                                    style={{ 
                                        height: `${((day.workoutCount || 0) / maxWorkouts) * 150}px`,
                                        backgroundColor: (day.workoutCount || 0) > 0 ? "#ff6b35" : "#e0e0e0"
                                    }}
                                >
                                    {(day.workoutCount || 0) > 0 && (
                                        <span className="bar-value">{day.workoutCount}</span>
                                    )}
                                </div>
                                <div className="bar-calories">
                                    {(day.calories || 0) > 0 ? `${day.calories} cal` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {weeklyWorkouts.length > 0 && (
                <div className="weekly-summary">
                    <h3>This Week</h3>
                    <div className="summary-stats">
                        <div className="summary-item">
                            <span>Total Workouts:</span>
                            <strong>{weeklyWorkouts.reduce((sum, day) => sum + (day.workoutCount || 0), 0)}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Total Calories:</span>
                            <strong>{weeklyWorkouts.reduce((sum, day) => sum + (day.calories || 0), 0)} cal</strong>
                        </div>
                        <div className="summary-item">
                            <span>Active Days:</span>
                            <strong>{weeklyWorkouts.filter(day => (day.workoutCount || 0) > 0).length} / 7</strong>
                        </div>
                    </div>
                </div>
            )}

            {(!stats.currentStreak || stats.currentStreak === 0) && (!stats.totalWorkouts || stats.totalWorkouts === 0) && (
                <div className="motivation-message">
                    <p>🌟 Ready to start your fitness journey?</p>
                    <p>Complete your first workout to see your stats!</p>
                </div>
            )}

            {(stats.currentStreak || 0) >= 3 && (
                <div className="streak-message">
                    🔥 Amazing! You're on a {stats.currentStreak}-day streak! Keep going!
                </div>
            )}
        </div>
    );
}

export default WorkoutStats;