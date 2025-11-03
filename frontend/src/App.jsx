import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
const LazyChatbot = React.lazy(() => import('./components/Chatbot'));
import Loader from './components/Loader';
import Login from './components/Login'; // Import Login component
import Signup from './components/Signup'; // Import Signup component
import api from './api/apiUrl'; // Import api to check login status

function App() {
    const [user, setUser] = useState(null); // User state
    const [themeMode, setThemeMode] = useState(() => {
        if (typeof window === 'undefined') {
            return 'light';
        }
        return localStorage.getItem('stellar_theme') || 'light';
    });
    const navigate = useNavigate();

    useEffect(() => {
<<<<<<< HEAD
        // Check for user in localStorage on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
=======
        // Check for user in localStorage and validate session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // Validate session with backend
            api.get('/check_session')
                .then(response => {
                    if (response.data.authenticated) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Session expired, clear localStorage
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                })
                .catch(error => {
                    // Session invalid or server error, clear localStorage
                    console.error('Session validation failed:', error);
                    localStorage.removeItem('user');
                    setUser(null);
                });
>>>>>>> 182dae9 (Update)
        }
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', themeMode);
        }
        localStorage.setItem('stellar_theme', themeMode);
    }, [themeMode]);

    const toggleTheme = useCallback(() => {
        setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const handleLogin = (username) => {
        setUser({ username });
        localStorage.setItem('user', JSON.stringify({ username }));
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="font-display min-h-screen" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={themeMode === 'dark' ? 'dark' : 'light'}
                style={{ zIndex: 9999 }}
            />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <LazyChatbot
                                    user={user}
                                    onLogout={handleLogout}
                                    themeMode={themeMode}
                                    onToggleTheme={toggleTheme}
                                />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
