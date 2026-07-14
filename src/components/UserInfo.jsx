import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

function UserInfo() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState({
        user: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        goal: "",
        dietType: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [calorieStats, setCalorieStats] = useState({ consumed: 0, burned: 0, remaining: 0, target: 2000 });
    const [statsLoading, setStatsLoading] = useState(false);

    const getTargetByDiet = (dietType) => {
        switch (dietType?.toLowerCase()) {
            case 'veg':
                return 2000;
            case 'non-veg':
                return 2200;
            case 'both':
                return 2100;
            default:
                return 2000;
        }
    };

    const fetchUser = useCallback((id) => {
        if (!id) return;
        setIsLoading(true);
        fetch(`http://localhost:8080/user/get/user/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then(data => {
                setUser(data);
                setError("");
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    const fetchCalorieStats = useCallback((id, dietType) => {
        if (!id) return;
        setStatsLoading(true);
        const target = getTargetByDiet(dietType);
        fetch(`http://localhost:8080/calorie/today/${id}`)
            .then(res => res.json())
            .then(data => {
                const burned = data.burned || 0;
                const consumed = target;
                const remaining = consumed - burned;
                setCalorieStats({
                    consumed,
                    burned,
                    remaining: remaining < 0 ? 0 : remaining,
                    target
                });
            })
            .catch(err => console.error("Error fetching calorie stats:", err))
            .finally(() => setStatsLoading(false));
    }, []);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            setUserId(storedId);
            fetchUser(storedId);
        }
    }, [fetchUser]);

    useEffect(() => {
        if (userId && user.dietType) {
            fetchCalorieStats(userId, user.dietType);
        }
    }, [userId, user.dietType, fetchCalorieStats]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            user: user.user,
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            goal: user.goal,
            dietType: user.dietType
        };
        const url = `http://localhost:8080/user/update/user/${userId}`;
        fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update");
                return res.json();
            })
            .then(() => {
                alert("Profile updated successfully! ✅");
                setIsEditing(false);
                fetchUser(userId);
                fetchCalorieStats(userId, user.dietType);
            })
            .catch(err => alert(err.message))
            .finally(() => setIsLoading(false));
    };

    const bmi = user.height && user.weight
        ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
        : null;
    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) return { text: "Underweight", color: "#2196F3", advice: "Eat nutrient-rich foods" };
        if (bmi < 25) return { text: "Normal", color: "#4CAF50", advice: "Great! Maintain balance" };
        if (bmi < 30) return { text: "Overweight", color: "#ff9800", advice: "Focus on cardio & diet" };
        return { text: "Obese", color: "#f44336", advice: "Consult a trainer" };
    };
    const bmiStatus = bmi ? getBMIStatus(bmi) : null;

    return (
        <div className="user-info-modern">
            {/* Header */}
            <div className="info-header">
                <h2>👤 My Profile</h2>
                {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {(isLoading || statsLoading) && <div className="loading-spinner">Loading...</div>}

            {/* Calorie Stats Cards */}
            <div className="stats-dashboard">
                <div className="stat-card">
                    <div className="stat-icon">🍽️</div>
                    <div className="stat-details">
                        <span className="stat-value">{calorieStats.consumed}</span>
                        <span className="stat-label">Daily Intake Goal</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏃</div>
                    <div className="stat-details">
                        <span className="stat-value">{calorieStats.burned}</span>
                        <span className="stat-label">Calories Burned</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-details">
                        <span className="stat-value">{calorieStats.remaining}</span>
                        <span className="stat-label">Remaining</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-details">
                        <span className="stat-value">{calorieStats.target}</span>
                        <span className="stat-label">Daily Target</span>
                    </div>
                </div>
            </div>

            {/* BMI Card */}
            {bmi && (
                <div className="bmi-card-modern">
                    <div className="bmi-header">
                        <span className="bmi-label">📊 Your Body Mass Index (BMI)</span>
                    </div>
                    <div className="bmi-value" style={{ color: bmiStatus.color }}>{bmi}</div>
                    <div className="bmi-status" style={{ color: bmiStatus.color }}>{bmiStatus.text}</div>
                    <div className="bmi-advice">{bmiStatus.advice}</div>
                    <div className="bmi-range-info">
                        <span>Underweight: &lt;18.5</span>
                        <span>Normal: 18.5–24.9</span>
                        <span>Overweight: 25–29.9</span>
                        <span>Obese: ≥30</span>
                    </div>
                </div>
            )}

            {/* Profile Display / Edit Form */}
            {!isEditing ? (
                <div className="profile-display">
                    <div className="info-row"><strong>Name:</strong> {user.user}</div>
                    <div className="info-row"><strong>Age:</strong> {user.age} years</div>
                    <div className="info-row"><strong>Gender:</strong> {user.gender}</div>
                    <div className="info-row"><strong>Height:</strong> {user.height} cm</div>
                    <div className="info-row"><strong>Weight:</strong> {user.weight} kg</div>
                    <div className="info-row"><strong>Goal:</strong> {user.goal}</div>
                    <div className="info-row"><strong>Diet Type:</strong> {user.dietType}</div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-row">
                        <input name="user" placeholder="Full Name" value={user.user} onChange={handleChange} required />
                        <input name="age" type="number" placeholder="Age" value={user.age} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select name="gender" value={user.gender} onChange={handleChange}>
                            <option value="">Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Transgender</option>
                            <option>Other</option>
                        </select>
                        <input name="height" type="number" placeholder="Height (cm)" value={user.height} onChange={handleChange} required />
                        <input name="weight" type="number" placeholder="Weight (kg)" value={user.weight} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select name="goal" value={user.goal} onChange={handleChange}>
                            <option value="">Goal</option>
                            <option>Weight Loss</option>
                            <option>Weight Gain</option>
                            <option>Muscle Gain</option>
                            <option>Stay Fit</option>
                            <option>Increase Stamina</option>
                            <option>Flexibility</option>
                        </select>
                        <select name="dietType" value={user.dietType} onChange={handleChange}>
                            <option value="">Diet Type</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={isLoading}>💾 Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UserInfo;