import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if (token) {
        navigate('/dashboard');
        return null;
    }

    return (
        <Container>
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Port de Plaisance de Russell
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Bienvenue sur l'application de gestion des réservations
                </Typography>
            </Box>

            <Paper sx={{ p: 4 }}>
                <Login />
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                    Pas encore de compte ?
                </Typography>
                <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained" 
                    color="secondary"
                >
                    S'inscrire
                </Button>
            </Box>
        </Container>
    );
};

export default Home; 