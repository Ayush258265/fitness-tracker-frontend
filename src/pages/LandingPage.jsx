import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

function LandingPage() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("userId");

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Transform Your Life Through <span className="highlight">Fitness</span>
                    </h1>
                    <p className="hero-description">
                        Join thousands of people who have changed their lives with our personalized fitness plans,
                        expert guidance, and supportive community.
                    </p>
                    <div className="hero-buttons">
                        {!isLoggedIn ? (
                            <button className="btn-primary-large" onClick={() => navigate("/login")}>
                                Get Started Free →
                            </button>
                        ) : (
                            <button className="btn-primary-large" onClick={() => navigate("/dashboard")}>
                                Go to Dashboard →
                            </button>
                        )}
                        <button className="btn-secondary-large" onClick={() => {
                            document.getElementById("why-exercise").scrollIntoView({ behavior: "smooth" });
                        }}>
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-stats">
                        <div className="stat-bubble">💪</div>
                        <div className="stat-bubble">🏃</div>
                        <div className="stat-bubble">🧘</div>
                    </div>
                </div>
            </div>

            {/* Why Exercise Section */}
            <div id="why-exercise" className="why-exercise-section">
                <h2 className="section-title">Why Should You <span className="highlight">Exercise?</span></h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">❤️</div>
                        <h3>Better Heart Health</h3>
                        <p>Regular exercise strengthens your heart, improves blood circulation, and reduces risk of heart disease by up to 35%.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🧠</div>
                        <h3>Mental Wellness</h3>
                        <p>Exercise releases endorphins, reducing stress, anxiety, and depression while boosting self-esteem and cognitive function.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">⚡</div>
                        <h3>More Energy</h3>
                        <p>Physical activity delivers oxygen and nutrients to your tissues, helping your cardiovascular system work more efficiently.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">😴</div>
                        <h3>Better Sleep</h3>
                        <p>Regular physical activity helps you fall asleep faster, deepens your sleep, and improves sleep quality.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">💪</div>
                        <h3>Stronger Body</h3>
                        <p>Build muscle strength, improve bone density, and enhance flexibility for better overall physical performance.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🎯</div>
                        <h3>Weight Management</h3>
                        <p>Exercise helps control weight by burning calories and boosting metabolism naturally.</p>
                    </div>
                </div>
            </div>

            {/* What We Offer Section */}
            <div className="features-section">
                <h2 className="section-title">What <span className="highlight">We Offer</span> Today</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Personal Dashboard</h3>
                        <p>Track your fitness journey with personalized stats, BMI calculator, and progress monitoring.</p>
                        <div className="feature-status available">✅ Available Now</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Daily Tasks</h3>
                        <p>Get personalized workout plans, meal suggestions, and daily goals tailored to your needs.</p>
                        <div className="feature-status available">✅ Available Now</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💪</div>
                        <h3>Workout Sessions</h3>
                        <p>Follow guided workout sessions with timers, rest periods, and exercise tracking.</p>
                        <div className="feature-status available">✅ Available Now</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👤</div>
                        <h3>User Profiles</h3>
                        <p>Create and manage multiple user profiles with custom fitness goals and preferences.</p>
                        <div className="feature-status available">✅ Available Now</div>
                    </div>
                </div>
            </div>

            {/* Future Features Section */}
            <div className="future-section">
                <h2 className="section-title">Coming <span className="highlight">Soon</span> 🚀</h2>
                <div className="future-grid">
                    <div className="future-card">
                        <div className="future-icon">📱</div>
                        <h3>Mobile App</h3>
                        <p>Take your fitness journey anywhere with our upcoming mobile application.</p>
                        <div className="eta">ETA: Q3 2026</div>
                    </div>
                    <div className="future-card">
                        <div className="future-icon">🤖</div>
                        <h3>AI Coach</h3>
                        <p>Get personalized workout recommendations and form corrections using AI technology.</p>
                        <div className="eta">ETA: Q4 2026</div>
                    </div>
                    <div className="future-card">
                        <div className="future-icon">👥</div>
                        <h3>Social Features</h3>
                        <p>Connect with friends, share achievements, and join fitness challenges together.</p>
                        <div className="eta">ETA: Q1 2027</div>
                    </div>
                    <div className="future-card">
                        <div className="future-icon">📊</div>
                        <h3>Advanced Analytics</h3>
                        <p>Detailed insights into your progress with charts, trends, and performance metrics.</p>
                        <div className="eta">ETA: Q2 2027</div>
                    </div>
                    <div className="future-card">
                        <div className="future-icon">🎮</div>
                        <h3>Gamification</h3>
                        <p>Earn badges, complete achievements, and level up your fitness journey.</p>
                        <div className="eta">ETA: Q3 2027</div>
                    </div>
                    <div className="future-card">
                        <div className="future-icon">🍎</div>
                        <h3>Meal Planning</h3>
                        <p>Personalized meal plans with recipes, grocery lists, and nutrition tracking.</p>
                        <div className="eta">ETA: Q4 2027</div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Your Fitness Journey?</h2>
                    <p>Join our community today and take the first step towards a healthier, happier you!</p>
                    {!isLoggedIn ? (
                        <button className="btn-cta" onClick={() => navigate("/login")}>
                            Create Free Account →
                        </button>
                    ) : (
                        <button className="btn-cta" onClick={() => navigate("/dashboard")}>
                            Go to Dashboard →
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>💪 Fitness App</h3>
                        <p>Your journey to a healthier life starts here.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#why-exercise">Why Exercise</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#future">Coming Soon</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <span>📘</span>
                            <span>📷</span>
                            <span>🐦</span>
                            <span>🎵</span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Fitness App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;