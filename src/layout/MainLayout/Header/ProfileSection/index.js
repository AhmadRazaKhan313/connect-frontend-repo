import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme, styled, alpha } from '@mui/material/styles';
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

import Transitions from 'ui-component/extended/Transitions';
import MainCard from 'ui-component/cards/MainCard';
import jwt from 'jwtservice/jwtService';
import User1 from 'assets/images/users/user-round.svg';
import useOrgTheme from 'utils/useOrgTheme';

// ─── Styled Components ────────────────────────────────────────────────────────

const TriggerBox = styled(Box)(({ theme, primarycolor }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    padding: theme.spacing(0.75, 1.5),
    borderRadius: 10,
    transition: 'background 0.15s ease',
    '&:hover': {
        background: alpha(primarycolor || theme.palette.primary.main, 0.06),
    },
}));

const UserAvatar = styled(Avatar)(({ theme, primarycolor }) => ({
    width: 34,
    height: 34,
    background: alpha(primarycolor || theme.palette.primary.main, 0.12),
    color: primarycolor || theme.palette.primary.main,
    fontSize: '0.8rem',
    fontWeight: 600,
}));

const UserNameBox = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('sm')]: {
        display: 'block',
    },
}));

const UserName = styled(Typography)(() => ({
    fontWeight: 600,
    lineHeight: 1.2,
}));

const UserRole = styled(Typography)(() => ({
    lineHeight: 1,
}));

const ArrowIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
    fontSize: '1rem',
    color: theme.palette.text.secondary,
}));

const DropdownPopper = styled(Popper)(() => ({
    zIndex: 1300,
}));

const DropdownPaper = styled(Paper)(() => ({
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 220,
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 2, 1),
}));

const SignedInLabel = styled(Typography)(() => ({
    // inherits color="text.secondary" from prop
}));

const MenuList = styled(List)(({ theme }) => ({
    padding: theme.spacing(1),
}));

const MenuItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 8,
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
}));

const LogoutButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 8,
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    color: theme.palette.error.main,
}));

const MenuIcon = styled(ListItemIcon)(() => ({
    minWidth: 32,
}));

const MenuItemText = styled(Typography)(() => ({
    // variant="body2" passed as prop
}));

const MenuDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
}));

// ─── Component ────────────────────────────────────────────────────────────────

const ProfileSection = () => {
    const theme = useTheme();
    const { primaryColor } = useOrgTheme();
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
        ? user.fullname.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const imageUrlWithQuery = profileImage ? `${profileImage}?t=${Date.now()}` : null;

    return (
        <>
            <TriggerBox
                ref={anchorRef}
                onClick={handleToggle}
                primarycolor={primaryColor}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
            >
                <UserAvatar src={imageUrlWithQuery || User1} primarycolor={primaryColor}>
                    {!imageUrlWithQuery && initials}
                </UserAvatar>

                <UserNameBox>
                    <UserName variant="body2" color="text.primary">
                        {user?.fullname || 'User'}
                    </UserName>
                    <UserRole variant="caption" color="text.secondary">
                        {user?.type || ''}
                    </UserRole>
                </UserNameBox>

                <ArrowIcon />
            </TriggerBox>

            <DropdownPopper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <DropdownPaper elevation={8}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={0} content={false}>
                                    <HeaderBox>
                                        <SignedInLabel variant="subtitle2" color="text.secondary">
                                            Signed in as
                                        </SignedInLabel>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">
                                            {user?.fullname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user?.type}
                                        </Typography>
                                    </HeaderBox>

                                    <Divider />

                                    <MenuList disablePadding>
                                        <MenuItemButton
                                            onClick={() => { navigate('/dashboard/update-profile'); setOpen(false); }}
                                        >
                                            <MenuIcon>
                                                <PersonOutlineIcon fontSize="small" />
                                            </MenuIcon>
                                            <ListItemText primary={<MenuItemText variant="body2">Update Profile</MenuItemText>} />
                                        </MenuItemButton>

                                        <MenuItemButton
                                            onClick={() => { navigate('/dashboard/update-password'); setOpen(false); }}
                                        >
                                            <MenuIcon>
                                                <LockOutlinedIcon fontSize="small" />
                                            </MenuIcon>
                                            <ListItemText primary={<MenuItemText variant="body2">Update Password</MenuItemText>} />
                                        </MenuItemButton>

                                        <MenuDivider />

                                        <LogoutButton onClick={handleLogout}>
                                            <MenuIcon>
                                                <LogoutIcon fontSize="small" color="error" />
                                            </MenuIcon>
                                            <ListItemText primary={<MenuItemText variant="body2" color="error">Logout</MenuItemText>} />
                                        </LogoutButton>
                                    </MenuList>
                                </MainCard>
                            </ClickAwayListener>
                        </DropdownPaper>
                    </Transitions>
                )}
            </DropdownPopper>
        </>
    );
};

export default ProfileSection;