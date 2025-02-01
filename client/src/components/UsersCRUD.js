import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UsersCRUD = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        nom: '',
        prenom: '',
        password: ''
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

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/users', {
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
            setUsers(data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des utilisateurs', 'error');
        }
    }, [navigate, showSnackbar]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingUser 
                ? `http://localhost:8000/api/users/${editingUser.email}`
                : 'http://localhost:8000/api/users';
            const method = editingUser ? 'PUT' : 'POST';

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
            fetchUsers();
            showSnackbar(
                `Utilisateur ${editingUser ? 'modifié' : 'créé'} avec succès`,
                'success'
            );
        } catch (error) {
            showSnackbar('Erreur lors de l\'opération', 'error');
        }
    };

    const handleDelete = async (email) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/api/users/${email}`, {
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

                fetchUsers();
                showSnackbar('Utilisateur supprimé avec succès', 'success');
            } catch (error) {
                showSnackbar('Erreur lors de la suppression', 'error');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            password: '' // Le mot de passe n'est pas renvoyé pour des raisons de sécurité
        });
        setOpenDialog(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Gestion des Utilisateurs
            </Typography>
            
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    setEditingUser(null);
                    setFormData({
                        email: '',
                        nom: '',
                        prenom: '',
                        password: ''
                    });
                    setOpenDialog(true);
                }}
                sx={{ mb: 2 }}
            >
                Nouvel Utilisateur
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.nom}</TableCell>
                                <TableCell>{user.prenom}</TableCell>
                                <TableCell>
                                    <Button 
                                        onClick={() => handleEdit(user)}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button 
                                        onClick={() => handleDelete(user.email)}
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
                    {editingUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({
                                ...formData,
                                email: e.target.value
                            })}
                            margin="normal"
                            required
                            disabled={editingUser}
                        />
                        <TextField
                            fullWidth
                            label="Nom"
                            value={formData.nom}
                            onChange={(e) => setFormData({
                                ...formData,
                                nom: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Prénom"
                            value={formData.prenom}
                            onChange={(e) => setFormData({
                                ...formData,
                                prenom: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({
                                ...formData,
                                password: e.target.value
                            })}
                            margin="normal"
                            required={!editingUser}
                            helperText={editingUser ? "Laissez vide pour ne pas modifier le mot de passe" : ""}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingUser ? 'Modifier' : 'Créer'}
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

export default UsersCRUD; 