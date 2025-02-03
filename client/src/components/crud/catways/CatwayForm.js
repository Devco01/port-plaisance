import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    MenuItem,
    Button,
    Paper
} from '@mui/material';
import { createCatway, updateCatway, getCatways } from '../../../services/api';

const CatwayForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        catwayNumber: '',
        catwayType: 'court',
        catwayState: 'disponible'
    });

    useEffect(() => {
        if (id) {
            const fetchCatway = async () => {
                try {
                    const response = await getCatways();
                    const catway = response.find(c => c._id === id);
                    if (catway) {
                        setFormData(catway);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération du catway:', error);
                }
            };
            fetchCatway();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateCatway(id, formData);
            } else {
                await createCatway(formData);
            }
            navigate('/catways');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {id ? 'Modifier le Catway' : 'Nouveau Catway'}
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Numéro"
                            type="number"
                            value={formData.catwayNumber}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayNumber: e.target.value
                            })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            select
                            label="Type"
                            value={formData.catwayType}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayType: e.target.value
                            })}
                            margin="normal"
                            required
                        >
                            <MenuItem value="court">Court</MenuItem>
                            <MenuItem value="long">Long</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            label="État"
                            value={formData.catwayState}
                            onChange={(e) => setFormData({
                                ...formData,
                                catwayState: e.target.value
                            })}
                            margin="normal"
                            required
                        >
                            <MenuItem value="disponible">Disponible</MenuItem>
                            <MenuItem value="occupé">Occupé</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                        </TextField>
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {id ? 'Modifier' : 'Créer'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/catways')}
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

export default CatwayForm; 