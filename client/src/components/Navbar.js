import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!token) return null;  // Ne pas afficher la navbar si non connecté

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Port de Plaisance
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/dashboard">
                        Tableau de bord
                    </Button>
                    <Button color="inherit" component={Link} to="/catways">
                        Catways
                    </Button>
                    <Button color="inherit" component={Link} to="/reservations">
                        Réservations
                    </Button>
                    <Button color="inherit" component={Link} to="/users">
                        Utilisateurs
                    </Button>
                    <Button 
                        color="inherit" 
                        href="http://localhost:8000/api-docs/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        API Docs
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 