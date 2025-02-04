import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getReservations, deleteReservation } from '../../../services/api';
import Navbar from '../../Navbar';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            const data = await getReservations();
            setReservations(data);
        } catch (error) {
            console.error('Erreur chargement réservations:', error);
        }
    };

    const handleDelete = async (id, catwayId) => {
        if (
            window.confirm(
                'Êtes-vous sûr de vouloir supprimer cette réservation ?'
            )
        ) {
            try {
                await deleteReservation(id, catwayId);
                loadReservations();
            } catch (error) {
                console.error('Erreur suppression réservation:', error);
            }
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Gestion des Réservations
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/reservations/new"
                        sx={{ mb: 2 }}
                    >
                        Nouvelle Réservation
                    </Button>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Catway</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Bateau</TableCell>
                                    <TableCell>Début</TableCell>
                                    <TableCell>Fin</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map(reservation => (
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
                                            {format(
                                                new Date(reservation.startDate),
                                                'dd/MM/yyyy',
                                                { locale: fr }
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(reservation.endDate),
                                                'dd/MM/yyyy',
                                                { locale: fr }
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                href={`/reservations/${reservation._id}/edit`}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(
                                                        reservation._id,
                                                        reservation.catwayNumber
                                                    )
                                                }
                                            >
                                                Supprimer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default ReservationList;
