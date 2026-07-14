import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isLogin) {
            // LOGIN
            try {
                const response = await fetch("http://localhost:8080/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const contentType = response.headers.get("content-type");
                let data;
                
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                
                if (response.ok) {
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("userEmail", data.email);
                    localStorage.setItem("userName", data.name);
                    navigate("/dashboard");
                } else {
                    setError(typeof data === 'string' ? data : (data.message || "Invalid email or password"));
                }
            } catch (err) {
                console.error("Login error:", err);
                setError("Login failed. Please try again.");
            }
        } else {
            // SIGNUP
            try {
                const response = await fetch("http://localhost:8080/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        user: name,
                        email: email,
                        password: password,
                        age: 25,
                        gender: "Male",
                        height: 170,
                        weight: 70,
                        goal: "FIT",
                        dietType: "VEG"
                    })
                });

                const contentType = response.headers.get("content-type");
                let data;
                
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                
                if (response.ok) {
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("userEmail", data.email);
                    localStorage.setItem("userName", data.user);
                    
                    alert("Account created successfully! Please complete your profile.");
                    navigate("/user-form");
                } else {
                    setError(typeof data === 'string' ? data : (data.message || "Signup failed"));
                }
            } catch (err) {
                console.error("Signup error:", err);
                setError("Signup failed. Please try again.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>💪 Fitness App</h1>
                    <p>{isLogin ? "Welcome back!" : "Create your account"}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Loading..." : (isLogin ? "Login" : "Sign Up")}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}>
                            {isLogin ? "Sign Up" : "Login"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;