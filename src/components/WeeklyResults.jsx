import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API_BASE_URL from "../config/api";
import "../styles/weeklyResults.css";

function WeeklyResults({ userId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchWeeklyResults();
        }
    }, [userId]);

    const fetchWeeklyResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/workout/history/weekly-results/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Weekly Results:", result);
            setData(result);
        } catch (err) {
            console.error("Error fetching weekly results:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="weekly-loading">
                <div className="loader"></div>
                <p>Loading your weekly results...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="weekly-error">
                <p>⚠️ Failed to load weekly results</p>
                <button onClick={fetchWeeklyResults}>Try Again</button>
            </div>
        );
    }

    // No data state
    if (!data || data.totalWorkouts === 0) {
        return (
            <div className="weekly-empty">
                <div className="empty-icon">📊</div>
                <h3>No Workouts This Week</h3>
                <p>Complete your first workout to see your weekly results!</p>
                <button className="start-workout-btn" onClick={() => window.location.href = `/workout/${userId}`}>
                    Start Your First Workout 💪
                </button>
            </div>
        );
    }

    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
    };

    // Custom tooltip for chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-day">{payload[0].payload.day}</p>
                    <p className="tooltip-calories">🔥 {payload[0].value} cal</p>
                    <p className="tooltip-duration">⏱️ {formatDuration(payload[0].payload.duration)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="weekly-results-container">
            {/* Header */}
            <div className="weekly-header">
                <h2>📊 Weekly Results</h2>
                <p>Your fitness progress for this week</p>
            </div>

            {/* Stat Cards */}
            <div className="weekly-stats">
                <div className="stat-card">
                    <div className="stat-icon">💪</div>
                    <div className="stat-info">
                        <div className="stat-value">{data.totalWorkouts}</div>
                        <div className="stat-label">Workouts</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <div className="stat-value">{data.totalCalories}</div>
                        <div className="stat-label">Calories Burned</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                        <div className="stat-value">{formatDuration(data.totalDuration)}</div>
                        <div className="stat-label">Total Duration</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <div className="stat-value">{data.currentStreak}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="weekly-chart">
                <h3>Daily Calories Burned</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.dailyBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                            dataKey="calories" 
                            fill="#ff6b35" 
                            radius={[8, 8, 0, 0]} 
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Weekly Summary Text */}
            <div className="weekly-summary">
                <p>
                    {data.totalWorkouts === 1 ? (
                        "💪 Great start! Keep the momentum going!"
                    ) : data.totalWorkouts >= 3 && data.totalWorkouts < 5 ? (
                        "🔥 You're on fire! Keep pushing!"
                    ) : data.totalWorkouts >= 5 ? (
                        "🏆 Amazing week! You're crushing it!"
                    ) : (
                        "🌟 Every workout counts. Keep going!"
                    )}
                </p>
            </div>

            {/* Refresh Button */}
            <button className="refresh-btn" onClick={fetchWeeklyResults}>
                🔄 Refresh
            </button>
        </div>
    );
}

export default WeeklyResults;