import config from '../../config/config';
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const CatwaysCRUD = () => {
    const [catways, setCatways] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCatway, setCurrentCatway] = useState({
        catwayNumber: '',
        catwayType: 'small',
        catwayState: 'disponible'
    });

    useEffect(() => {
        fetchCatways();
    }, []);

    const fetchCatways = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.apiUrl}/api/catways`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCatways(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des catways:', error);
        }
    };

    const handleOpen = (catway = null) => {
        if (catway) {
            setCurrentCatway(catway);
            setEditMode(true);
        } else {
            setCurrentCatway({
                catwayNumber: '',
                catwayType: 'small',
                catwayState: 'disponible'
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCatway({
            catwayNumber: '',
            catwayType: 'small',
            catwayState: 'disponible'
        });
        setEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            console.log('Données du catway à créer:', currentCatway);
            const response = await fetch(`${config.apiUrl}/api/catways`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(currentCatway)
            });

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (response.ok) {
                await fetchCatways();
                handleClose();
            } else {
                console.error('Erreur lors de la sauvegarde:', data);
                alert('Erreur lors de la sauvegarde: ' + (data.message || response.statusText));
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.apiUrl}/api/catways/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    await fetchCatways();
                } else {
                    console.error('Erreur lors de la suppression:', response.statusText);
                    alert('Erreur lors de la suppression: ' + response.statusText);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression: ' + error.message);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Gestion des Catways
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Ajouter un Catway
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Numéro</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>État</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {catways.map((catway) => (
                            <TableRow key={catway._id}>
                                <TableCell>{catway.catwayNumber}</TableCell>
                                <TableCell>{catway.catwayType}</TableCell>
                                <TableCell>{catway.catwayState}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleOpen(catway)}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(catway._id)}
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
                    {editMode ? 'Modifier le Catway' : 'Ajouter un Catway'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Numéro"
                        fullWidth
                        value={currentCatway.catwayNumber}
                        onChange={(e) => setCurrentCatway({
                            ...currentCatway,
                            catwayNumber: e.target.value
                        })}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={currentCatway.catwayType}
                            label="Type"
                            onChange={(e) => setCurrentCatway({
                                ...currentCatway,
                                catwayType: e.target.value
                            })}
                        >
                            <MenuItem value="small">Petit</MenuItem>
                            <MenuItem value="medium">Moyen</MenuItem>
                            <MenuItem value="large">Grand</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>État</InputLabel>
                        <Select
                            value={currentCatway.catwayState}
                            label="État"
                            onChange={(e) => setCurrentCatway({
                                ...currentCatway,
                                catwayState: e.target.value
                            })}
                        >
                            <MenuItem value="disponible">Disponible</MenuItem>
                            <MenuItem value="occupé">Occupé</MenuItem>
                            <MenuItem value="maintenance">En maintenance</MenuItem>
                        </Select>
                    </FormControl>
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

export default CatwaysCRUD;