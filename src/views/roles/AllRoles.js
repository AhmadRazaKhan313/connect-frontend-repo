import { useState, useEffect } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Alert, Chip, Box, Typography
} from '@mui/material';
import useOrgTheme from 'utils/useOrgTheme';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';

export default function AllRoles() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = jwt.getUser();
    const { tableHeaderStyle: style, primaryColor } = useOrgTheme();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = () => {
        setIsLoading(true);
        jwt.getAllRoles()
            .then((res) => {
                setRoles(res?.data);
                setIsLoading(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Roles load nahi huin');
                setIsError(true);
                setIsLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            jwt.deleteRole(id)
                .then(() => {
                    setRoles((prev) => prev.filter((r) => r._id !== id));
                })
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3">All Roles</Typography>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: primaryColor }}
                    onClick={() => navigate('/dashboard/add-role')}
                >
                    + Add Role
                </Button>
            </Box>

            {isLoading && <h3 style={{ padding: '16px' }}>Loading...</h3>}
            {isError && <Alert severity="error" sx={{ m: 2 }}>{errorMessage}</Alert>}

            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={style}>Sr.</TableCell>
                            <TableCell style={style}>Role Name</TableCell>
                            <TableCell style={style}>Permissions</TableCell>
                            <TableCell style={style}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role, index) => {
                            const isOwnRole = currentUser?.roleId === role._id;
                            return (
                                <TableRow key={role._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold">{role.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {role.permissions?.map((p) => (
                                                <Chip
                                                    key={p}
                                                    label={p}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{ mr: 1 }}
                                            onClick={() => navigate(`/dashboard/edit-role/${role._id}`)}
                                        >
                                            Edit
                                        </Button>
                                        {!isOwnRole && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(role._id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {!isLoading && roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">No roles found. Add your first role.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}