import { useEffect, useState } from 'react';
import {
    Grid, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Alert, Box, IconButton,
    Tooltip, Typography
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { gridSpacing } from 'store/constant';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';
import useOrgTheme from 'utils/useOrgTheme';
import DashStatCard from './DashStatCard';

const PlatformDashboard = () => {
    const navigate = useNavigate();
    const { tableHeaderStyle: style, primaryColor } = useOrgTheme();

    const [organizations, setOrganizations] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);

        // Load organizations
        jwt.getAllOrganizations()
            .then((res) => {
                setOrganizations(res?.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Data load failed');
                setIsError(true);
                setIsLoading(false);
            });

        // Load total users
        jwt.getAllUsers()
            .then((res) => {
                const users = res?.data;
                setTotalUsers(Array.isArray(users) ? users.length : users?.total || 0);
            })
            .catch(() => setTotalUsers(0));
    };

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        jwt.updateOrganizationStatus(id, newStatus)
            .then(() => {
                setOrganizations((prev) =>
                    prev.map((org) => (org.id === id ? { ...org, status: newStatus } : org))
                );
            })
            .catch((err) => alert(err?.response?.data?.message));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            jwt.deleteOrganization(id)
                .then(() => setOrganizations((prev) => prev.filter((org) => org.id !== id)))
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter((o) => o.status === 'active').length;
    const inactiveOrgs = organizations.filter((o) => o.status === 'inactive').length;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    Dashboard
                </Typography>
            </Grid>

            {/* ── Stat Cards ── */}
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <DashStatCard
                            isLoading={isLoading}
                            title="Total Organizations"
                            value={totalOrgs}
                            icon={BusinessIcon}
                            iconBgColor="#ede9fe"
                            iconColor="#7c3aed"
                            trend={2.5}
                            trendLabel="from last month"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DashStatCard
                            isLoading={isLoading}
                            title="Active Organizations"
                            value={activeOrgs}
                            icon={CheckCircleOutlineIcon}
                            iconBgColor="#dcfce7"
                            iconColor="#16a34a"
                            trend={1.3}
                            trendLabel="from last week"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DashStatCard
                            isLoading={isLoading}
                            title="Inactive Organizations"
                            value={inactiveOrgs}
                            icon={CancelOutlinedIcon}
                            iconBgColor="#fee2e2"
                            iconColor="#dc2626"
                            trend={-4.3}
                            trendLabel="from yesterday"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DashStatCard
                            isLoading={isLoading}
                            title="Total Users"
                            value={totalUsers}
                            icon={GroupIcon}
                            iconBgColor="#fef9c3"
                            iconColor="#ca8a04"
                            trend={1.8}
                            trendLabel="from last month"
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* ── Organizations Table ── */}
            <Grid item xs={12}>
                {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                <Paper sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: 'grey.100' }}>

                    {/* Table top bar */}
                    <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.100' }}>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            All Organizations
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/dashboard/add-organization')}
                            sx={{
                                backgroundColor: primaryColor,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': { backgroundColor: primaryColor, opacity: 0.88 }
                            }}
                        >
                            + Add Organization
                        </Button>
                    </Box>

                    {isLoading && (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Loading...</Typography>
                    )}

                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={style}>Sr.</TableCell>
                                    <TableCell style={style}>Name</TableCell>
                                    <TableCell style={style}>Email</TableCell>
                                    <TableCell style={style}>Mobile</TableCell>
                                    <TableCell style={style}>Subdomain</TableCell>
                                    <TableCell style={style}>Color</TableCell>
                                    <TableCell style={style}>Status</TableCell>
                                    <TableCell style={style} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {organizations.map((org, index) => (
                                    <TableRow
                                        key={org.id}
                                        hover
                                        sx={{ '&:last-child td': { border: 0 } }}
                                    >
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{org.email}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{org.mobile}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    backgroundColor: 'grey.100',
                                                    px: 1, py: 0.4,
                                                    borderRadius: '4px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.78rem'
                                                }}
                                            >
                                                {org.subdomain || '—'}
                                            </Typography>
                                        </TableCell>

                                        {/* Color preview */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{
                                                    width: 18, height: 18,
                                                    borderRadius: '50%',
                                                    backgroundColor: org.primaryColor || '#4361ee',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    flexShrink: 0
                                                }} />
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                                    {org.primaryColor || '#4361ee'}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        {/* Status badge */}
                                        <TableCell>
                                            <Chip
                                                label={org.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: org.status === 'active' ? '#dcfce7' : '#fee2e2',
                                                    color: org.status === 'active' ? '#16a34a' : '#dc2626'
                                                }}
                                            />
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/dashboard/edit-organization/${org.id}`)}
                                                        sx={{ color: primaryColor }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={org.status === 'active' ? 'Deactivate' : 'Activate'}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleStatusToggle(org.id, org.status)}
                                                        sx={{ color: org.status === 'active' ? '#16a34a' : 'text.disabled' }}
                                                    >
                                                        {org.status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(org.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!isLoading && organizations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No organizations found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default PlatformDashboard;
