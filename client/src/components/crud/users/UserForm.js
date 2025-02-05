import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper
} from "@mui/material";
import { createUser, updateUser, getUser } from "../../../services/api";

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nom: "",
        prenom: ""
    });

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const userData = await getUser(id);
                    setFormData({
                        ...userData,
                        password: "" // On ne récupère jamais le mot de passe
                    });
                } catch (error) {
                    console.error(
                        "Erreur lors de la récupération de l'utilisateur:",
                        error
                    );
                }
            };
            fetchUser();
        }
    }, [id]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (id) {
                // Si pas de nouveau mot de passe, on ne l'envoie pas
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password;
                }
                await updateUser(id, updateData);
            } else {
                await createUser(formData);
            }
            navigate("/users");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {id ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                            margin="normal"
                            required
                            disabled={!!id}
                        />
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type="password"
                            value={formData.password}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }
                            margin="normal"
                            required={!id}
                            helperText={
                                id
                                    ? "Laissez vide pour ne pas modifier le mot de passe"
                                    : ""
                            }
                        />
                        <TextField
                            fullWidth
                            label="Nom"
                            value={formData.nom}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    nom: e.target.value
                                })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Prénom"
                            value={formData.prenom}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    prenom: e.target.value
                                })
                            }
                            margin="normal"
                            required
                        />
                        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {id ? "Modifier" : "Créer"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/users")}
                            >
                                Annuler
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default UserForm;
