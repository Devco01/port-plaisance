import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CatwaysCRUD = () => {
    const [catways, setCatways] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCatway, setEditingCatway] = useState(null);
    const [formData, setFormData] = useState({
        catwayNumber: '',
        catwayType: 'short',
        catwayState: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCatways();
    }, []);

    const fetchCatways = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/catways', {
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
            setCatways(data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des catways', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingCatway 
                ? `http://localhost:8000/api/catways/${editingCatway._id}`
                : 'http://localhost:8000/api/catways';
            const method = editingCatway ? 'PUT' : 'POST';

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
            fetchCatways();
            showSnackbar(
                `Catway ${editingCatway ? 'modifié' : 'créé'} avec succès`,
                'success'
            );
        } catch (error) {
            showSnackbar('Erreur lors de l\'opération', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/api/catways/${id}`, {
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

                fetchCatways();
                showSnackbar('Catway supprimé avec succès', 'success');
            } catch (error) {
                showSnackbar('Erreur lors de la suppression', 'error');
            }
        }
    };

    const handleEdit = (catway) => {
        setEditingCatway(catway);
        setFormData({
            catwayNumber: catway.catwayNumber,
            catwayType: catway.catwayType,
            catwayState: catway.catwayState
        });
        setOpenDialog(true);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Gestion des Catways
            </Typography>
            
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setEditingCatway(null);
                    setFormData({
                        catwayNumber: '',
                        catwayType: 'short',
                        catwayState: ''
                    });
                    setOpenDialog(true);
                }}
                sx={{ mb: 2 }}
            >
                Nouveau Catway
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
                                        onClick={() => handleEdit(catway)}
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {editingCatway ? 'Modifier le Catway' : 'Nouveau Catway'}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Numéro"
                            value={formData.catwayNumber}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayNumber: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <Select
                            fullWidth
                            value={formData.catwayType}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayType: e.target.value
                            })}
                            margin="normal"
                            required
                        >
                            <MenuItem value="short">Court</MenuItem>
                            <MenuItem value="long">Long</MenuItem>
                        </Select>
                        <TextField
                            fullWidth
                            label="État"
                            value={formData.catwayState}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayState: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingCatway ? 'Modifier' : 'Créer'}
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

export default CatwaysCRUD; 