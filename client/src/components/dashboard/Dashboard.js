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

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    
    // Mémoriser la date pour éviter les re-rendus
    const today = useMemo(() => new Date(), []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                }
            } catch (error) {
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    // Filtrer pour n'avoir que les réservations en cours
                    const currentReservations = data.filter(reservation => {
                        const startDate = new Date(reservation.startDate);
                        const endDate = new Date(reservation.endDate);
                        return startDate <= today && endDate >= today;
                    });
                    setReservations(currentReservations);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
            }
        };

        fetchUserInfo();
        fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Retirer today des dépendances

    const formatDate = (date) => {
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
                                    {format(today, 'EEEE dd MMMM yyyy', { locale: fr })}
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
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <PersonIcon sx={{ mr: 1 }} />
                                        <Typography>
                                            {user.nom} {user.prenom}
                                        </Typography>
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
                                {reservations.length > 0 ? (
                                    reservations.map((reservation) => (
                                        <TableRow key={reservation._id}>
                                            <TableCell>{reservation.catwayNumber}</TableCell>
                                            <TableCell>{reservation.clientName}</TableCell>
                                            <TableCell>{reservation.boatName}</TableCell>
                                            <TableCell>{formatDate(reservation.startDate)}</TableCell>
                                            <TableCell>{formatDate(reservation.endDate)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
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
