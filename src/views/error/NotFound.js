import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            gap: 2
        }}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h4">Page Not Found</Typography>
            <Typography variant="body1" color="text.secondary">
                The page you are looking for does not exist.
            </Typography>
            <Button 
                variant="contained" 
                onClick={() => navigate('/dashboard')}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
};

export default NotFound;