import { AppBar, Toolbar, Button, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';

const getDocsUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? 'https://port-plaisance.onrender.com/api-docs'
        : 'http://localhost:8000/api-docs';
};

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Port de Plaisance
                </Typography>
                <Button 
                    color="inherit"
                    startIcon={<DescriptionIcon />}
                    href={getDocsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Documentation
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 