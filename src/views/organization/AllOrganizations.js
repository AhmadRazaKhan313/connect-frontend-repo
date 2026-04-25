import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Alert, Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { IconEdit, IconTrash, IconToggleLeft, IconToggleRight, IconBuildingBank } from '@tabler/icons';
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
    }, []);

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        jwt.updateOrganizationStatus(id, newStatus)
            .then(() => {
                setOrganizations((prev) =>
                    prev.map((org) => (org.id === id ? { ...org, status: newStatus } : org))
                );
                alert('Status Updated');
            })
            .catch((err) => alert(err?.response?.data?.message));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            jwt.deleteOrganization(id)
                .then(() => {
                    setOrganizations((prev) => prev.filter((org) => org.id !== id));
                    alert('Organization Deleted');
                })
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3">All Organizations</Typography>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: primaryColor, color: 'white', '&:hover': { backgroundColor: primaryColor, opacity: 0.9 } }}
                    onClick={() => navigate('/dashboard/add-organization')}
                    startIcon={<IconBuildingBank size={18} />}
                >
                    Add Organization
                </Button>
            </Box>

            {isLoading && <h3 style={{ padding: '16px' }}>Loading...!</h3>}
            {isError ? (
                <Alert severity="error">{errorMessage}</Alert>
            ) : (
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={style}>Sr.</TableCell>
                                <TableCell style={style}>Name</TableCell>
                                <TableCell style={style}>Email</TableCell>
                                <TableCell style={style}>Mobile</TableCell>
                                <TableCell style={style}>Subdomain</TableCell>
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
                                    <TableCell>{org.subdomain}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={org.status}
                                            color={org.status === 'active' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            {/* Edit */}
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="warning"
                                                    onClick={() => navigate(`/dashboard/edit-organization/${org.id}`)}
                                                >
                                                    <IconEdit size={18} />
                                                </IconButton>
                                            </Tooltip>

                                            {/* Activate / Deactivate */}
                                            <Tooltip title={org.status === 'active' ? 'Deactivate' : 'Activate'}>
                                                <IconButton
                                                    size="small"
                                                    color={org.status === 'active' ? 'error' : 'success'}
                                                    onClick={() => handleStatusToggle(org.id, org.status)}
                                                >
                                                    {org.status === 'active'
                                                        ? <IconToggleRight size={18} />
                                                        : <IconToggleLeft size={18} />
                                                    }
                                                </IconButton>
                                            </Tooltip>

                                            {/* Delete */}
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
            )}
        </Paper>
    );
}