import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { THEME_COLOR_DARK } from 'utils/Constants';

function ApiConnectionError() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <h1 style={{ color: THEME_COLOR_DARK }}>504 | Connection Error</h1>
            <Button variant="conatained" sx={{ backgroundColor: THEME_COLOR_DARK, color: 'white' }} onClick={() => navigate('/')}>
                Go Home
            </Button>
        </div>
    );
}

export default ApiConnectionError;
