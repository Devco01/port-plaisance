import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import config from '../../config/config';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [currentReservations, setCurrentReservations] = useState([]);

    // Mémoriser la date pour éviter les re-rendus
    const today = useMemo(() => new Date(), []);

    useEffect(() => {
        // Récupérer les réservations en cours
        const fetchCurrentReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                // D'abord, récupérer tous les catways
                const catwaysResponse = await fetch(
                    `${config.apiUrl}/api/catways`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const catways = await catwaysResponse.json();

                // Ensuite, récupérer les réservations pour chaque catway
                const allReservations = [];
                for (const catway of catways) {
                    const response = await fetch(
                        `${config.apiUrl}/api/catways/${catway.catwayNumber}/reservations`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    const reservations = await response.json();
                    // Ajouter le numéro du catway à chaque réservation
                    reservations.forEach(res => {
                        res.catwayNumber = catway.catwayNumber;
                    });
                    allReservations.push(...reservations);
                }

                // Filtrer pour n'avoir que les réservations en cours
                const now = new Date();
                const currentReservations = allReservations.filter(res => {
                    const endDate = new Date(res.endDate);
                    // Une réservation est en cours si elle n'est pas terminée
                    return endDate >= now;
                });

                setCurrentReservations(currentReservations);
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des réservations:',
                    error
                );
            }
        };

        // Récupérer les infos de l'utilisateur connecté
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            setUser(decoded.user);
        };

        fetchUserInfo();
        fetchCurrentReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Retirer today des dépendances

    const formatDate = date => {
        return format(new Date(date), 'dd/MM/yyyy');
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Tableau de bord
                </Typography>

                <Grid container spacing={3} mb={4}>
                    {/* Carte Date */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Date</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {format(today, 'EEEE dd MMMM yyyy', {
                                        locale: fr
                                    })}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Carte Utilisateur */}
                    {user && (
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Informations utilisateur
                                    </Typography>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <PersonIcon sx={{ mr: 1 }} />
                                        <Typography>{user.username}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <EmailIcon sx={{ mr: 1 }} />
                                        <Typography>{user.email}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Réservations en cours
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Catway</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Bateau</TableCell>
                                    <TableCell>Date début</TableCell>
                                    <TableCell>Date fin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentReservations.length > 0 ? (
                                    currentReservations.map(reservation => (
                                        <TableRow key={reservation._id}>
                                            <TableCell>
                                                {reservation.catwayNumber}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.clientName}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.boatName}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    reservation.startDate
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    reservation.endDate
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
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
