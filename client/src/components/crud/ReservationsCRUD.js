import config from '../../config/config';
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';

const ReservationsCRUD = () => {
    const [reservations, setReservations] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReservation, setCurrentReservation] = useState({
        catwayId: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.apiUrl}/api/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Réservations récupérées:', data);
            setReservations(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
    };

    const handleOpen = (reservation = null) => {
        if (reservation) {
            setCurrentReservation({
                ...reservation,
                startDate: reservation.startDate.split('T')[0],
                endDate: reservation.endDate.split('T')[0]
            });
            setEditMode(true);
        } else {
            setCurrentReservation({
                catwayId: '',
                startDate: '',
                endDate: ''
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentReservation({
            catwayId: '',
            startDate: '',
            endDate: ''
        });
        setEditMode(false);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                const response = await fetch(`${config.apiUrl}/api/reservations/${currentReservation._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(currentReservation)
                });
                if (!response.ok) throw new Error('Erreur lors de la mise à jour');
            } else {
                const response = await fetch(`${config.apiUrl}/api/reservations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(currentReservation)
                });
                if (!response.ok) throw new Error('Erreur lors de la création');
            }
            fetchReservations();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.apiUrl}/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erreur lors de la suppression');
                fetchReservations();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression: ' + error.message);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Gestion des Réservations
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Ajouter une Réservation
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Catway</TableCell>
                            <TableCell>Date de début</TableCell>
                            <TableCell>Date de fin</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{reservation.catway?.catwayNumber}</TableCell>
                                <TableCell>
                                    {new Date(reservation.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(reservation.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleOpen(reservation)}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(reservation._id)}
                                        color="error"
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editMode ? 'Modifier la Réservation' : 'Ajouter une Réservation'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="ID du Catway"
                        fullWidth
                        value={currentReservation.catwayId}
                        onChange={(e) => setCurrentReservation({
                            ...currentReservation,
                            catwayId: e.target.value
                        })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date de début"
                        type="date"
                        fullWidth
                        value={currentReservation.startDate}
                        onChange={(e) => setCurrentReservation({
                            ...currentReservation,
                            startDate: e.target.value
                        })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date de fin"
                        type="date"
                        fullWidth
                        value={currentReservation.endDate}
                        onChange={(e) => setCurrentReservation({
                            ...currentReservation,
                            endDate: e.target.value
                        })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ReservationsCRUD; 