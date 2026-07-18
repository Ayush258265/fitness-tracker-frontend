// import { useState, useCallback, useEffect } from "react";
// import WorkoutTimer from "./WorkoutTimer";
// import '../styles/workout.css';

// function WorkoutSession({ workout, onComplete, userName }) {
//     const safeWorkout = Array.isArray(workout) ? workout : [];
//     const order = { WARMUP: 1, BASIC: 2, ADVANCED: 3 };
//     const sortedWorkout = [...safeWorkout].sort(
//         (a, b) => (order[a.phase] || 999) - (order[b.phase] || 999)
//     );

//     const [index, setIndex] = useState(0);
//     const [phase, setPhase] = useState("exercise");
//     const [timerKey, setTimerKey] = useState(0);
//     const [isPaused, setIsPaused] = useState(false);
//     const [completedExercises, setCompletedExercises] = useState([]);
//     const [workoutStats, setWorkoutStats] = useState({
//         exercisesCompleted: 0,
//         totalTimeSpent: 0
//     });
//     const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
//     const [finalTotalCalories, setFinalTotalCalories] = useState(0); // 🔥 store final calories

//     // Daily calorie target and remaining
//     const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);
//     const [remainingCalories, setRemainingCalories] = useState(2000);

//     const current = sortedWorkout[index];

//     // Fetch user's daily calorie target
//     useEffect(() => {
//         const userId = localStorage.getItem("userId");
//         if (userId) {
//             fetch(`http://localhost:8080/user/get/user/${userId}`)
//                 .then(res => res.json())
//                 .then(user => {
//                     const target = user.dailyCalorieTarget || (user.weight * 30) || 2000;
//                     setDailyCalorieTarget(target);
//                     setRemainingCalories(target);
//                     console.log(`🎯 Daily calorie target: ${target} kcal`);
//                 })
//                 .catch(err => console.error("Error fetching user target:", err));
//         }
//     }, []);

//     // Save workout to backend
//     const saveWorkoutToBackend = async (stats, completedExList) => {
//         try {
//             const userId = localStorage.getItem("userId");
//             const totalCalories = completedExList.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

//             console.log("\n=== WORKOUT COMPLETE SUMMARY ===");
//             console.log(`✅ Total exercises completed: ${completedExList.length}`);
//             console.log(`🔥 Total calories burned: ${totalCalories} kcal`);
//             console.log(`📊 Remaining calories for today: ${remainingCalories} kcal`);
//             console.log(`🎯 Daily target: ${dailyCalorieTarget} kcal`);
//             console.log("=================================\n");

//             const response = await fetch("http://localhost:8080/workout/history/save", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userId: Number(userId),
//                     workoutName: "Daily Workout",
//                     duration: Math.floor(Number(stats.totalTimeSpent)),
//                     exercisesCompleted: Math.floor(Number(stats.exercisesCompleted)),
//                     totalCalories: Math.floor(Number(totalCalories))
//                 })
//             });

//             if (response.ok) {
//                 console.log("✅ Workout saved successfully!");
//             } else {
//                 const errorText = await response.text();
//                 console.error("❌ Save failed:", errorText);
//             }
//         } catch (error) {
//             console.error("❌ Error saving workout:", error);
//         }
//     };

//     const handleTimerComplete = useCallback(async () => {
//         if (isPaused) return;

//         if (phase === "exercise") {
//             const exerciseCalories = current?.caloriesBurned || 0;
//             const newRemaining = remainingCalories - exerciseCalories;

//             console.log(`\n🏋️‍♂️ EXERCISE COMPLETED: ${current?.exerciseName}`);
//             console.log(`   🔥 Calories burned: ${exerciseCalories} kcal`);
//             console.log(`   📉 Remaining calories: ${newRemaining} kcal (was ${remainingCalories})`);
//             console.log(`   📈 Total burned so far: ${dailyCalorieTarget - newRemaining} kcal`);
//             console.log(`   ⏱️ Duration: ${current?.duration} seconds`);

//             setRemainingCalories(newRemaining);

//             const updatedCompleted = [...completedExercises, current];
//             setCompletedExercises(updatedCompleted);

//             setWorkoutStats(prev => ({
//                 ...prev,
//                 exercisesCompleted: prev.exercisesCompleted + 1,
//                 totalTimeSpent: prev.totalTimeSpent + (current?.duration || 0)
//             }));

//             setPhase("rest");
//             setTimerKey(prev => prev + 1);

//         } else if (phase === "rest") {
//             if (index + 1 < sortedWorkout.length) {
//                 setIndex(prev => prev + 1);
//                 setPhase("exercise");
//                 setTimerKey(prev => prev + 1);
//             } else {
//                 // Workout complete: calculate final total calories
//                 const finalCompleted = [...completedExercises, current];
//                 const totalCals = finalCompleted.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
//                 setFinalTotalCalories(totalCals);

//                 const finalStats = { ...workoutStats };
//                 await saveWorkoutToBackend(finalStats, finalCompleted);
//                 setWorkoutStats(finalStats);
//                 setIsWorkoutComplete(true);
//                 if (onComplete) onComplete(finalStats);
//             }
//         }
//     }, [phase, current, index, sortedWorkout.length, onComplete, workoutStats, isPaused, completedExercises, remainingCalories, dailyCalorieTarget]);

//     const handlePause = () => {
//         setIsPaused(true);
//     };

//     const handleResume = () => {
//         setIsPaused(false);
//         setTimerKey(prev => prev + 1);
//     };

//     const handleSkip = async () => {
//         if (phase === "exercise") {
//             const originalCalories = current?.caloriesBurned || 0;
//             const zeroCalories = 0;
//             const newRemaining = remainingCalories - zeroCalories;

//             console.log(`\n⏭️ SKIPPED EXERCISE: ${current?.exerciseName}`);
//             console.log(`   🔥 Original calories: ${originalCalories} kcal → Skipped: ${zeroCalories} kcal`);
//             console.log(`   📉 Remaining calories: ${newRemaining} kcal (was ${remainingCalories})`);

//             setRemainingCalories(newRemaining);

//             const skippedExercise = { ...current, caloriesBurned: zeroCalories };
//             const updatedCompleted = [...completedExercises, skippedExercise];
//             setCompletedExercises(updatedCompleted);

//             setWorkoutStats(prev => ({
//                 ...prev,
//                 exercisesCompleted: prev.exercisesCompleted + 1,
//                 totalTimeSpent: prev.totalTimeSpent + (current?.duration || 0) / 2
//             }));

//             setPhase("rest");
//             setTimerKey(prev => prev + 1);
//         }
//         else if (phase === "rest") {
//             console.log("\n⏩ Skipping rest...");
//             if (index + 1 < sortedWorkout.length) {
//                 setIndex(prev => prev + 1);
//                 setPhase("exercise");
//                 setTimerKey(prev => prev + 1);
//             } else {
//                 console.log("🏁 Workout finished by skipping final rest");
//                 // Calculate final total calories from already completed exercises
//                 const totalCals = completedExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
//                 setFinalTotalCalories(totalCals);
//                 await saveWorkoutToBackend(workoutStats, completedExercises);
//                 setIsWorkoutComplete(true);
//                 if (onComplete) onComplete(workoutStats);
//             }
//         }
//     };

//     // Reset when workout changes
//     useEffect(() => {
//         setIndex(0);
//         setPhase("exercise");
//         setIsWorkoutComplete(false);
//         setIsPaused(false);
//         setCompletedExercises([]);
//         setWorkoutStats({ exercisesCompleted: 0, totalTimeSpent: 0 });
//         setTimerKey(prev => prev + 1);
//         setRemainingCalories(dailyCalorieTarget);
//         setFinalTotalCalories(0);
//     }, [workout, dailyCalorieTarget]);

//     if (sortedWorkout.length === 0) {
//         return (
//             <div className="workout-error">
//                 <div className="error-icon">⚠️</div>
//                 <h2>No Workout Plan Available</h2>
//                 <button className="btn-finish" onClick={() => window.location.href = '/dashboard'}>
//                     Back to Dashboard
//                 </button>
//             </div>
//         );
//     }

//     // For live preview during workout (optional)
//     const totalCaloriesDisplay = completedExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

//     if (isWorkoutComplete) {
//         return (
//             <div className="workout-complete">
//                 <div className="complete-icon">🎉</div>
//                 <h2>Great Finish! 🏆</h2>
//                 <p>Congratulations! You've completed your workout!</p>
//                 <div className="workout-summary">
//                     <div className="summary-item">
//                         <span>✅ Exercises Completed:</span>
//                         <strong>{workoutStats.exercisesCompleted}</strong>
//                     </div>
//                     <div className="summary-item">
//                         <span>⏱ Total Time:</span>
//                         <strong>{Math.floor(workoutStats.totalTimeSpent / 60)} min {Math.round(workoutStats.totalTimeSpent % 60)} sec</strong>
//                     </div>
//                     <div className="summary-item">
//                         <span>🔥 Calories Burned:</span>
//                         <strong>{finalTotalCalories} kcal</strong>
//                     </div>
//                 </div>
//                 <button className="btn-finish" onClick={() => window.location.href = '/dashboard'}>
//                     Back to Dashboard 🏠
//                 </button>
//             </div>
//         );
//     }

//     const progress = ((index + (phase === "exercise" ? 0 : 0.5)) / sortedWorkout.length) * 100;
//     const currentDuration = phase === "exercise" ? (current?.duration || 30) : (current?.restTime || 10);

//     return (
//         <div className="workout-session-container">
//             <div className="workout-progress">
//                 <div className="progress-label">
//                     <span>Workout Progress</span>
//                     <span>{Math.round(progress)}%</span>
//                 </div>
//                 <div className="progress-bar">
//                     <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//                 </div>
//             </div>

//             <div className="workout-controls">
//                 {!isPaused ? (
//                     <button onClick={handlePause} className="control-btn pause-btn">⏸️ Pause</button>
//                 ) : (
//                     <button onClick={handleResume} className="control-btn resume-btn">▶️ Resume</button>
//                 )}
//                 <button onClick={handleSkip} className="control-btn skip-btn">⏭️ Skip</button>
//             </div>

//             <div className={`current-exercise-card phase-${current?.phase?.toLowerCase() || 'basic'}`}>
//                 <div className="phase-badge">{current?.phase || 'EXERCISE'}</div>

//                 {isPaused && (
//                     <div className="paused-overlay">
//                         <div className="paused-icon">⏸️</div>
//                         <h3>Workout Paused</h3>
//                         <p>Click Resume to continue your workout</p>
//                     </div>
//                 )}

//                 <div className="exercise-info">
//                     {phase === "exercise" ? (
//                         <>
//                             <div className="exercise-icon">
//                                 {current?.phase === "WARMUP" && "🏃"}
//                                 {current?.phase === "BASIC" && "💪"}
//                                 {current?.phase === "ADVANCED" && "🔥"}
//                             </div>
//                             <h2>{current?.exerciseName || "Exercise"}</h2>
//                             <div className="exercise-details">
//                                 <div className="detail">
//                                     <span>Duration:</span>
//                                     <strong>{current?.duration || 30} seconds</strong>
//                                 </div>
//                                 <div className="detail">
//                                     <span>🔥 Calories:</span>
//                                     <strong>{current?.caloriesBurned || 0} kcal</strong>
//                                 </div>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <div className="rest-icon">😌</div>
//                             <h2>Rest Time</h2>
//                             <div className="rest-message">
//                                 Great job! Take a breath and prepare for the next exercise
//                             </div>
//                             {index + 1 < sortedWorkout.length && (
//                                 <div className="next-exercise-preview">
//                                     Next up: <strong>{sortedWorkout[index + 1]?.exerciseName}</strong>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>

//                 {!isPaused && (
//                     <div className="timer-wrapper">
//                         <WorkoutTimer key={timerKey} duration={currentDuration} onComplete={handleTimerComplete} />
//                     </div>
//                 )}

//                 {isPaused && (
//                     <div className="paused-timer">
//                         <div className="timer-circle paused">
//                             <div className="timer-inner">
//                                 <span className="timer-value">⏸️</span>
//                                 <span className="timer-unit">paused</span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {sortedWorkout.length > 0 && (
//                 <div className="upcoming-exercises">
//                     <h3>📋 Upcoming Exercises</h3>
//                     <div className="exercise-list">
//                         {sortedWorkout.slice(index + 1, index + 4).map((ex, idx) => (
//                             <div key={idx} className="upcoming-item">
//                                 <span className="upcoming-phase">{ex?.phase || 'EXERCISE'}</span>
//                                 <span>{ex?.exerciseName || 'Exercise'}</span>
//                                 <span>{ex?.duration || 30}s</span>
//                                 <span>🔥 {ex?.caloriesBurned || 0} cal</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="exercise-counter">
//                 Exercise {index + 1} of {sortedWorkout.length}
//             </div>

//             <div className="motivation-quote">
//                 {phase === "exercise" ? (
//                     <p>💪 "Your only limit is you. Push harder!"</p>
//                 ) : (
//                     <p>🧘 "Rest is part of progress. Recover well!"</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default WorkoutSession;

import { useState, useCallback, useEffect } from "react";
import WorkoutTimer from "./WorkoutTimer";
import '../styles/workout.css';

function WorkoutSession({ workout, onComplete }) {
    const safeWorkout = Array.isArray(workout) ? workout : [];
    const order = { WARMUP: 1, BASIC: 2, ADVANCED: 3 };
    const sortedWorkout = [...safeWorkout].sort(
        (a, b) => (order[a.phase] || 999) - (order[b.phase] || 999)
    );

    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState("exercise");
    const [timerKey, setTimerKey] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [workoutStats, setWorkoutStats] = useState({
        exercisesCompleted: 0,
        totalTimeSpent: 0
    });
    const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
    const [finalTotalCalories, setFinalTotalCalories] = useState(0); // 🔥 store final calories

    // Daily calorie target and remaining
    const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);
    const [remainingCalories, setRemainingCalories] = useState(2000);

    const current = sortedWorkout[index];

    // Fetch user's daily calorie target
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:8080/user/get/user/${userId}`)
                .then(res => res.json())
                .then(user => {
                    const target = user.dailyCalorieTarget || (user.weight * 30) || 2000;
                    setDailyCalorieTarget(target);
                    setRemainingCalories(target);
                    console.log(`🎯 Daily calorie target: ${target} kcal`);
                })
                .catch(err => console.error("Error fetching user target:", err));
        }
    }, []);

    // Save workout to backend
    const saveWorkoutToBackend = useCallback(async (stats, completedExList) => {
        try {
            const userId = localStorage.getItem("userId");
            const totalCalories = completedExList.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

            console.log("\n=== WORKOUT COMPLETE SUMMARY ===");
            console.log(`✅ Total exercises completed: ${completedExList.length}`);
            console.log(`🔥 Total calories burned: ${totalCalories} kcal`);
            console.log(`📊 Remaining calories for today: ${remainingCalories} kcal`);
            console.log(`🎯 Daily target: ${dailyCalorieTarget} kcal`);
            console.log("=================================\n");

            const response = await fetch("http://localhost:8080/workout/history/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: Number(userId),
                    workoutName: "Daily Workout",
                    duration: Math.floor(Number(stats.totalTimeSpent)),
                    exercisesCompleted: Math.floor(Number(stats.exercisesCompleted)),
                    totalCalories: Math.floor(Number(totalCalories))
                })
            });

            if (response.ok) {
                console.log("✅ Workout saved successfully!");
            } else {
                const errorText = await response.text();
                console.error("❌ Save failed:", errorText);
            }
        } catch (error) {
            console.error("❌ Error saving workout:", error);
        }
    }, [remainingCalories, dailyCalorieTarget]);

    const handleTimerComplete = useCallback(async () => {
        if (isPaused) return;

        if (phase === "exercise") {
            const exerciseCalories = current?.caloriesBurned || 0;
            const newRemaining = remainingCalories - exerciseCalories;

            console.log(`\n🏋️‍♂️ EXERCISE COMPLETED: ${current?.exerciseName}`);
            console.log(`   🔥 Calories burned: ${exerciseCalories} kcal`);
            console.log(`   📉 Remaining calories: ${newRemaining} kcal (was ${remainingCalories})`);
            console.log(`   📈 Total burned so far: ${dailyCalorieTarget - newRemaining} kcal`);
            console.log(`   ⏱️ Duration: ${current?.duration} seconds`);

            setRemainingCalories(newRemaining);

            const updatedCompleted = [...completedExercises, current];
            setCompletedExercises(updatedCompleted);

            setWorkoutStats(prev => ({
                ...prev,
                exercisesCompleted: prev.exercisesCompleted + 1,
                totalTimeSpent: prev.totalTimeSpent + (current?.duration || 0)
            }));

            setPhase("rest");
            setTimerKey(prev => prev + 1);

        } else if (phase === "rest") {
            if (index + 1 < sortedWorkout.length) {
                setIndex(prev => prev + 1);
                setPhase("exercise");
                setTimerKey(prev => prev + 1);
            } else {
                // Workout complete: calculate final total calories
                const finalCompleted = [...completedExercises, current];
                const totalCals = finalCompleted.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
                setFinalTotalCalories(totalCals);

                const finalStats = { ...workoutStats };
                await saveWorkoutToBackend(finalStats, finalCompleted);
                setWorkoutStats(finalStats);
                setIsWorkoutComplete(true);
                if (onComplete) onComplete(finalStats);
            }
        }
    }, [phase, current, index, sortedWorkout.length, onComplete, workoutStats, isPaused, completedExercises, remainingCalories, dailyCalorieTarget, saveWorkoutToBackend]);

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
        setTimerKey(prev => prev + 1);
    };

    const handleSkip = async () => {
        if (phase === "exercise") {
            const originalCalories = current?.caloriesBurned || 0;
            const zeroCalories = 0;
            const newRemaining = remainingCalories - zeroCalories;

            console.log(`\n⏭️ SKIPPED EXERCISE: ${current?.exerciseName}`);
            console.log(`   🔥 Original calories: ${originalCalories} kcal → Skipped: ${zeroCalories} kcal`);
            console.log(`   📉 Remaining calories: ${newRemaining} kcal (was ${remainingCalories})`);

            setRemainingCalories(newRemaining);

            const skippedExercise = { ...current, caloriesBurned: zeroCalories };
            const updatedCompleted = [...completedExercises, skippedExercise];
            setCompletedExercises(updatedCompleted);

            setWorkoutStats(prev => ({
                ...prev,
                exercisesCompleted: prev.exercisesCompleted + 1,
                totalTimeSpent: prev.totalTimeSpent + (current?.duration || 0) / 2
            }));

            setPhase("rest");
            setTimerKey(prev => prev + 1);
        }
        else if (phase === "rest") {
            console.log("\n⏩ Skipping rest...");
            if (index + 1 < sortedWorkout.length) {
                setIndex(prev => prev + 1);
                setPhase("exercise");
                setTimerKey(prev => prev + 1);
            } else {
                console.log("🏁 Workout finished by skipping final rest");
                // Calculate final total calories from already completed exercises
                const totalCals = completedExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
                setFinalTotalCalories(totalCals);
                await saveWorkoutToBackend(workoutStats, completedExercises);
                setIsWorkoutComplete(true);
                if (onComplete) onComplete(workoutStats);
            }
        }
    };

    // Reset when workout changes
    useEffect(() => {
        setIndex(0);
        setPhase("exercise");
        setIsWorkoutComplete(false);
        setIsPaused(false);
        setCompletedExercises([]);
        setWorkoutStats({ exercisesCompleted: 0, totalTimeSpent: 0 });
        setTimerKey(prev => prev + 1);
        setRemainingCalories(dailyCalorieTarget);
        setFinalTotalCalories(0);
    }, [workout, dailyCalorieTarget]);

    if (sortedWorkout.length === 0) {
        return (
            <div className="workout-error">
                <div className="error-icon">⚠️</div>
                <h2>No Workout Plan Available</h2>
                <button className="btn-finish" onClick={() => window.location.href = '/dashboard'}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (isWorkoutComplete) {
        return (
            <div className="workout-complete">
                <div className="complete-icon">🎉</div>
                <h2>Great Finish! 🏆</h2>
                <p>Congratulations! You've completed your workout!</p>
                <div className="workout-summary">
                    <div className="summary-item">
                        <span>✅ Exercises Completed:</span>
                        <strong>{workoutStats.exercisesCompleted}</strong>
                    </div>
                    <div className="summary-item">
                        <span>⏱ Total Time:</span>
                        <strong>{Math.floor(workoutStats.totalTimeSpent / 60)} min {Math.round(workoutStats.totalTimeSpent % 60)} sec</strong>
                    </div>
                    <div className="summary-item">
                        <span>🔥 Calories Burned:</span>
                        <strong>{finalTotalCalories} kcal</strong>
                    </div>
                </div>
                <button className="btn-finish" onClick={() => window.location.href = '/dashboard'}>
                    Back to Dashboard 🏠
                </button>
            </div>
        );
    }

    const progress = ((index + (phase === "exercise" ? 0 : 0.5)) / sortedWorkout.length) * 100;
    const currentDuration = phase === "exercise" ? (current?.duration || 30) : (current?.restTime || 10);

    return (
        <div className="workout-session-container">
            <div className="workout-progress">
                <div className="progress-label">
                    <span>Workout Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="workout-controls">
                {!isPaused ? (
                    <button onClick={handlePause} className="control-btn pause-btn">⏸️ Pause</button>
                ) : (
                    <button onClick={handleResume} className="control-btn resume-btn">▶️ Resume</button>
                )}
                <button onClick={handleSkip} className="control-btn skip-btn">⏭️ Skip</button>
            </div>

            <div className={`current-exercise-card phase-${current?.phase?.toLowerCase() || 'basic'}`}>
                <div className="phase-badge">{current?.phase || 'EXERCISE'}</div>

                {isPaused && (
                    <div className="paused-overlay">
                        <div className="paused-icon">⏸️</div>
                        <h3>Workout Paused</h3>
                        <p>Click Resume to continue your workout</p>
                    </div>
                )}

                <div className="exercise-info">
                    {phase === "exercise" ? (
                        <>
                            <div className="exercise-icon">
                                {current?.phase === "WARMUP" && "🏃"}
                                {current?.phase === "BASIC" && "💪"}
                                {current?.phase === "ADVANCED" && "🔥"}
                            </div>
                            <h2>{current?.exerciseName || "Exercise"}</h2>
                            <div className="exercise-details">
                                <div className="detail">
                                    <span>Duration:</span>
                                    <strong>{current?.duration || 30} seconds</strong>
                                </div>
                                <div className="detail">
                                    <span>🔥 Calories:</span>
                                    <strong>{current?.caloriesBurned || 0} kcal</strong>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rest-icon">😌</div>
                            <h2>Rest Time</h2>
                            <div className="rest-message">
                                Great job! Take a breath and prepare for the next exercise
                            </div>
                            {index + 1 < sortedWorkout.length && (
                                <div className="next-exercise-preview">
                                    Next up: <strong>{sortedWorkout[index + 1]?.exerciseName}</strong>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!isPaused && (
                    <div className="timer-wrapper">
                        <WorkoutTimer key={timerKey} duration={currentDuration} onComplete={handleTimerComplete} />
                    </div>
                )}

                {isPaused && (
                    <div className="paused-timer">
                        <div className="timer-circle paused">
                            <div className="timer-inner">
                                <span className="timer-value">⏸️</span>
                                <span className="timer-unit">paused</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {sortedWorkout.length > 0 && (
                <div className="upcoming-exercises">
                    <h3>📋 Upcoming Exercises</h3>
                    <div className="exercise-list">
                        {sortedWorkout.slice(index + 1, index + 4).map((ex, idx) => (
                            <div key={idx} className="upcoming-item">
                                <span className="upcoming-phase">{ex?.phase || 'EXERCISE'}</span>
                                <span>{ex?.exerciseName || 'Exercise'}</span>
                                <span>{ex?.duration || 30}s</span>
                                <span>🔥 {ex?.caloriesBurned || 0} cal</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="exercise-counter">
                Exercise {index + 1} of {sortedWorkout.length}
            </div>

            <div className="motivation-quote">
                {phase === "exercise" ? (
                    <p>💪 "Your only limit is you. Push harder!"</p>
                ) : (
                    <p>🧘 "Rest is part of progress. Recover well!"</p>
                )}
            </div>
        </div>
    );
}

export default WorkoutSession;
