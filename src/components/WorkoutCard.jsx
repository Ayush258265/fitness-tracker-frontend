import React from 'react';
import '../styles/workoutCard.css';

function WorkoutCard({ startWorkout, workoutPlan, isLoading }) {
    const previewExercises = workoutPlan?.slice(0, 4) || [];
    const totalDuration = workoutPlan?.reduce((sum, ex) => sum + (ex.duration || 0), 0) || 0;
    const totalEstCalories = workoutPlan?.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0) || 0;

    return (
        <div className="workout-card-modern">
            <div className="hero-glow"></div>
            <div className="hero-content">
                <div className="icon-bounce">💪</div>
                <h1>Ready to <span className="gradient-text">Transform</span>?</h1>
                <p>You're one workout away from a better you.</p>
            </div>

            {isLoading ? (
                <div className="loading-skeleton">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                </div>
            ) : (
                <>
                    {previewExercises.length > 0 && (
                        <div className="preview-section">
                            <h3>🔥 Today's Challenge</h3>
                            <div className="exercise-grid">
                                {previewExercises.map((ex, idx) => (
                                    <div key={idx} className="exercise-tile">
                                        <div className="tile-icon">
                                            {ex.phase === 'WARMUP' && '🏃'}
                                            {ex.phase === 'BASIC' && '💪'}
                                            {ex.phase === 'ADVANCED' && '🔥'}
                                        </div>
                                        <div className="tile-name">{ex.exerciseName}</div>
                                        <div className="tile-meta">
                                            <span>⏱️ {ex.duration}s</span>
                                            <span>🔥 {ex.caloriesBurned || 0}</span>
                                        </div>
                                    </div>
                                ))}
                                {workoutPlan?.length > 4 && (
                                    <div className="exercise-tile more">
                                        <div className="tile-icon">➕</div>
                                        <div className="tile-name">+{workoutPlan.length - 4} more</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="stats-row">
                        <div className="stat-block">
                            <span className="stat-number">{workoutPlan?.length || 0}</span>
                            <span className="stat-label">exercises</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-number">{Math.floor(totalDuration / 60)}</span>
                            <span className="stat-label">minutes</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-number">{totalEstCalories}</span>
                            <span className="stat-label">calories</span>
                        </div>
                    </div>

                    <button className="start-glowing-btn" onClick={startWorkout}>
                        🚀 START WORKOUT
                        <span className="btn-overlay"></span>
                    </button>

                    <div className="tip-card">
                        💡 <strong>Pro tip:</strong> Warm up for 5 minutes to prevent injury & boost performance.
                    </div>
                </>
            )}
        </div>
    );
}

export default WorkoutCard;