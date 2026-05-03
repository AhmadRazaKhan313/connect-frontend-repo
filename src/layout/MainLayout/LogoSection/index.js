import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { Box, ButtonBase, Typography } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'assets/images/connect-logo2.png';
import { MENU_OPEN } from 'store/actions';

const LogoSection = () => {
    const defaultId = useSelector((state) => state.customization.defaultId);
    const dispatch = useDispatch();

    return (
        <ButtonBase
            disableRipple
            onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
            component={Link}
            to={config.defaultPath}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1
            }}
        >
            <img src={Logo} alt="Connect Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#4361ee',
                    letterSpacing: '-0.3px'
                }}
            >
                Connect
            </Typography>
        </ButtonBase>
    );
};

export default LogoSection;
