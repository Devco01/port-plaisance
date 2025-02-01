import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { createReservation } from '../services/api';

const ReservationForm = ({ catwayId }) => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createReservation({
                catwayId,
                ...formData
            });
            navigate('/dashboard');
        } catch (error) {
            alert('Erreur lors de la création de la réservation');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Nouvelle Réservation
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="startDate"
                        label="Date de début"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="endDate"
                        label="Date de fin"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Réserver
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ReservationForm;
