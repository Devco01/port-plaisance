import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReservationsCRUD = () => {
    const [reservations, setReservations] = useState([]);
    const [catways, setCatways] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [formData, setFormData] = useState({
        catwayNumber: '',
        clientName: '',
        boatName: '',
        startDate: null,
        endDate: null
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    const showSnackbar = useCallback((message, severity) => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const fetchReservations = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/reservations', {
                headers: {
                    'x-auth-token': token
                }
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des réservations', 'error');
        }
    }, [navigate, showSnackbar]);

    const fetchCatways = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/catways', {
                headers: {
                    'x-auth-token': token
                }
            });
            const data = await response.json();
            setCatways(data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des catways', 'error');
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchReservations();
        fetchCatways();
    }, [fetchReservations, fetchCatways]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingReservation 
                ? `http://localhost:8000/api/reservations/${editingReservation._id}`
                : 'http://localhost:8000/api/reservations';
            const method = editingReservation ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            await response.json();
            setOpenDialog(false);
            fetchReservations();
            showSnackbar(
                `Réservation ${editingReservation ? 'modifiée' : 'créée'} avec succès`,
                'success'
            );
        } catch (error) {
            showSnackbar('Erreur lors de l\'opération', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                fetchReservations();
                showSnackbar('Réservation supprimée avec succès', 'success');
            } catch (error) {
                showSnackbar('Erreur lors de la suppression', 'error');
            }
        }
    };

    const handleEdit = (reservation) => {
        setEditingReservation(reservation);
        setFormData({
            catwayNumber: reservation.catwayNumber,
            clientName: reservation.clientName,
            boatName: reservation.boatName,
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate)
        });
        setOpenDialog(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Gestion des Réservations
            </Typography>
            
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setEditingReservation(null);
                    setFormData({
                        catwayNumber: '',
                        clientName: '',
                        boatName: '',
                        startDate: null,
                        endDate: null
                    });
                    setOpenDialog(true);
                }}
                sx={{ mb: 2 }}
            >
                Nouvelle Réservation
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Catway</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Bateau</TableCell>
                            <TableCell>Date de début</TableCell>
                            <TableCell>Date de fin</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{reservation.catwayNumber}</TableCell>
                                <TableCell>{reservation.clientName}</TableCell>
                                <TableCell>{reservation.boatName}</TableCell>
                                <TableCell>
                                    {new Date(reservation.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(reservation.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        onClick={() => handleEdit(reservation)}
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {editingReservation ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Select
                            fullWidth
                            value={formData.catwayNumber}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayNumber: e.target.value
                            })}
                            margin="normal"
                            required
                            sx={{ mt: 2 }}
                        >
                            {catways.map((catway) => (
                                <MenuItem key={catway._id} value={catway.catwayNumber}>
                                    Catway {catway.catwayNumber} ({catway.catwayType})
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            fullWidth
                            label="Nom du client"
                            value={formData.clientName}
                            onChange={(e) => setFormData({
                                ...formData,
                                clientName: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nom du bateau"
                            value={formData.boatName}
                            onChange={(e) => setFormData({
                                ...formData,
                                boatName: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Date de début"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({
                                ...formData,
                                startDate: e.target.value
                            })}
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Date de fin"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({
                                ...formData,
                                endDate: e.target.value
                            })}
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingReservation ? 'Modifier' : 'Créer'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ReservationsCRUD; 