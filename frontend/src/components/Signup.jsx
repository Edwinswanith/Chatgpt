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
import './Signup.css'; // Import the new CSS file

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/register', { username, password });
            if (response.status === 201) {
                setSuccess('Registration successful! Please log in.');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <Box className="auth-shell">
            <Box className="auth-card">
                <Typography className="brand-badge" component="span">
                    Join ChatSphere
                </Typography>
                <Typography component="h1" variant="h4" className="create-account-text">
                    Craft your intelligent workspace
                </Typography>
                <Typography variant="body2" className="signup-instruction-text">
                    Create an account to synchronize insights across every conversation.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
                    {error && (
                        <Typography align="center" className="error-text">
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography align="center" className="success-text">
                            {success}
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        name="confirm-password"
                        label="Confirm Password"
                        type="password"
                        id="confirm-password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            className: 'auth-input',
                        }}
                        InputLabelProps={{
                            className: 'auth-label',
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="auth-button"
                    >
                        Sign up
                    </Button>
                    <Typography variant="body2" align="center" className="switch-auth-text">
                        Already part of the community?
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/login')}
                            className="accent-link"
                        >
                            Log in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Signup;