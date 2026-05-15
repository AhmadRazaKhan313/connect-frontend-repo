import { Box, Button, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router';

export default function Forbidden() {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
            <LockIcon sx={{ fontSize: 64, color: '#d32f2f' }} />
            <Typography variant="h3" color="error">403 — Access Denied</Typography>
            <Typography color="text.secondary">You do not have permission to access this page.</Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </Box>
    );
}