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
        <Box className="auth-shell">
            <Box className="auth-card">
                <Typography className="brand-badge" component="span">
                    ChatSphere
                </Typography>
                <Typography component="h1" variant="h4" className="welcome-text">
                    Welcome back, explorer
                </Typography>
                <Typography variant="body2" className="signin-text">
                    Sign in to pick up the conversation where you left off.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
                    {error && (
                        <Typography align="center" className="error-text">
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
                            className: 'auth-input',
                        }}
                        InputLabelProps={{
                            className: 'auth-label',
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
                            className: 'auth-input',
                        }}
                        InputLabelProps={{
                            className: 'auth-label',
                        }}
                    />
                    <Box className="auth-links">
                        <Link
                            href="#"
                            variant="body2"
                            className="muted-link"
                        >
                            Forgot password?
                        </Link>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="auth-button"
                    >
                        Log in
                    </Button>
                    <Typography variant="body2" align="center" className="switch-auth-text">
                        Don't have an account?
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/signup')}
                            className="accent-link"
                        >
                            Create one
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;