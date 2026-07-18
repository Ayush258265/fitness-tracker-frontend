import React, { useState, useEffect } from "react";
import "../styles/exerciselibrary.css";
import API_BASE_URL from "../config/api";

function ExerciseLibrary() {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedPhase, setSelectedPhase] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all exercises from backend
    useEffect(() => {
        fetchAllExercises();
    }, []);

    const fetchAllExercises = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/workout/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Exercises loaded:", data.length);
            setExercises(data);
            setFilteredExercises(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching exercises:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter exercises based on category, phase, and search
    useEffect(() => {
        let filtered = [...exercises];

        // Filter by BMI Category
        if (selectedCategory !== "ALL") {
            filtered = filtered.filter(ex => ex.bmiCategory === selectedCategory);
        }

        // Filter by Phase
        if (selectedPhase !== "ALL") {
            filtered = filtered.filter(ex => ex.phase === selectedPhase);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(ex =>
                ex.exerciseName && ex.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExercises(filtered);
    }, [selectedCategory, selectedPhase, searchTerm, exercises]);

    // Get unique BMI categories for filter
    const categories = ["ALL", ...new Set(exercises.map(ex => ex.bmiCategory).filter(Boolean))];
    const phases = ["ALL", "WARMUP", "BASIC", "ADVANCED"];

    // Get phase icon
    const getPhaseIcon = (phase) => {
        switch (phase) {
            case "WARMUP": return "🏃";
            case "BASIC": return "💪";
            case "ADVANCED": return "🔥";
            default: return "🏋️";
        }
    };

    // Get category badge color
    const getCategoryColor = (category) => {
        switch (category) {
            case "UNDERWEIGHT": return "#2196F3";
            case "NORMAL": return "#4CAF50";
            case "OVERWEIGHT": return "#ff9800";
            case "OBESE": return "#f44336";
            default: return "#666";
        }
    };

    if (isLoading) {
        return (
            <div className="library-loading">
                <div className="loader"></div>
                <h2>Loading Exercise Library...</h2>
                <p>Please wait while we fetch all exercises</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="library-error">
                <div className="error-icon">⚠️</div>
                <h2>Failed to Load Exercises</h2>
                <p>{error}</p>
                <button onClick={() => fetchAllExercises()} className="retry-btn">
                    🔄 Try Again
                </button>
                <div className="debug-info">
                    <p>Make sure the backend server is running.</p>
                    <p>Check endpoint: GET {`${API_BASE_URL}/api/workout/all`}</p>
                </div>
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <div className="library-empty">
                <div className="empty-icon">📭</div>
                <h2>No Exercises Found</h2>
                <p>No exercises available in the database yet.</p>
                <p>Please add exercises to your workout_plan table.</p>
            </div>
        );
    }

    return (
        <div className="exercise-library-container">
            {/* Header */}
            <div className="library-header">
                <h1>📚 Exercise Library</h1>
                <p>Browse all {exercises.length} exercises to improve your fitness</p>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>🔍 Search Exercise</label>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <label>🏷️ BMI Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === "ALL" ? "All Categories" : cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>⚡ Phase</label>
                    <select
                        value={selectedPhase}
                        onChange={(e) => setSelectedPhase(e.target.value)}
                        className="filter-select"
                    >
                        {phases.map(phase => (
                            <option key={phase} value={phase}>
                                {phase === "ALL" ? "All Phases" : phase}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-count">
                Showing {filteredExercises.length} of {exercises.length} exercises
            </div>

            {/* Exercises Grid */}
            <div className="exercises-grid">
                {filteredExercises.map((exercise, index) => (
                    <div key={exercise.id || index} className="exercise-card">
                        <div className="exercise-header">
                            <div className="exercise-icon">
                                {getPhaseIcon(exercise.phase)}
                            </div>
                            <div
                                className="category-badge"
                                style={{ backgroundColor: getCategoryColor(exercise.bmiCategory) }}
                            >
                                {exercise.bmiCategory}
                            </div>
                        </div>

                        <div className="exercise-body">
                            <h3>{exercise.exerciseName}</h3>
                            <div className="exercise-phase">
                                <span className="phase-badge">{exercise.phase}</span>
                            </div>
                            <div className="exercise-stats">
                                <div className="stat">
                                    <span>⏱️ Duration:</span>
                                    <strong>{exercise.duration} sec</strong>
                                </div>
                                <div className="stat">
                                    <span>😌 Rest:</span>
                                    <strong>{exercise.restTime} sec</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredExercises.length === 0 && (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No exercises found</h3>
                    <p>Try changing your filters or search term</p>
                    <button onClick={() => {
                        setSelectedCategory("ALL");
                        setSelectedPhase("ALL");
                        setSearchTerm("");
                    }} className="clear-filters-btn">
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExerciseLibrary;