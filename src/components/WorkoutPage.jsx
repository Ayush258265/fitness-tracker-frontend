import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkoutCard from '../components/WorkoutCard';
import WorkoutSession from '../components/WorkoutSession';

function WorkoutPage() {
    const { userId } = useParams();
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch workout plan for the user
        fetch(`http://localhost:8080/api/workout/user/${userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch workout plan');
                }
                return res.json();
            })
            .then(data => {
                console.log("Workout API Response:", data);
                
                // Check if data is an array, if not, try to extract array
                let workoutArray = null;
                if (Array.isArray(data)) {
                    workoutArray = data;
                } else if (data.workouts && Array.isArray(data.workouts)) {
                    workoutArray = data.workouts;
                } else if (data.data && Array.isArray(data.data)) {
                    workoutArray = data.data;
                } else {
                    // If no array found, use sample data for testing
                    console.warn("API didn't return an array, using sample data");
                    workoutArray = getSampleWorkout();
                }
                
                setWorkoutPlan(workoutArray);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching workout:", err);
                setError(err.message);
                // Use sample data for testing
                setWorkoutPlan(getSampleWorkout());
                setIsLoading(false);
            });
    }, [userId]);

    const handleStartWorkout = () => {
        setIsWorkoutStarted(true);
    };

    const handleWorkoutComplete = (stats) => {
        console.log("Workout completed!", stats);
        // Save workout stats to backend
        fetch(`http://localhost:8080/workout/complete/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats)
        }).catch(err => console.error("Error saving stats:", err));
        
        setIsWorkoutStarted(false);
    };

    if (error) {
        return (
            <div className="error-container">
                <h2>⚠️ Error Loading Workout</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="workout-page">
            {!isWorkoutStarted ? (
                <WorkoutCard 
                    startWorkout={handleStartWorkout}
                    workoutPlan={workoutPlan}
                    isLoading={isLoading}
                />
            ) : (
                <WorkoutSession 
                    workout={workoutPlan}
                    onComplete={handleWorkoutComplete}
                    userName="User"
                />
            )}
        </div>
    );
}

// Sample workout data for testing
function getSampleWorkout() {
    return [
        {
            phase: "WARMUP",
            exerciseName: "Jumping Jacks",
            duration: 30,
            restTime: 10,
            caloriesBurned: 20
        },
        {
            phase: "WARMUP",
            exerciseName: "Arm Circles",
            duration: 30,
            restTime: 10,
            caloriesBurned: 15
        },
        {
            phase: "BASIC",
            exerciseName: "Push-ups",
            duration: 45,
            restTime: 15,
            caloriesBurned: 40
        },
        {
            phase: "BASIC",
            exerciseName: "Squats",
            duration: 45,
            restTime: 15,
            caloriesBurned: 35
        },
        {
            phase: "ADVANCED",
            exerciseName: "Burpees",
            duration: 60,
            restTime: 20,
            caloriesBurned: 60
        },
        {
            phase: "ADVANCED",
            exerciseName: "Mountain Climbers",
            duration: 60,
            restTime: 20,
            caloriesBurned: 55
        }
    ];
}

export default WorkoutPage;