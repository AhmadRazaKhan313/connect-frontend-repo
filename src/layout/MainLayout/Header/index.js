import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Chip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import CustomMessageModal from './CustomMessageModal';

import useAppContext from 'context/useAppContext';
import jwt from 'jwtservice/jwtService';
import { STAFF_TYPES } from 'utils/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const { filters, data, setFilteredData, smsBalance, getSmsBalance } = useAppContext();

    const [showModal, setShowModal] = useState(false);
    const user = jwt.getUser();
    const isSuperAdmin = user?.type === 'superadmin';
    const isAdmin = user?.type === STAFF_TYPES.admin;

    const sendExpiryAlert = () => {
        jwt.sendExpiryAlert()
            .then(() => {
                toast.success('Expiry Alert Sent');
                getSmsBalance();
            })
            .catch((err) => toast.error(err?.response?.data?.message || 'Error sending alert'));
    };

    return (
        <>
            {/* Logo + Menu Toggle */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    alignItems: 'center',
                    [theme.breakpoints.down('md')]: { width: 'auto' }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase
                    sx={{ borderRadius: '8px', overflow: 'hidden', ml: 0.5 }}
                    onClick={handleLeftDrawerToggle}
                >
                    <Avatar
                        variant="rounded"
                        sx={{
                            width: 34,
                            height: 34,
                            background: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            borderRadius: '8px',
                            '&:hover': {
                                background: `${theme.palette.primary.main}25`
                            }
                        }}
                    >
                        <MenuIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* Search */}
            <SearchSection filters={filters} data={data} setFilteredData={setFilteredData} />

            <Box sx={{ flexGrow: 1 }} />

            {/* SMS Balance — only for admin/staff, not superadmin */}
            {!isSuperAdmin && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 0.5 }}>
                    <SmsIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        SMS:
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: smsBalance < 100 ? 'error.main' : 'success.main' }}
                    >
                        {smsBalance}
                    </Typography>
                </Box>
            )}

            {/* Send Message — only for admin */}
            {isAdmin && (
                <>
                    <Chip
                        label="Send Message"
                        onClick={() => setShowModal(true)}
                        sx={{
                            mr: 1.5,
                            borderRadius: '8px',
                            background: theme.palette.primary.main,
                            color: '#fff',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            height: '34px',
                            cursor: 'pointer',
                            '&:hover': { background: theme.palette.primary.dark, opacity: 0.9 }
                        }}
                    />
                    <Chip
                        label="Expiry Alert"
                        onClick={sendExpiryAlert}
                        sx={{
                            mr: 1.5,
                            borderRadius: '8px',
                            background: `${theme.palette.primary.main}18`,
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            height: '34px',
                            cursor: 'pointer',
                            border: `1px solid ${theme.palette.primary.main}40`,
                            '&:hover': { background: `${theme.palette.primary.main}28` }
                        }}
                    />
                </>
            )}

            {/* Profile */}
            <ProfileSection />

            {/* Custom Message Modal */}
            <CustomMessageModal open={showModal} handleClose={() => setShowModal(false)} />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
