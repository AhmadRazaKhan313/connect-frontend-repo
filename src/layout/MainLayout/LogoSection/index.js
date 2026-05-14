import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ButtonBase, Typography } from '@mui/material';
import config from 'config';
import DefaultLogo from 'assets/images/connect-logo2.png';
import { MENU_OPEN } from 'store/actions';
import useAppContext from 'context/useAppContext';
import jwt from 'jwtservice/jwtService';

const LogoSection = () => {
    const defaultId = useSelector((state) => state.customization.defaultId);
    const dispatch = useDispatch();
    const { orgBranding } = useAppContext();

    const currentUser = jwt.getUser();
    const isPlatformSA =
        currentUser?.type === 'platformSuperAdmin' ||
        currentUser?.role === 'platformSuperAdmin';

    // platformSuperAdmin → default Connect logo
    // Org users → org logo + org name
    const logoSrc  = isPlatformSA ? DefaultLogo : (orgBranding?.logo || DefaultLogo);
    const orgName  = isPlatformSA ? 'Connect'   : (orgBranding?.name || 'Connect');

    return (
        <ButtonBase
            disableRipple
            onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
            component={Link}
            to={config.defaultPath}
            sx={{ display: 'flex',justifyContent: 'flex-start', alignItems: 'center', gap: 1, px: 1 }}
        >
            <Box
                component="img"
                src={logoSrc}
                alt={orgName}
                sx={{
                    width: 36,
                    height: 36,
                    objectFit: 'contain',
                    borderRadius: orgBranding?.logo && !isPlatformSA ? '6px' : '0px'
                }}
                onError={(e) => { e.target.src = DefaultLogo; }}
            />
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#4361ee',
                    letterSpacing: '-0.3px',
                    maxWidth: 140,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {orgName}
            </Typography>
        </ButtonBase>
    );
};

export default LogoSection;