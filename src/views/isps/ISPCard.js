import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
    Edit,
    CardGiftcard,
    AddBox,
    AddAlertSharp,
    AccountBalanceWallet,
    Language,
    HubOutlined,
    WifiOff,
    Wifi
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import jwt from 'jwtservice/jwtService';

/* ─── helpers ─────────────────────────────────────────────── */

/** Hex → "r,g,b" string for rgba() */
const hexToRgb = (hex = '#000000') => {
    const c = hex.replace('#', '');
    const full = c.length === 3
        ? c.split('').map((x) => x + x).join('')
        : c;
    const n = parseInt(full, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/* ─── styled components ───────────────────────────────────── */

const CardWrapper = styled(MainCard)(({ cardcolor }) => ({
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 16,
    /* color-matched semi-transparent border */
    border: `1.5px solid rgba(${hexToRgb(cardcolor)}, 0.35)`,
    padding: 0,
    '& .MuiCardContent-root': { padding: 0 }
}));

const CardTop = styled(Box)(({ cardcolor }) => ({
    backgroundColor: cardcolor,
    padding: '18px 18px 14px',
    position: 'relative',
    /* blob 1 */
    '&::after': {
        content: '""',
        position: 'absolute',
        width: 180, height: 180,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.10)',
        top: -60, right: -40,
        pointerEvents: 'none'
    },
    /* blob 2 */
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 120, height: 120,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        bottom: -30, left: -20,
        pointerEvents: 'none'
    }
}));

const VlanBadge = styled(Box)({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.03em',
    background: 'rgba(255,255,255,0.20)',
    border: '1px solid rgba(255,255,255,0.30)',
    borderRadius: 20,
    padding: '3px 9px 3px 6px',
    color: '#fff',
    marginTop: 5
});

const MenuBtn = styled(Box)({
    width: 32, height: 32,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
    '&:hover': { background: 'rgba(255,255,255,0.25)' }
});

const StatPill = styled(Box)({
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.20)',
    borderRadius: 10,
    padding: '8px 10px',
    flex: 1, minWidth: 0
});

const CardBottom = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderTop: '1px solid rgba(0,0,0,0.07)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
}));

const AlertBtn = styled('button')(({ theme, btnvariant }) => ({
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 11, fontWeight: 600,
    padding: '5px 11px', borderRadius: 7,
    border: `0.5px solid ${theme.palette.divider}`,
    background: 'transparent',
    cursor: 'pointer', whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    color: theme.palette.text.secondary,
    '& .MuiSvgIcon-root': {
        fontSize: 14,
        color: btnvariant === 'down'
            ? theme.palette.error.main
            : theme.palette.success.main
    },
    '&:hover': {
        background: btnvariant === 'down'
            ? `${theme.palette.error.main}18`
            : `${theme.palette.success.main}18`
    }
}));

/* ─── component ───────────────────────────────────────────── */

const ISPCard = ({ isp, isLoading }) => {
    const { id, name, vlan, color = '#1565c0', openingBalance, staticIpRate } = isp;
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const currentUser = jwt.getUser();
    const userType = currentUser?.type;
    const userRole = currentUser?.role;

    const isAdmin =
        userType === 'platformSuperAdmin' || userRole === 'platformSuperAdmin' ||
        userType === 'orgSuperAdmin'      || userRole === 'orgSuperAdmin' ||
        userType === 'orgAdmin'           || userRole === 'orgAdmin';

    const handleClick  = (e) => setAnchorEl(e.currentTarget);
    const handleClose  = () => setAnchorEl(null);

    const sendAlert = (type) => {
        const fn = type === 'down' ? jwt.sendServerDownAlert : jwt.sendServerUpAlert;
        fn(id)
            .then(() => alert('Alert Sent'))
            .catch((err) => alert(err?.response?.data?.message));
    };

    if (isLoading) return <SkeletonEarningCard />;

    return (
        <CardWrapper cardcolor={color} border={false} content={false}>

            {/* ── Colored header ── */}
            <CardTop cardcolor={color}>

                {/* Row 1: name + menu */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                        <Typography sx={{
                            fontSize: '1.15rem', fontWeight: 700, color: '#fff',
                            letterSpacing: '-0.01em', lineHeight: 1.2,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                            {name}
                        </Typography>
                        <VlanBadge>
                            <HubOutlined sx={{ fontSize: 11 }} />
                            VLAN {vlan}
                        </VlanBadge>
                    </Box>

                    <MenuBtn
                        aria-controls="menu-isp-card"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </MenuBtn>

                    <Menu
                        id="menu-isp-card"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {isAdmin && [
                            <MenuItem key="pkgs" onClick={() => { handleClose(); navigate('/dashboard/all-packages', { state: { ispId: id, color } }); }}>
                                <CardGiftcard sx={{ mr: 1.5, fontSize: 18 }} /> View Packages
                            </MenuItem>,
                            <MenuItem key="add-pkg" onClick={() => { handleClose(); navigate('/dashboard/add-package', { state: { ispId: id, color } }); }}>
                                <AddBox sx={{ mr: 1.5, fontSize: 18 }} /> Add New Package
                            </MenuItem>,
                            <MenuItem key="edit" onClick={() => { handleClose(); navigate(`/dashboard/edit-isp/${id}`); }}>
                                <Edit sx={{ mr: 1.5, fontSize: 18 }} /> Edit ISP
                            </MenuItem>
                        ]}
                    </Menu>
                </Box>

                {/* Row 2: stat pills */}
                <Box sx={{ display: 'flex', gap: 1, position: 'relative', zIndex: 1 }}>
                    <StatPill>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
                            <AccountBalanceWallet sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }} />
                            <Typography sx={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Balance
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.97rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
                            {(+openingBalance).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                        </Typography>
                    </StatPill>

                    <StatPill>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
                            <Language sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }} />
                            <Typography sx={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Static IP
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.97rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
                            {staticIpRate || 0}
                        </Typography>
                    </StatPill>
                </Box>
            </CardTop>

            {/* ── White footer ── */}
            <CardBottom>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: theme.palette.success.main, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.secondary' }}>
                        Active
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                    <AlertBtn btnvariant="down" theme={theme} onClick={() => sendAlert('down')}>
                        <WifiOff /> Down Alert
                    </AlertBtn>
                    <AlertBtn btnvariant="up" theme={theme} onClick={() => sendAlert('up')}>
                        <Wifi /> Up Alert
                    </AlertBtn>
                </Box>
            </CardBottom>

        </CardWrapper>
    );
};

ISPCard.propTypes = {
    isp: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        vlan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        color: PropTypes.string,
        openingBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        staticIpRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    isLoading: PropTypes.bool
};

export default ISPCard;