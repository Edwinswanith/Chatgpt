import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiUrl';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import './Login.css'; // Import the new CSS file

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { username, password });
            if (response.status === 200) {
                onLogin(response.data.username); // Pass username to parent component
                navigate('/'); // Redirect to chat page
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
            <Box className="login-box">
                <Typography component="h1" variant="h5" className="welcome-text">
                    Welcome Back
                </Typography>
                <Typography variant="body2" className="signin-text">
                    Sign in to continue to your chatbot.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
                    {error && (
                        <Typography color="error" align="center" className="error-text">
                            {error}
                        </Typography>
                    )}
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
                    >
                        Log In
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