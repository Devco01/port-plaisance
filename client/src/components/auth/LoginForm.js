import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    Alert, 
    Paper, 
    Typography, 
    Container,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import config from '../../config/config';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${config.apiUrl}/api/users/login`;
            console.log('Tentative de connexion à:', url);
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
                setError(data.msg || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur détaillée:', error);
            setError('Erreur de connexion au serveur');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box 
                sx={{ 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: 4
                }}
            >
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <DirectionsBoatIcon 
                        color="primary" 
                        sx={{ 
                            fontSize: 60,
                            mb: 2
                        }} 
                    />
                    
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        Connexion
                    </Typography>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                width: '100%',
                                mb: 3
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            '& .MuiTextField-root': { mb: 2 }
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Button 
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ 
                                mt: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Se connecter
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Pas encore de compte ?
                            </Typography>
                            <Button
                                component={Link}
                                to="/register"
                                variant="outlined"
                                fullWidth
                            >
                                Créer un compte
                            </Button>
                        </Box>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Button
                                component={Link}
                                to="/"
                                color="primary"
                            >
                                Retour à l'accueil
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginForm; 