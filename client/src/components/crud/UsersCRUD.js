import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { getUsers, register, updateUser, deleteUser } from '../../services/api';

const UsersCRUD = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setCurrentUser({
                ...user,
                password: '' // On ne récupère jamais le mot de passe
            });
            setEditMode(true);
        } else {
            setCurrentUser({
                email: '',
                password: '',
                nom: '',
                prenom: ''
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentUser({
            email: '',
            password: '',
            nom: '',
            prenom: ''
        });
        setEditMode(false);
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await updateUser(currentUser._id, currentUser);
            } else {
                await register(currentUser);
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression: ' + error.message);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Gestion des Utilisateurs
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Ajouter un Utilisateur
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
                                        onClick={() => handleOpen(user)}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(user._id)}
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
                    {editMode ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({
                            ...currentUser,
                            email: e.target.value
                        })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={currentUser.password}
                        onChange={(e) => setCurrentUser({
                            ...currentUser,
                            password: e.target.value
                        })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Nom"
                        fullWidth
                        value={currentUser.nom}
                        onChange={(e) => setCurrentUser({
                            ...currentUser,
                            nom: e.target.value
                        })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Prénom"
                        fullWidth
                        value={currentUser.prenom}
                        onChange={(e) => setCurrentUser({
                            ...currentUser,
                            prenom: e.target.value
                        })}
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

export default UsersCRUD; 