import React, { useState } from "react";
import { useParams } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutSession from "../components/WorkoutSession";

function WorkoutPage() {
    const { userId } = useParams();

    const [workout, setWorkout] = useState([]);
    const [start, setStart] = useState(false);

    const startWorkout = () => {
        fetch(`http://localhost:8080/api/workout/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setWorkout(data);
                setStart(true);
            });
    };

    return (
        <div>
            {!start ? (
                <WorkoutCard startWorkout={startWorkout} />
            ) : (
                <WorkoutSession workout={workout} />
            )}
        </div>
    );
}

export default WorkoutPage;