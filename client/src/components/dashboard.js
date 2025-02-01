import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { getReservations } from '../services/api';
import CatwayList from './catwaylist';

const Dashboard = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getReservations();
                setReservations(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
            }
        };

        fetchReservations();
    }, []);

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Tableau de Bord
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Mes Réservations
                        </Typography>
                        {reservations.map((reservation) => (
                            <Box key={reservation._id} sx={{ mb: 2 }}>
                                <Typography>
                                    Catway: {reservation.catway?.catwayNumber}
                                </Typography>
                                <Typography>
                                    Du: {new Date(reservation.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography>
                                    Au: {new Date(reservation.endDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <CatwayList />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
