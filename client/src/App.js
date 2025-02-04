import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Navigate
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import LoginForm from "./components/auth/LoginForm";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/layout/Home";
import CatwaysCRUD from "./components/crud/CatwaysCRUD";
import ReservationsCRUD from "./components/crud/ReservationsCRUD";
import UsersCRUD from "./components/crud/UsersCRUD";
import PrivateRoute from "./components/auth/PrivateRoute";

// Création du thème
const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2"
        },
        secondary: {
            main: "#dc004e"
        }
    }
});

// Layout component qui gère l'affichage conditionnel de la Navbar
const Layout = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const publicRoutes = ["/", "/register", "/login"];

    // Afficher la Navbar seulement si on a un token ET qu'on n'est pas sur une route publique
    const showNavbar = token && !publicRoutes.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            {children}
        </>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/catways"
                            element={
                                <PrivateRoute>
                                    <CatwaysCRUD />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reservations"
                            element={
                                <PrivateRoute>
                                    <ReservationsCRUD />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <PrivateRoute>
                                    <UsersCRUD />
                                </PrivateRoute>
                            }
                        />
                        {/* Rediriger toutes les autres routes vers la page d'accueil */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App;
