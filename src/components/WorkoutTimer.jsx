// import { useEffect, useState } from "react";

// function WorkoutTimer({duration , onComplete}) {
//     const [time , setTime] = useState(duration);

//     useEffect(()=>{
//         setTime(duration);
//     } , [duration]) ;

//     useEffect(()=>{
//         if(time === 0) {
//             onComplete();
//             return ;
//         }

//         const timer = setTimeout(()=>{
//             setTime(time - 1);
//         },1000) ;

//         return ()=> clearTimeout(timer) ;
//     },[time, onComplete] ) ;

//     return <h2>⏱ {time} sec</h2>;

// }

// export default WorkoutTimer;

import { useEffect, useState } from "react";
import '../styles/workout.css';

function WorkoutTimer({ duration, onComplete }) {
    const [time, setTime] = useState(duration);
    const [isActive, setIsActive] = useState(true);

    // Reset timer when duration changes
    useEffect(() => {
        setTime(duration);
        setIsActive(true);
    }, [duration]);

    // Handle timer countdown
    useEffect(() => {
        if (!isActive) return;
        
        if (time > 0) {
            const timer = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (time === 0 && isActive) {
            // Timer complete!
            setIsActive(false);
            onComplete(); // Move to next exercise or rest
        }
    }, [time, isActive, onComplete]);

    // Calculate timer percentage for visual feedback
    const percentage = (time / duration) * 100;
    
    // Change color based on remaining time
    const timerColor = percentage > 50 ? "#4CAF50" : percentage > 20 ? "#ff9800" : "#f44336";

    return (
        <div className="workout-timer">
            <div className="timer-circle" style={{ 
                background: `conic-gradient(${timerColor} ${percentage * 3.6}deg, #e0e0e0 0deg)`
            }}>
                <div className="timer-inner">
                    <span className="timer-value">{time}</span>
                    <span className="timer-unit">sec</span>
                </div>
            </div>
            <div className="timer-label">
                {time === 0 ? "Complete! ✓" : time <= 3 ? "Get ready!" : "Time remaining"}
            </div>
        </div>
    );
}

export default WorkoutTimer;