import { useState, useEffect } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Alert, Chip, Box, Typography,
    IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
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
                setRoles(res?.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Roles load nahi hue');
                setIsError(true);
                setIsLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Kya aap yeh role delete karna chahte hain?')) {
            jwt.deleteRole(id)
                .then(() => setRoles((prev) => prev.filter((r) => r.id !== id)))
                .catch((err) => alert(err?.response?.data?.message));
        }
    };

    const systemRoles = roles.filter((r) => r.isSystem);
    const customRoles = roles.filter((r) => !r.isSystem);

    const RoleRow = ({ role, index, isSystem }) => {
        const isOwnRole = currentUser?.roleId === role.id;
        return (
            <TableRow key={role.id} sx={{ backgroundColor: isSystem ? '#f9f9f9' : 'inherit' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isSystem && (
                            <Tooltip title="System Role — edit/delete nahi ho sakta">
                                <LockIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
                            </Tooltip>
                        )}
                        <Typography fontWeight="bold">{role.name}</Typography>
                        {isSystem && (
                            <Chip label="System" size="small" sx={{ fontSize: 10, height: 18, backgroundColor: '#e3f2fd', color: '#1565c0' }} />
                        )}
                    </Box>
                    {role.description && (
                        <Typography variant="caption" color="text.secondary">{role.description}</Typography>
                    )}
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {isSystem ? (
                            <Chip label="All Permissions" size="small" color="success" variant="outlined" />
                        ) : (
                            role.permissions?.map((p) => (
                                <Chip key={p} label={p} size="small" color="primary" variant="outlined" />
                            ))
                        )}
                    </Box>
                </TableCell>
                <TableCell>
                    {isSystem ? (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => navigate(`/dashboard/edit-role/${role.id}`)}>
                                    <EditIcon fontSize="small" sx={{ color: primaryColor }} />
                                </IconButton>
                            </Tooltip>
                            {!isOwnRole && (
                                <Tooltip title="Delete">
                                    <IconButton size="small" onClick={() => handleDelete(role.id)}>
                                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    )}
                </TableCell>
            </TableRow>
        );
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
                        {/* System Roles pehle */}
                        {systemRoles.map((role, index) => (
                            <RoleRow key={role.id} role={role} index={index} isSystem={true} />
                        ))}

                        {/* Custom Roles baad mein */}
                        {customRoles.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ backgroundColor: '#f5f5f5', py: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, pl: 1 }}>
                                        CUSTOM ROLES
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {customRoles.map((role, index) => (
                            <RoleRow key={role.id} role={role} index={systemRoles.length + index} isSystem={false} />
                        ))}

                        {!isLoading && roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">Koi role nahi mila.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}