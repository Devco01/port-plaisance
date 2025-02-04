import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Container, Typography } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import config from '../../config/config';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${config.apiUrl}/api/users/register`;
            console.log('Tentative d\'inscription à:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Réponse status:', response.status);
            const data = await response.json();
            console.log('Réponse data:', data);

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.msg);
            }
        } catch (error) {
            console.error('Erreur détaillée:', error);
            setError('Erreur lors de l\'inscription');
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Inscription
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    
                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    <TextField
                        fullWidth
                        label="Confirmation du mot de passe"
                        type="password"
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    
                    <Button 
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        S'inscrire
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/"
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Retour à la connexion
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
