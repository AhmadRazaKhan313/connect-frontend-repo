import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Edit, CardGiftcard, AddBox, AddAlertSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import jwt from 'jwtservice/jwtService';
import { STAFF_TYPES } from 'utils/Constants';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const CardWrapper = styled(MainCard)(({ color, theme }) => ({
    backgroundColor: color,
    // backgroundColor: 'black',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: '#e1e0de',
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: color,
        borderRadius: '50%',
        top: -155,
        right: -70,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

const ISPCard = ({ isp, isLoading }) => {
    const { id, name, vlan, color, openingBalance, staticIpRate } = isp;

    const theme = useTheme();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const sendServerDownAlert = (event) => {
        jwt.sendServerDownAlert(id)
            .then((res) => {
                alert('Alert Sent');
            })
            .catch((err) => {
                alert(err?.response?.data?.message);
            });
    };

    const sendServerUpAlert = (event) => {
        jwt.sendServerUpAlert(id)
            .then((res) => {
                alert('Alert Sent');
            })
            .catch((err) => {
                alert(err?.response?.data?.message);
            });
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper color={color} border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '1.3rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontWeight: 500,
                                                mr: 1,
                                                mb: 5
                                            }}
                                        >
                                            {name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: color,
                                                color: 'white',
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit" />
                                        </Avatar>
                                        <Menu
                                            id="menu-earning-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                <>
                                                    <MenuItem
                                                        onClick={() => navigate('/dashboard/all-packages', { state: { ispId: id, color } })}
                                                    >
                                                        <CardGiftcard sx={{ mr: 1.75 }} /> View Packages
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => navigate('/dashboard/add-package', { state: { ispId: id, color } })}
                                                    >
                                                        <AddBox sx={{ mr: 1.75 }} /> Add New Package
                                                    </MenuItem>
                                                    <MenuItem onClick={() => navigate('/dashboard/edit-isp', { state: { isp } })}>
                                                        <Edit sx={{ mr: 1.75 }} /> Edit ISP
                                                    </MenuItem>
                                                </>
                                            )}

                                            <MenuItem onClick={sendServerDownAlert}>
                                                <AddAlertSharp sx={{ mr: 1.75, color: 'red' }} /> Send Server Down Alert
                                            </MenuItem>
                                            <MenuItem onClick={sendServerUpAlert}>
                                                <AddAlertSharp sx={{ mr: 1.75, color: 'green' }} /> Send Server Up Alert
                                            </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '1.2rem',
                                                fontWeight: 500,
                                                color: 'white'
                                            }}
                                        >
                                            VLAN: {vlan}
                                        </Typography>
                                    </Grid>
                                    <Grid item></Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25, mt: 2 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: 'white'
                                    }}
                                >
                                    Balance: {(+openingBalance).toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ mb: 1.25, mt: 2 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: 'white'
                                    }}
                                >
                                    Static IP Rate: {staticIpRate || 0}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

export default ISPCard;
