import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiUrl';
import { toast } from 'react-toastify';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
} from '@mui/material';
import './Login.css'; // Import the new CSS file

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            toast.error('Please enter both username and password', {
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
            const response = await api.post('/login', { username, password });
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
            <Box className="login-box">
                <Typography component="h1" variant="h5" className="welcome-text">
                    Welcome to Stellar AI
                </Typography>
                <Typography variant="body2" className="signin-text">
                    Sign in to continue to your chatbot.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username or Email"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            className: 'login-input',
                        }}
                        InputLabelProps={{
                            className: 'login-label',
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            className: 'login-input',
                        }}
                        InputLabelProps={{
                            className: 'login-label',
                        }}
                    />
                    <Link
                        href="#"
                        variant="body2"
                        className="forgot-password-link"
                    >
                        Forgot Password?
                    </Link>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </Button>
                    <Typography variant="body2" align="center" className="signup-text-container">
                        Don't have an account?{'  '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/signup')}
                            className="signup-link"
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Box>
    );
};

export default Login;