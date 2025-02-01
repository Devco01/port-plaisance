import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import Home from './components/Home';
import CatwaysCRUD from './components/crud/CatwaysCRUD';
import ReservationsCRUD from './components/crud/ReservationsCRUD';
import UsersCRUD from './components/crud/UsersCRUD';

// Création du thème
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// Composant de protection des routes
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/catways" element={
                        <PrivateRoute>
                            <CatwaysCRUD />
                        </PrivateRoute>
                    } />
                    <Route path="/reservations" element={
                        <PrivateRoute>
                            <ReservationsCRUD />
                        </PrivateRoute>
                    } />
                    <Route path="/users" element={
                        <PrivateRoute>
                            <UsersCRUD />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
