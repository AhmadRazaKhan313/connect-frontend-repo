import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Alert, Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import useOrgTheme from 'utils/useOrgTheme';
import { useState, useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';

export default function AllOrganizations() {
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const { tableHeaderStyle: style, primaryColor } = useOrgTheme();

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = () => {
        setIsLoading(true);
        jwt.getAllOrganizations()
            .then((res) => {
                setIsLoading(false);
                setOrganizations(res?.data);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
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
                .then(() => setOrganizations((prev) => prev.filter((org) => org.id !== id)))
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2, borderRadius: '12px', border: '1px solid', borderColor: 'grey.100' }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.100' }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>All Organizations</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/add-organization')}
                    sx={{
                        backgroundColor: primaryColor,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: primaryColor, opacity: 0.88 }
                    }}
                >
                    Add Organization
                </Button>
            </Box>

            {isLoading && <Typography sx={{ p: 2, color: 'text.secondary' }}>Loading...</Typography>}
            {isError && <Alert severity="error" sx={{ m: 2 }}>{errorMessage}</Alert>}

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
                                sx={{
                                    '&:last-child td': { border: 0 },
                                    '&:hover': { backgroundColor: `${primaryColor}06` }
                                }}
                            >
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{index + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{org.email}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{org.mobile}</TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ backgroundColor: 'grey.100', px: 1, py: 0.4, borderRadius: '4px', fontFamily: 'monospace' }}>
                                        {org.subdomain || '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: org.primaryColor || '#4361ee', border: '1px solid rgba(0,0,0,0.1)' }} />
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                            {org.primaryColor || '#4361ee'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={org.status}
                                        size="small"
                                        sx={{
                                            fontWeight: 500,
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            backgroundColor: org.status === 'active' ? '#d1fae5' : '#fee2e2',
                                            color: org.status === 'active' ? '#065f46' : '#991b1b'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => navigate(`/dashboard/edit-organization/${org.id}`)} sx={{ color: primaryColor }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={org.status === 'active' ? 'Deactivate' : 'Activate'}>
                                            <IconButton size="small" onClick={() => handleStatusToggle(org.id, org.status)}
                                                sx={{ color: org.status === 'active' ? '#16a34a' : 'text.disabled' }}>
                                                {org.status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(org.id)}>
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
    );
}
