import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ 
                    flexGrow: 1,
                    textDecoration: 'none',
                    color: 'inherit'
                }}>
                    Port de Plaisance
                </Typography>

                {token ? (
                    <Box>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/dashboard"
                        >
                            Dashboard
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/catways"
                        >
                            Catways
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/reservations"
                        >
                            Réservations
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/users"
                        >
                            Utilisateurs
                        </Button>
                        <Button 
                            color="inherit"
                            onClick={handleLogout}
                        >
                            Déconnexion
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/login"
                        >
                            Connexion
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/register"
                        >
                            Inscription
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 