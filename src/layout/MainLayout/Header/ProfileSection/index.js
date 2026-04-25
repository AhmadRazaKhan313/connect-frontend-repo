import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, Chip, ClickAwayListener, List, ListItemButton,
    ListItemIcon, ListItemText, Paper, Popper, Stack, Typography
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSettings, IconEdit, IconUserCircle } from '@tabler/icons';
import jwt from 'jwtservice/jwtService';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        setProfileImage(jwt.getUser()?.profileImage);
    }, [jwt.getUser()?.time]);

    const [selectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleLogout = async () => {
        const hostname = window.location.hostname;
        const subdomain = hostname === 'localhost' ? null : hostname.split('.')[0];

        // Sab clear karo
        localStorage.clear();

        // localhost ki connect_ keys bhi clear karo
        // (ye already clear ho gayi localStorage.clear() se)

        if (subdomain) {
            window.location.replace(`http://${subdomain}.localhost:3000/login`);
        } else {
            window.location.replace('http://localhost:3000/login');
        }
    };


    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        setOpen(false);
    };

    const handleToggle = () => setOpen((prevOpen) => !prevOpen);

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const imageUrlWithQuery = profileImage + `?timestamp=${Date.now()}`;

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': { stroke: theme.palette.primary.light }
                    },
                    '& .MuiChip-label': { lineHeight: 0 }
                }}
                icon={
                    <Avatar
                        src={profileImage ? imageUrlWithQuery : User1}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [{ name: 'offset', options: { offset: [0, 14] } }]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">Welcome,</Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    {jwt.getUser().fullname}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">{jwt.getUser().type}</Typography>
                                        </Stack>
                                    </Box>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 1 }}>
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: { minWidth: '100%' },
                                                    '& .MuiListItemButton-root': { mt: 0.5 }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={() => navigate('/dashboard/update-profile')}
                                                >
                                                    <ListItemIcon>
                                                        <IconUserCircle stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Update Profile</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={() => navigate('/dashboard/update-password')}
                                                >
                                                    <ListItemIcon>
                                                        <IconEdit stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Update Password</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
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
