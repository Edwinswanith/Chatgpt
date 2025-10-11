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
import './Signup.css'; // Import the new CSS file

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            toast.error('Please fill in all fields', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (password.length < 6) {
            toast.warning('Password should be at least 6 characters', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/register', { username, password });
            if (response.status === 201) {
                toast.success('Registration successful! Redirecting to login... ✨', {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed. Please try again.', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
            <Box className="signup-box">
                <Typography component="h1" variant="h5" className="create-account-text">
                    Join Stellar AI
                </Typography>
                <Typography variant="body2" className="signup-instruction-text">
                    Sign up to get started with your chatbot.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate className="signup-form">
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
                            className: 'signup-input',
                        }}
                        InputLabelProps={{
                            className: 'signup-label',
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
                            className: 'signup-input',
                        }}
                        InputLabelProps={{
                            className: 'signup-label',
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
                            className: 'signup-input',
                        }}
                        InputLabelProps={{
                            className: 'signup-label',
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                Creating account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                    <Typography variant="body2" align="center" className="login-link-container">
                        Already have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/login')}
                            className="login-link"
                        >
                            Log In
                        </Link>
                    </Typography>
                </Box>
            </Box>
    );
};

export default Signup;