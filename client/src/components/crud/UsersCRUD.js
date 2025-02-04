import React, { useState, useEffect } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import config from "../../config/config";

const UsersCRUD = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        email: "",
        password: "",
        username: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${config.apiUrl}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log("Users récupérés:", data);
            setUsers(data);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des utilisateurs:",
                error
            );
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setCurrentUser({
                ...user,
                password: "" // On ne récupère jamais le mot de passe
            });
            setEditMode(true);
        } else {
            setCurrentUser({
                email: "",
                password: "",
                username: ""
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentUser({
            email: "",
            password: "",
            username: ""
        });
        setEditMode(false);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (editMode) {
                const response = await fetch(
                    `${config.apiUrl}/api/users/${currentUser.email}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(currentUser)
                    }
                );
                if (!response.ok)
                    throw new Error("Erreur lors de la mise à jour");
            } else {
                const response = await fetch(`${config.apiUrl}/api/users`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentUser)
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                        error.message || "Erreur lors de la création"
                    );
                }
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Erreur lors de la sauvegarde: " + error.message);
        }
    };

    const handleDelete = async email => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            )
        ) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${config.apiUrl}/api/users/${email}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok)
                    throw new Error("Erreur lors de la suppression");
                fetchUsers();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression: " + error.message);
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
                            <TableCell>Nom d'utilisateur</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleOpen(user)}
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editMode
                        ? "Modifier l'Utilisateur"
                        : "Ajouter un Utilisateur"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={currentUser.email}
                        onChange={e =>
                            setCurrentUser({
                                ...currentUser,
                                email: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={currentUser.password}
                        onChange={e =>
                            setCurrentUser({
                                ...currentUser,
                                password: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Nom d'utilisateur"
                        fullWidth
                        value={currentUser.username}
                        onChange={e =>
                            setCurrentUser({
                                ...currentUser,
                                username: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? "Modifier" : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsersCRUD;
