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
import { login } from '../../services/authService';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔑 Soumission du formulaire:', { email });
        try {
            const response = await login(email, password);
            console.log('✅ Login réussi:', {
                hasToken: !!response.token,
                redirectTo: '/dashboard'
            });
            if (response.token) {
                console.log('🔄 Redirection vers le dashboard...');
                navigate('/dashboard');
            } else {
                console.error('❌ Pas de token dans la réponse');
                setError('Erreur de connexion');
            }
        } catch (error) {
            console.error('❌ Erreur de login:', {
                message: error.message,
                response: error.response?.data
            });
            if (error.response?.status === 400) {
                setError(error.response.data.msg || 'Identifiants invalides');
            } else {
                setError('Erreur de connexion au serveur');
            }
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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