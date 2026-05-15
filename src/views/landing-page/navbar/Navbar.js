import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../../assets/images/logo1.png';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useOrgTheme from 'utils/useOrgTheme';

function Navbar({ pages, selectedMenu, setSelectedMenu }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const navigate = useNavigate();
    const { primaryColor } = useOrgTheme();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (key = 'home') => {
        setSelectedMenu(key);
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ maxHeight: '80px' }}>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <img src={Logo} alt="Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                        <img src={Logo} alt="Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain', marginRight: '8px' }} />
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.key} onClick={() => handleCloseNavMenu(page.key)}>
                                    <Typography textAlign="center">{page.value}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 20 }}>
                        {pages.map((page) => (
                            <Button
                                key={page.key}
                                onClick={() => handleCloseNavMenu(page.key)}
                                sx={{ mr: 2, my: 5, color: selectedMenu === page.key ? primaryColor : 'white', display: 'block' }}
                            >
                                {page.value}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Button
                            variant="contained"
                            sx={{ color: 'white', backgroundColor: primaryColor }}
                            onClick={() => navigate('/login')}
                        >
                            LOGIN
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;