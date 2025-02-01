import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Grid, Paper, Box, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { fetch } from 'whatwg-fetch';

const Dashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [userData, setUserData] = useState({
        email: '',
        nom: '',
        prenom: ''
    });
    const [currentDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    
                    if (!decoded.id) {
                        throw new Error('Token invalide');
                    }

                    fetch(`http://localhost:8000/api/users/me`, {
                        headers: {
                            'x-auth-token': token
                        }
                    })
                    .then(res => res.json())
                    .then(user => {
                        setUserData({
                            email: user.email,
                            nom: user.nom,
                            prenom: user.prenom
                        });
                    })
                    .catch(error => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    });
                }
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        const fetchReservations = async () => {
            try {
                const data = await getReservations();
                const currentReservations = data.filter(reservation => {
                    const startDate = new Date(reservation.startDate);
                    const endDate = new Date(reservation.endDate);
                    const now = new Date();
                    return startDate <= now && endDate >= now;
                });
                setReservations(currentReservations);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchReservations();
        fetchUserData();
    }, [navigate]);

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Informations Utilisateur
                            </Typography>
                            <Typography>
                                {userData.nom && userData.prenom ? (
                                    `Nom: ${userData.nom} ${userData.prenom}`
                                ) : (
                                    'Chargement...'
                                )}
                            </Typography>
                            <Typography>
                                {userData.email ? `Email: ${userData.email}` : ''}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Date du jour
                            </Typography>
                            <Typography>
                                {currentDate.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Réservations en cours
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Catway</TableCell>
                                    <TableCell>Date de début</TableCell>
                                    <TableCell>Date de fin</TableCell>
                                    <TableCell>État</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation) => (
                                        <TableRow key={reservation._id}>
                                            <TableCell>
                                                {reservation.catway?.catwayNumber || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(reservation.startDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(reservation.endDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                En cours
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            Aucune réservation en cours
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;
