import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { getCatways } from "../../../services/api";

const CatwayList = () => {
    const [catways, setCatways] = useState([]);

    useEffect(() => {
        const fetchCatways = async () => {
            try {
                const data = await getCatways();
                setCatways(data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des catways:",
                    error
                );
            }
        };

        fetchCatways();
    }, []);

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Liste des Catways
            </Typography>
            <Grid container spacing={3}>
                {catways.map(catway => (
                    <Grid item xs={12} sm={6} md={4} key={catway._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Catway N°{catway.catwayNumber}
                                </Typography>
                                <Typography color="textSecondary">
                                    Type: {catway.catwayType}
                                </Typography>
                                <Typography color="textSecondary">
                                    État: {catway.catwayState}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CatwayList;
