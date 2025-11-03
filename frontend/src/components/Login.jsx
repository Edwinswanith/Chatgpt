import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiUrl';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please enter both email and password', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/login', { username: email, password });
            if (response.status === 200) {
                toast.success(`Welcome back, ${response.data.username}! 🎉`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onLogin(response.data.username);
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed. Please try again.', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="logo-container">
                        <svg className="robot-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="6" width="14" height="12" rx="2" fill="currentColor"/>
                            <rect x="7" y="4" width="10" height="2" rx="1" fill="currentColor"/>
                            <circle cx="10" cy="11" r="1.5" className="robot-eye"/>
                            <circle cx="14" cy="11" r="1.5" className="robot-eye"/>
                            <rect x="9" y="15" width="6" height="1" rx="0.5" className="robot-mouth"/>
                        </svg>
                        <span className="logo-text">AI Dashboard</span>
                    </div>
                    <h1 className="login-title">Welcome to Your AI Dashboard</h1>
                    <p className="login-subtitle">Please authenticate to access your enterprise services.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <div className="password-header">
                            <label htmlFor="password" className="form-label">Password</label>
                            <a href="#" className="forgot-password-link">Forgot Password?</a>
                        </div>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {showPassword ? (
                                        <>
                                            <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.82L19.56 16.74C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.37C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.73 7C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.09L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.98 12.16L14.96 12.18C14.96 12.18 14.95 12.18 14.95 12.18L11.84 9.02Z" fill="currentColor"/>
                                        </>
                                    ) : (
                                        <>
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <p className="signup-text">
                        Need an account? <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;