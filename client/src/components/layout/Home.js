import React from "react";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LoginIcon from "@mui/icons-material/Login";

const Home = () => {
    return (
        <Container maxWidth="md">
            <Box my={8}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", mb: 4 }}
                >
                    Port de Plaisance Russell
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom color="primary">
                        À propos de l'application
                    </Typography>
                    <Typography paragraph>
                        Bienvenue sur l'application de gestion du Port de
                        Plaisance Russell. Cette plateforme permet la gestion
                        complète des catways et des réservations du port.
                    </Typography>
                    <Typography paragraph>Notre système permet de :</Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        <Typography component="li" paragraph>
                            Gérer les catways (petits appontements pour amarrer
                            les bateaux)
                        </Typography>
                        <Typography component="li" paragraph>
                            Gérer les réservations des emplacements
                        </Typography>
                        <Typography component="li" paragraph>
                            Suivre l'état des installations en temps réel
                        </Typography>
                    </Box>
                </Paper>

                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                fontWeight: "bold"
                            }}
                        >
                            Se connecter
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            component="a"
                            href="http://localhost:8000/api-docs"
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<MenuBookIcon />}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem"
                            }}
                        >
                            Documentation API
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;
