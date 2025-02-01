import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Login from './login';

const Home = () => {
    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    Port de Plaisance
                </Typography>
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Bienvenue sur notre application de gestion portuaire
                    </Typography>
                    <Typography paragraph>
                        Notre application vous permet de gérer facilement vos réservations de catways dans le port de plaisance.
                        Vous pouvez consulter les disponibilités, effectuer des réservations et gérer vos emplacements en quelques clics.
                    </Typography>
                    <Typography paragraph>
                        Fonctionnalités principales :
                    </Typography>
                    <ul>
                        <Typography component="li">Réservation de catways</Typography>
                        <Typography component="li">Gestion des emplacements</Typography>
                        <Typography component="li">Suivi des réservations</Typography>
                        <Typography component="li">Interface d'administration</Typography>
                    </ul>
                </Paper>

                <Box sx={{ mb: 4 }}>
                    <Button
                        component="a"
                        href="/api-docs"
                        target="_blank"
                        variant="contained"
                        color="secondary"
                        sx={{ mr: 2 }}
                    >
                        Documentation API
                    </Button>
                </Box>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Connexion
                    </Typography>
                    <Login />
                </Paper>
            </Box>
        </Container>
    );
};

export default Home; 