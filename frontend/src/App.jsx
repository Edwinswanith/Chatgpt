import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
const LazyChatbot = React.lazy(() => import('./components/Chatbot'));
import Loader from './components/Loader';
import Login from './components/Login'; // Import Login component
import Signup from './components/Signup'; // Import Signup component
import api from './api/apiUrl'; // Import api to check login status
import './App.css';

function App() {
    const [user, setUser] = useState(null); // User state
    const navigate = useNavigate();

    useEffect(() => {
        // Check for user in localStorage on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
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
        <div className="app-shell">
            <div className="app-backdrop app-backdrop--primary" aria-hidden="true" />
            <div className="app-backdrop app-backdrop--secondary" aria-hidden="true" />
            <div className="app-content">
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route
                            path="/"
                            element={user ? <LazyChatbot user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
                        />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}

export default App;
