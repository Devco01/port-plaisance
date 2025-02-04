import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Port de Plaisance
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/catways")}
                    >
                        Catways
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/reservations")}
                    >
                        Réservations
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/users")}>
                        Utilisateurs
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
