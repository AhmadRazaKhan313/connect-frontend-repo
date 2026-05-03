import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import MainCard from 'ui-component/cards/MainCard';
import jwt from 'jwtservice/jwtService';
import User1 from 'assets/images/users/user-round.svg';

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    useEffect(() => {
        setProfileImage(jwt.getUser()?.profileImage);
        // eslint-disable-next-line
    }, [jwt.getUser()?.time]);

    const handleLogout = () => {
        jwt.setIsLogin(false);
        jwt.removeToken();
        jwt.removeRefreshtoken();
        jwt.removeUser();
        navigate(0);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        setOpen(false);
    };

    const handleToggle = () => setOpen((prev) => !prev);

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current?.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const user = jwt.getUser();
    const initials = user?.fullname
        ? user.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    const imageUrlWithQuery = profileImage ? `${profileImage}?t=${Date.now()}` : null;

    return (
        <>
            <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '10px',
                    transition: 'background 0.15s',
                    '&:hover': { background: 'rgba(67,97,238,0.06)' }
                }}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
            >
                <Avatar
                    src={imageUrlWithQuery || User1}
                    sx={{
                        width: 34,
                        height: 34,
                        background: 'rgba(67,97,238,0.12)',
                        color: '#4361ee',
                        fontSize: '0.8rem',
                        fontWeight: 600
                    }}
                >
                    {!imageUrlWithQuery && initials}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
                        {user?.fullname || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                        {user?.type || ''}
                    </Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            </Box>

            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}
                sx={{ zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper elevation={8} sx={{ borderRadius: '12px', overflow: 'hidden', minWidth: 220 }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={0} content={false}>
                                    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Signed in as
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            {user?.fullname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user?.type}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ p: 1 }}>
                                        <List disablePadding>
                                            <ListItemButton
                                                sx={{ borderRadius: '8px', py: 0.75 }}
                                                onClick={() => { navigate('/dashboard/update-profile'); setOpen(false); }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <PersonOutlineIcon sx={{ fontSize: '1.1rem' }} />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Update Profile</Typography>} />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ borderRadius: '8px', py: 0.75 }}
                                                onClick={() => { navigate('/dashboard/update-password'); setOpen(false); }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <LockOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Update Password</Typography>} />
                                            </ListItemButton>
                                            <Divider sx={{ my: 0.5 }} />
                                            <ListItemButton
                                                sx={{ borderRadius: '8px', py: 0.75, color: 'error.main' }}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <LogoutIcon sx={{ fontSize: '1.1rem', color: 'error.main' }} />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2" color="error">Logout</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
