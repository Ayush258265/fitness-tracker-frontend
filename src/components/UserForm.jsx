// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/user.css";

// function UserForm() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         age: "",
//         height: "",
//         weight: "",
//         gender: "",
//         dietType: "",
//         goal: "",
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const payload = {
//             user: formData.name,
//             age: Number(formData.age),
//             height: Number(formData.height),
//             weight: Number(formData.weight),
//             gender: formData.gender,
//             dietType: formData.dietType,
//             goal: formData.goal,
//         };

//         console.log("Sending payload:", payload);

//         try {
//             const response = await fetch("http://localhost:8080/user/create/user", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 localStorage.setItem("userId", data.id);
//                 console.log("User ID stored:", data.id);
//                 alert("Profile saved successfully! ✅");
//                 navigate("/dashboard");
//             } else {
//                 alert("Error: " + data.message);
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Error saving profile ❌");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="form-container">
//             <div className="form-card">
//                 <div className="form-header">
//                     <h2>🏋️ Complete Your Profile</h2>
//                     <p>Tell us about yourself to personalize your fitness journey</p>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label>Full Name *</label>
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Enter your name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Age *</label>
//                             <input
//                                 type="number"
//                                 name="age"
//                                 placeholder="Age"
//                                 value={formData.age}
//                                 onChange={handleChange}
//                                 required
//                                 min="5"
//                                 max="100"
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label>Height (cm) *</label>
//                             <input
//                                 type="number"
//                                 name="height"
//                                 placeholder="Height in cm"
//                                 value={formData.height}
//                                 onChange={handleChange}
//                                 required
//                                 min="50"
//                                 max="250"
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label>Weight (kg) *</label>
//                             <input
//                                 type="number"
//                                 name="weight"
//                                 placeholder="Weight in kg"
//                                 value={formData.weight}
//                                 onChange={handleChange}
//                                 required
//                                 min="10"
//                                 max="300"
//                             />
//                         </div>
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Gender *</label>
//                             <select name="gender" value={formData.gender} onChange={handleChange} required>
//                                 <option value="">Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Transgender">Transgender</option>
//                                 {/* <option value="Other">Other</option> */}
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label>Diet Type *</label>
//                             <select name="dietType" value={formData.dietType} onChange={handleChange} required>
//                                 <option value="">Select Diet Type</option>
//                                 <option value="Vegetarian">Vegetarian</option>
//                                 <option value="Non-Vegetarian">Non-Vegetarian</option>
//                                 <option value="Vegan">Vegan</option>
//                                 {/* <option value="Keto">Keto</option>
//                                 <option value="Paleo">Paleo</option>
//                                 <option value="Intermittent Fasting">Intermittent Fasting</option> */}
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label>Fitness Goal *</label>
//                             <select name="goal" value={formData.goal} onChange={handleChange} required>
//                                 <option value="">Select Goal</option>
//                                 <option value="Weight Loss">Weight Loss</option>
//                                 <option value="Weight Gain">Weight Gain</option>
//                                 <option value="Muscle Gain">Muscle Gain</option>
//                                 <option value="Stay Fit">Stay Fit</option>
//                                 <option value="Increase Stamina">Increase Stamina</option>
//                                 <option value="Flexibility">Flexibility</option>
//                             </select>
//                         </div>
//                     </div>

//                     <button type="submit" className="submit-btn" disabled={isLoading}>
//                         {isLoading ? "Saving..." : "Start My Journey →"}
//                     </button>
//                 </form>

//                 <div className="form-footer">
//                     <p>Already have a profile? <span onClick={() => navigate("/users")}>Select User</span></p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default UserForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../styles/user.css";

function UserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        height: "",
        weight: "",
        gender: "",
        dietType: "",
        goal: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setIsUpdating(true);
            fetch(`${API_BASE_URL}/user/get/user/${userId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.user || "",
                        age: data.age || "",
                        height: data.height || "",
                        weight: data.weight || "",
                        gender: data.gender || "",
                        dietType: data.dietType || "",
                        goal: data.goal || "",
                    });
                })
                .catch(err => console.error("Error fetching user:", err));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            user: formData.name,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight),
            gender: formData.gender,
            dietType: formData.dietType,
            goal: formData.goal,
        };

        const userId = localStorage.getItem("userId");
        const isUpdating = userId && userId !== "null";

        const url = isUpdating 
            ? `${API_BASE_URL}/user/update/user/${userId}`
            : `${API_BASE_URL}/user/create/user`;
        const method = isUpdating ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (!isUpdating) {
                    localStorage.setItem("userId", data.id);
                }
                alert(isUpdating ? "Profile updated successfully! ✅" : "Profile saved successfully! ✅");
                navigate("/dashboard");
            } else {
                alert("Error: " + (data.message || "Something went wrong"));
            }
        } catch (error) {
            console.error(error);
            alert("Error saving profile ❌");
        } finally {
            setIsLoading(false);
        }
    };

    const isEditing = localStorage.getItem("userId") && localStorage.getItem("userId") !== "null";

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <h2>{isEditing ? "✏️ Update Your Profile" : "🏋️ Complete Your Profile"}</h2>
                    <p>Tell us about yourself to personalize your fitness journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Age *</label>
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="5"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Height (cm) *</label>
                            <input
                                type="number"
                                name="height"
                                placeholder="Height in cm"
                                value={formData.height}
                                onChange={handleChange}
                                required
                                min="50"
                                max="250"
                            />
                        </div>

                        <div className="form-group">
                            <label>Weight (kg) *</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="Weight in kg"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                min="10"
                                max="300"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Transgender">Transgender</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Diet Type *</label>
                            <select name="dietType" value={formData.dietType} onChange={handleChange} required>
                                <option value="">Select Diet Type</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fitness Goal *</label>
                            <select name="goal" value={formData.goal} onChange={handleChange} required>
                                <option value="">Select Goal</option>
                                <option value="Weight Loss">Weight Loss</option>
                                <option value="Weight Gain">Weight Gain</option>
                                <option value="Muscle Gain">Muscle Gain</option>
                                <option value="Stay Fit">Stay Fit</option>
                                <option value="Increase Stamina">Increase Stamina</option>
                                <option value="Flexibility">Flexibility</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? "Saving..." : (isEditing ? "Update Profile" : "Save Details")}
                    </button>
                </form>

                <div className="form-footer">
                    <p>Already have a profile? <span onClick={() => navigate("/users")}>Select User</span></p>
                </div>
            </div>
        </div>
    );
}

export default UserForm;