import { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Alert,
    Box,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { gridSpacing } from 'store/constant';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';
import useOrgTheme from 'utils/useOrgTheme';
import OrgStatCard from './OrgStatCard';
import { IconEdit, IconTrash, IconToggleLeft, IconToggleRight } from '@tabler/icons';

const MyDivider = () => (
    <div
        style={{
            width: '100%',
            height: '1.5px',
            backgroundColor: '#BEBEBE',
            borderRadius: '20px',
            margin: '30px 10px 10px 30px'
        }}
    />
);

const PlatformDashboard = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { tableHeaderStyle: style, primaryColor } = useOrgTheme();

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = () => {
        setIsLoading(true);
        jwt.getAllOrganizations()
            .then((res) => {
                setOrganizations(res?.data);
                setIsLoading(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Organizations load nahi huin');
                setIsError(true);
                setIsLoading(false);
            });
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
                .then(() => {
                    setOrganizations((prev) => prev.filter((org) => org.id !== id));
                })
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter((o) => o.status === 'active').length;
    const inactiveOrgs = organizations.filter((o) => o.status === 'inactive').length;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>

                    {/* ── Summary Cards ── */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} xs={12} md={4}>
                                <OrgStatCard isLoading={isLoading} title="Total Organizations" total={totalOrgs} />
                            </Grid>
                            <Grid item sm={12} xs={12} md={4}>
                                <OrgStatCard isLoading={isLoading} title="Active Organizations" total={activeOrgs} />
                            </Grid>
                            <Grid item sm={12} xs={12} md={4}>
                                <OrgStatCard isLoading={isLoading} title="Inactive Organizations" total={inactiveOrgs} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <MyDivider />

                    {/* ── Organizations Table ── */}
                    <Grid item xs={12}>
                        {isError && <Alert severity="error">{errorMessage}</Alert>}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>

                            {/* Header */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h3">All Organizations</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: primaryColor, color: 'white', '&:hover': { backgroundColor: primaryColor, opacity: 0.9 } }}
                                    onClick={() => navigate('/dashboard/add-organization')}
                                >
                                    + Add Organization
                                </Button>
                            </Box>

                            {isLoading && <h3 style={{ padding: '16px' }}>Loading...</h3>}
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
                                            <TableRow key={org.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{org.name}</TableCell>
                                                <TableCell>{org.email}</TableCell>
                                                <TableCell>{org.mobile}</TableCell>
                                                <TableCell>{org.subdomain || '—'}</TableCell>

                                                {/* Color preview */}
                                                <TableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <div style={{
                                                            width: 20, height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: org.primaryColor || '#1976d2',
                                                            border: '1px solid #ccc'
                                                        }} />
                                                       <span>{org.primaryColor ? org.primaryColor.replace('#', '') : '1976d2'}</span>
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <Chip
                                                        label={org.status}
                                                        color={org.status === 'active' ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>

                                                {/* Actions — icons */}
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/dashboard/edit-organization/${org.id}`)}
                                                                sx={{ color: primaryColor }}
                                                            >
                                                                <IconEdit size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={org.status === 'active' ? 'Deactivate' : 'Activate'}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleStatusToggle(org.id, org.status)}
                                                                sx={{ color: org.status === 'active' ? primaryColor : '#9e9e9e' }}
                                                            >
                                                                {org.status === 'active'
                                                                    ? <IconToggleRight size={18} />
                                                                    : <IconToggleLeft size={18} />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(org.id)}
                                                            >
                                                                <IconTrash size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    );
};

export default PlatformDashboard;