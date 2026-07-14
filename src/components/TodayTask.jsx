import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/todaytask.css";

function TodayTask() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedExercises, setCompletedExercises] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/todayTask/${id}`)
            .then(res => res.json())
            .then(result => {
                console.log("API Response:", result);
                setData(result);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const toggleExerciseComplete = (exerciseId) => {
        if (completedExercises.includes(exerciseId)) {
            setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
        } else {
            setCompletedExercises([...completedExercises, exerciseId]);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <h2>Loading your fitness plan...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="no-data-container">
                <div className="no-data-icon">📭</div>
                <h2>No Tasks for Today</h2>
                <button onClick={() => window.location.href = '/dashboard'} className="btn">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const warmupExercises = data.workoutPlan?.filter(ex => ex.phase === "WARMUP") || [];
    const basicExercises = data.workoutPlan?.filter(ex => ex.phase === "BASIC") || [];
    const advancedExercises = data.workoutPlan?.filter(ex => ex.phase === "ADVANCED") || [];

    const calorieProgress = (data.calorie?.consumed / data.calorie?.target) * 100;
    const waterProgress = (data.water?.completed / data.water?.target) * 100;
    const totalExercises = data.workoutPlan?.length || 0;
    const completedCount = completedExercises.length;
    const workoutProgress = (completedCount / totalExercises) * 100;

    return (
        <div className="todaytask-container">
            {/* Header with Progress */}
            <div className="task-header">
                <h1>✅ Today's Fitness Plan</h1>
                <p>Stay consistent, stay motivated! 💪</p>
                <div className="overall-progress">
                    <div className="progress-label">
                        <span>Daily Progress</span>
                        <span>{Math.round((calorieProgress + waterProgress + workoutProgress) / 3)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(calorieProgress + waterProgress + workoutProgress) / 3}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Workout Plan Section - INTERACTIVE */}
            <div className="task-section workout-section">
                <div className="section-header">
                    <div className="section-icon">🏋️</div>
                    <div className="section-title">
                        <h2>Today's Workout Plan</h2>
                        <p>{completedCount} of {totalExercises} completed</p>
                    </div>
                </div>
                
                <div className="workout-progress-bar">
                    <div className="progress-fill" style={{ width: `${workoutProgress}%` }}></div>
                </div>

                {/* WARMUP Exercises */}
                {warmupExercises.length > 0 && (
                    <div className="exercise-phase">
                        <div className="phase-header warmup">
                            <span className="phase-icon">🏃</span>
                            <h3>WARMUP</h3>
                            <span className="phase-duration">Light intensity</span>
                        </div>
                        <div className="exercise-list">
                            {warmupExercises.map((exercise) => (
                                <div 
                                    key={exercise.id} 
                                    className={`exercise-item ${completedExercises.includes(exercise.id) ? 'completed' : ''}`}
                                    onClick={() => toggleExerciseComplete(exercise.id)}
                                >
                                    <div className="exercise-check">
                                        {completedExercises.includes(exercise.id) ? '✅' : '⬜'}
                                    </div>
                                    <div className="exercise-info">
                                        <div className="exercise-name">{exercise.exerciseName}</div>
                                        <div className="exercise-meta">
                                            <span>⏱️ {exercise.duration}s</span>
                                            <span>😌 Rest: {exercise.restTime}s</span>
                                        </div>
                                    </div>
                                    <div className="exercise-action">
                                        <button className="view-detail-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BASIC Exercises */}
                {basicExercises.length > 0 && (
                    <div className="exercise-phase">
                        <div className="phase-header basic">
                            <span className="phase-icon">💪</span>
                            <h3>BASIC</h3>
                            <span className="phase-duration">Moderate intensity</span>
                        </div>
                        <div className="exercise-list">
                            {basicExercises.map((exercise) => (
                                <div 
                                    key={exercise.id} 
                                    className={`exercise-item ${completedExercises.includes(exercise.id) ? 'completed' : ''}`}
                                    onClick={() => toggleExerciseComplete(exercise.id)}
                                >
                                    <div className="exercise-check">
                                        {completedExercises.includes(exercise.id) ? '✅' : '⬜'}
                                    </div>
                                    <div className="exercise-info">
                                        <div className="exercise-name">{exercise.exerciseName}</div>
                                        <div className="exercise-meta">
                                            <span>⏱️ {exercise.duration}s</span>
                                            <span>😌 Rest: {exercise.restTime}s</span>
                                        </div>
                                    </div>
                                    <div className="exercise-action">
                                        <button className="view-detail-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ADVANCED Exercises */}
                {advancedExercises.length > 0 && (
                    <div className="exercise-phase">
                        <div className="phase-header advanced">
                            <span className="phase-icon">🔥</span>
                            <h3>ADVANCED</h3>
                            <span className="phase-duration">High intensity</span>
                        </div>
                        <div className="exercise-list">
                            {advancedExercises.map((exercise) => (
                                <div 
                                    key={exercise.id} 
                                    className={`exercise-item ${completedExercises.includes(exercise.id) ? 'completed' : ''}`}
                                    onClick={() => toggleExerciseComplete(exercise.id)}
                                >
                                    <div className="exercise-check">
                                        {completedExercises.includes(exercise.id) ? '✅' : '⬜'}
                                    </div>
                                    <div className="exercise-info">
                                        <div className="exercise-name">{exercise.exerciseName}</div>
                                        <div className="exercise-meta">
                                            <span>⏱️ {exercise.duration}s</span>
                                            <span>😌 Rest: {exercise.restTime}s</span>
                                        </div>
                                    </div>
                                    <div className="exercise-action">
                                        <button className="view-detail-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Start Workout Button */}
                <button 
                    className="start-workout-btn"
                    onClick={() => window.location.href = `/workout/${id}`}
                >
                    🚀 Start Full Workout Session
                </button>
            </div>

            {/* Calories Section */}
            <div className="task-section calories-section">
                <div className="section-icon">🔥</div>
                <div className="section-content">
                    <h2>Calorie Tracker</h2>
                    <div className="progress-container">
                        <div className="progress-info">
                            <span>Consumed: {data.calorie?.consumed} cal</span>
                            <span>Target: {data.calorie?.target} cal</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill calorie-fill" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div>
                        </div>
                        <div className="progress-status">
                            {calorieProgress >= 100 ? "✅ Target achieved!" : `${Math.round(calorieProgress)}% completed`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Water Section (read‑only) */}
            <div className="task-section water-section">
                <div className="section-icon">💧</div>
                <div className="section-content">
                    <h2>Water Intake</h2>
                    <div className="progress-container">
                        <div className="progress-info">
                            <span>Drank: {data.water?.completed}L</span>
                            <span>Goal: {data.water?.target}L</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill water-fill" style={{ width: `${Math.min(waterProgress, 100)}%` }}></div>
                        </div>
                        <div className="progress-status">
                            {waterProgress >= 100 ? "💧 Hydration goal met!" : `${Math.round(waterProgress)}% of daily goal`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Diet Section */}
            <div className="task-section diet-section">
                <div className="section-icon">🍽️</div>
                <div className="section-content">
                    <h2>Meal Plan</h2>
                    <div className="meal-grid">
                        <div className="meal-card">
                            <div className="meal-icon">🌅</div>
                            <div className="meal-name">Breakfast</div>
                            <div className="meal-desc">{data.diet?.breakfast}</div>
                        </div>
                        <div className="meal-card">
                            <div className="meal-icon">☀️</div>
                            <div className="meal-name">Lunch</div>
                            <div className="meal-desc">{data.diet?.lunch}</div>
                        </div>
                        <div className="meal-card">
                            <div className="meal-icon">🌙</div>
                            <div className="meal-name">Dinner</div>
                            <div className="meal-desc">{data.diet?.dinner}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Motivation Footer */}
            <div className="motivation-footer">
                <p>🌟 Every small step counts! You've got this! 🌟</p>
            </div>
        </div>
    );
}

export default TodayTask;