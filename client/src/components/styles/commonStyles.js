// Nouveau fichier pour les styles communs
export const buttonStyles = {
    add: {
        variant: 'contained',
        color: 'primary',
        sx: {
            mb: 2,
            minWidth: '180px',
            height: '40px'
        }
    },
    edit: {
        variant: 'outlined',
        color: 'primary',
        sx: {
            mr: 1,
            minWidth: '100px',
            height: '36px'
        }
    },
    delete: {
        variant: 'outlined',
        color: 'error',
        sx: {
            minWidth: '100px',
            height: '36px'
        }
    },
    cancel: {
        variant: 'outlined',
        color: 'inherit',
        sx: {
            minWidth: '100px',
            height: '36px'
        }
    },
    save: {
        variant: 'contained',
        color: 'primary',
        sx: {
            minWidth: '100px',
            height: '36px'
        }
    }
};

export const tableStyles = {
    container: {
        sx: {
            maxWidth: '100%',
            overflowX: 'auto',
            mb: 4
        }
    },
    table: {
        sx: {
            minWidth: 650
        }
    },
    headerCell: {
        sx: {
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5'
        }
    },
    cell: {
        sx: {
            minWidth: '120px'
        }
    },
    actionsCell: {
        sx: {
            minWidth: '220px'
        }
    }
};
