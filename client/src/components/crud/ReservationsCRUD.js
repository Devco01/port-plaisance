import config from "../../config/config";
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

const ReservationsCRUD = () => {
    const [reservations, setReservations] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReservation, setCurrentReservation] = useState({
        catwayNumber: "",
        clientName: "",
        boatName: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem("token");
            // D'abord, récupérer tous les catways
            const catwaysResponse = await fetch(
                `${config.apiUrl}/api/catways`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const catways = await catwaysResponse.json();
            console.log("Catways récupérés:", catways);

            // Ensuite, récupérer les réservations pour chaque catway
            const allReservations = [];
            for (const catway of catways) {
                console.log(
                    "Récupération réservations pour catway:",
                    catway.catwayNumber
                );
                const response = await fetch(
                    `${config.apiUrl}/api/catways/${catway.catwayNumber}/reservations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                const reservations = await response.json();
                console.log("Réservations reçues:", reservations);
                reservations.forEach(res => {
                    res.catwayNumber = catway.catwayNumber;
                });
                allReservations.push(...reservations);
            }
            console.log("Toutes les réservations:", allReservations);
            setReservations(allReservations);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des réservations:",
                error
            );
        }
    };

    const handleOpen = (reservation = null) => {
        if (reservation) {
            setCurrentReservation({
                ...reservation,
                startDate: reservation.startDate.split("T")[0],
                endDate: reservation.endDate.split("T")[0]
            });
            setEditMode(true);
        } else {
            setCurrentReservation({
                catwayNumber: "",
                clientName: "",
                boatName: "",
                startDate: "",
                endDate: ""
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentReservation({
            catwayNumber: "",
            clientName: "",
            boatName: "",
            startDate: "",
            endDate: ""
        });
        setEditMode(false);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (editMode) {
                const response = await fetch(
                    `${config.apiUrl}/api/catways/${currentReservation.catwayNumber}/reservations/${currentReservation._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(currentReservation)
                    }
                );
                if (!response.ok)
                    throw new Error("Erreur lors de la mise à jour");
            } else {
                // Vérifier que le catway existe d'abord
                const catwayResponse = await fetch(
                    `${config.apiUrl}/api/catways`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                const catways = await catwayResponse.json();
                const catway = catways.find(
                    c => c.catwayNumber === currentReservation.catwayNumber
                );

                if (!catway) {
                    throw new Error("Numéro de catway invalide");
                }

                const response = await fetch(
                    `${config.apiUrl}/api/catways/${currentReservation.catwayNumber}/reservations`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            catwayNumber: currentReservation.catwayNumber,
                            clientName: currentReservation.clientName,
                            boatName: currentReservation.boatName,
                            startDate: currentReservation.startDate,
                            endDate: currentReservation.endDate
                        })
                    }
                );
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                        error.message || "Erreur lors de la création"
                    );
                }
            }
            fetchReservations();
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Erreur lors de la sauvegarde: " + error.message);
        }
    };

    const handleDelete = async id => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer cette réservation ?"
            )
        ) {
            try {
                const token = localStorage.getItem("token");
                const reservation = reservations.find(r => r._id === id);
                const response = await fetch(
                    `${config.apiUrl}/api/catways/${reservation.catwayNumber}/reservations/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok)
                    throw new Error("Erreur lors de la suppression");
                fetchReservations();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression: " + error.message);
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
                            <TableCell>Client</TableCell>
                            <TableCell>Bateau</TableCell>
                            <TableCell>Date de début</TableCell>
                            <TableCell>Date de fin</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map(reservation => (
                            <TableRow key={reservation._id}>
                                <TableCell>
                                    {reservation.catwayNumber}
                                </TableCell>
                                <TableCell>{reservation.clientName}</TableCell>
                                <TableCell>{reservation.boatName}</TableCell>
                                <TableCell>
                                    {new Date(
                                        reservation.startDate
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        reservation.endDate
                                    ).toLocaleDateString()}
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
                                        onClick={() =>
                                            handleDelete(reservation._id)
                                        }
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
                        ? "Modifier la Réservation"
                        : "Ajouter une Réservation"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Numéro de Catway"
                        fullWidth
                        value={currentReservation.catwayNumber}
                        onChange={e =>
                            setCurrentReservation({
                                ...currentReservation,
                                catwayNumber: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Nom du client"
                        fullWidth
                        value={currentReservation.clientName}
                        onChange={e =>
                            setCurrentReservation({
                                ...currentReservation,
                                clientName: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Nom du bateau"
                        fullWidth
                        value={currentReservation.boatName}
                        onChange={e =>
                            setCurrentReservation({
                                ...currentReservation,
                                boatName: e.target.value
                            })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date de début"
                        type="date"
                        fullWidth
                        value={currentReservation.startDate}
                        onChange={e =>
                            setCurrentReservation({
                                ...currentReservation,
                                startDate: e.target.value
                            })
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date de fin"
                        type="date"
                        fullWidth
                        value={currentReservation.endDate}
                        onChange={e =>
                            setCurrentReservation({
                                ...currentReservation,
                                endDate: e.target.value
                            })
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
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

export default ReservationsCRUD;
