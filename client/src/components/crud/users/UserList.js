import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box
} from '@mui/material';
import { getUsers, deleteUser } from '../../../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(
                'Erreur lors de la récupération des utilisateurs:',
                error
            );
        }
    };

    const handleDelete = async id => {
        if (
            window.confirm(
                'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
            )
        ) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gestion des Utilisateurs
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/users/new')}
                    sx={{ mb: 3 }}
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
                            {users.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.nom}</TableCell>
                                    <TableCell>{user.prenom}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            onClick={() =>
                                                navigate(
                                                    `/users/edit/${user._id}`
                                                )
                                            }
                                            sx={{ mr: 1 }}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() =>
                                                handleDelete(user._id)
                                            }
                                        >
                                            Supprimer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default UserList;
