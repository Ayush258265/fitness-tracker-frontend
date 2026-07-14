import { useState, useEffect, useCallback } from "react";
import "../styles/calorie.css";

function CalorieTracker({ userId }) {
    const [calorieData, setCalorieData] = useState({
        consumed: 0,
        burned: 0,
        goal: 2000,
        date: new Date().toISOString().split('T')[0]
    });
    const [consumedInput, setConsumedInput] = useState("");
    const [burnedInput, setBurnedInput] = useState("");
    const [mealInput, setMealInput] = useState("");
    const [exerciseInput, setExerciseInput] = useState("");
    const [mealHistory, setMealHistory] = useState([]);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Wrap fetchCalorieData in useCallback
    const fetchCalorieData = useCallback(async () => {
        if (!userId) return;
        
        try {
            const response = await fetch(`http://localhost:8080/calorie/today/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setCalorieData(data);
                setMealHistory(data.meals || []);
                setExerciseHistory(data.exercises || []);
            }
        } catch (error) {
            console.error("Error fetching calorie data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]); // ← Added userId dependency

    useEffect(() => {
        fetchCalorieData();
    }, [fetchCalorieData]); // ← Added fetchCalorieData dependency

    const addConsumedCalories = async () => {
        if (!consumedInput || !mealInput) {
            alert("Please enter calories and meal description");
            return;
        }

        const newCalories = calorieData.consumed + parseInt(consumedInput);
        const newMeal = {
            id: Date.now(),
            calories: parseInt(consumedInput),
            meal: mealInput,
            time: new Date().toLocaleTimeString()
        };

        try {
            const response = await fetch(`http://localhost:8080/calorie/add/consumed/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    consumed: newCalories,
                    meal: newMeal
                })
            });

            if (response.ok) {
                setCalorieData({ ...calorieData, consumed: newCalories });
                setMealHistory([newMeal, ...mealHistory]);
                setConsumedInput("");
                setMealInput("");
                alert("Calories added! ✅");
            }
        } catch (error) {
            console.error("Error adding calories:", error);
        }
    };

    const addBurnedCalories = async () => {
        if (!burnedInput || !exerciseInput) {
            alert("Please enter calories burned and exercise description");
            return;
        }

        const newBurned = calorieData.burned + parseInt(burnedInput);
        const newExercise = {
            id: Date.now(),
            calories: parseInt(burnedInput),
            exercise: exerciseInput,
            time: new Date().toLocaleTimeString()
        };

        try {
            const response = await fetch(`http://localhost:8080/calorie/add/burned/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    burned: newBurned,
                    exercise: newExercise
                })
            });

            if (response.ok) {
                setCalorieData({ ...calorieData, burned: newBurned });
                setExerciseHistory([newExercise, ...exerciseHistory]);
                setBurnedInput("");
                setExerciseInput("");
                alert("Exercise calories added! 🔥");
            }
        } catch (error) {
            console.error("Error adding burned calories:", error);
        }
    };

    const netCalories = calorieData.consumed - calorieData.burned;
    const remainingCalories = calorieData.goal - netCalories;
    const progress = (netCalories / calorieData.goal) * 100;

    if (isLoading) {
        return <div className="calorie-loading">Loading calorie tracker...</div>;
    }

    return (
        <div className="calorie-tracker">
            <div className="calorie-header">
                <h2>🔥 Calorie Tracker</h2>
                <p>Track your daily calories - Consumed vs Burned</p>
                <div className="calorie-date">{calorieData.date}</div>
            </div>

            {/* Main Stats Cards */}
            <div className="calorie-stats">
                <div className="stat-card consumed">
                    <div className="stat-icon">🍽️</div>
                    <div className="stat-info">
                        <h3>Consumed</h3>
                        <div className="stat-value">{calorieData.consumed}</div>
                        <div className="stat-unit">calories</div>
                    </div>
                </div>

                <div className="stat-card burned">
                    <div className="stat-icon">🏃</div>
                    <div className="stat-info">
                        <h3>Burned</h3>
                        <div className="stat-value">{calorieData.burned}</div>
                        <div className="stat-unit">calories</div>
                    </div>
                </div>

                <div className="stat-card net">
                    <div className="stat-icon">⚖️</div>
                    <div className="stat-info">
                        <h3>Net</h3>
                        <div className="stat-value">{netCalories}</div>
                        <div className="stat-unit">calories</div>
                    </div>
                </div>

                <div className="stat-card remaining">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                        <h3>Remaining</h3>
                        <div className="stat-value">{remainingCalories > 0 ? remainingCalories : 0}</div>
                        <div className="stat-unit">calories</div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="calorie-progress">
                <div className="progress-label">
                    <span>Daily Goal Progress</span>
                    <span>{Math.min(Math.round(progress), 100)}%</span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            background: progress > 100 ? "#f44336" : "#4CAF50"
                        }}
                    ></div>
                </div>
                <div className="progress-target">Target: {calorieData.goal} calories</div>
            </div>

            {/* Add Consumed Section */}
            <div className="add-section">
                <div className="section-title">Add Consumed Calories</div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Calories"
                        value={consumedInput}
                        onChange={(e) => setConsumedInput(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="What did you eat? (e.g., Pizza, Salad)"
                        value={mealInput}
                        onChange={(e) => setMealInput(e.target.value)}
                    />
                    <button onClick={addConsumedCalories} className="add-btn consumed-btn">
                        + Add Meal
                    </button>
                </div>
            </div>

            {/* Add Burned Section */}
            <div className="add-section">
                <div className="section-title">Add Burned Calories</div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Calories burned"
                        value={burnedInput}
                        onChange={(e) => setBurnedInput(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Exercise (e.g., Running, Cycling)"
                        value={exerciseInput}
                        onChange={(e) => setExerciseInput(e.target.value)}
                    />
                    <button onClick={addBurnedCalories} className="add-btn burned-btn">
                        + Add Exercise
                    </button>
                </div>
            </div>

            {/* Meal History */}
            {mealHistory.length > 0 && (
                <div className="history-section">
                    <div className="section-title">📝 Today's Meals</div>
                    <div className="history-list">
                        {mealHistory.map((meal) => (
                            <div key={meal.id} className="history-item">
                                <span className="history-time">{meal.time}</span>
                                <span className="history-name">{meal.meal}</span>
                                <span className="history-calories">+{meal.calories} cal</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exercise History */}
            {exerciseHistory.length > 0 && (
                <div className="history-section">
                    <div className="section-title">💪 Today's Exercises</div>
                    <div className="history-list">
                        {exerciseHistory.map((exercise) => (
                            <div key={exercise.id} className="history-item">
                                <span className="history-time">{exercise.time}</span>
                                <span className="history-name">{exercise.exercise}</span>
                                <span className="history-calories burned">-{exercise.calories} cal</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className="calorie-tips">
                <div className="tips-title">💡 Daily Tips</div>
                <ul>
                    <li>🏃 30 minutes of running burns ~300 calories</li>
                    <li>💪 1 hour of gym workout burns ~400-600 calories</li>
                    <li>🥗 A balanced meal should be around 500-700 calories</li>
                    <li>💧 Drink 2-3 liters of water daily for better metabolism</li>
                </ul>
            </div>
        </div>
    );
}

export default CalorieTracker;