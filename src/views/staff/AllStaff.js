import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, Grid, IconButton,
    InputLabel, MenuItem, OutlinedInput, Select, Tooltip, Typography, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import { STAFF_TYPES } from 'utils/Constants';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import jwt from 'jwtservice/jwtService';
import useAppContext from 'context/useAppContext';
import useOrgTheme from 'utils/useOrgTheme';

function createData(id, fullname, type, share, email, cnic, mobile, address, roleId) {
    return { id, fullname, type, share, email, cnic, mobile, address, roleId };
}

export default function AllStaff() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roles, setRoles] = useState([]);

    const [editOpen, setEditOpen] = useState(false);
    const [editStaff, setEditStaff] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();
    const { tableHeaderStyle: style, primaryColor } = useOrgTheme();
    const navigate = useNavigate();

    // Logged in user
    const currentUser = jwt.getUser();
    const currentUserId = currentUser?.id || currentUser?._id;

    const iconStyle = { color: primaryColor };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const loadStaff = () => {
        setIsLoading(true);
        jwt.getAllStaffs()
            .then((res) => {
                setIsLoading(false);
                const rowsData = res?.data?.map((item) =>
                    createData(item?.id, item?.fullname, item?.type, item?.share, item?.email, item?.cnic, item?.mobile, item?.address, item?.roleId)
                );
                setData(rowsData || []);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setFilters(['fullname', 'type', 'share', 'cnic', 'mobile', 'email', 'address']);
        loadStaff();
        jwt.getAllRoles()
            .then((res) => {
                // Sirf custom roles — system roles (isSystem:true) role dropdown mein nahi aane chahiye
                const customRoles = (res?.data || []).filter((r) => !r.isSystem);
                setRoles(customRoles);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleEditOpen = (row) => {
        setEditStaff({ ...row, password: '' });
        setEditError('');
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditStaff(null);
    };

    const handleEditSave = () => {
        if (!editStaff?.fullname || !editStaff?.email) {
            setEditError('Name and Email are required');
            return;
        }
        setEditLoading(true);
        // Bug fix: pura row spread karne ki bajaye sirf specific allowed fields bhejo
        // Isse accidental password overwrite ya immutable field errors nahi hote
        const payload = {
            fullname:  editStaff.fullname,
            email:     editStaff.email,
            mobile:    editStaff.mobile,
            cnic:      editStaff.cnic,
            address:   editStaff.address,
            type:      editStaff.type,
            role:      editStaff.role,
            share:     editStaff.share,
        };

        // roleId: sirf tab bhejo jab valid value ho
        if (editStaff.roleId) payload.roleId = editStaff.roleId;

        // Password: sirf tab bhejo jab actually fill kiya ho
        if (editStaff.password && editStaff.password.trim()) {
            payload.password = editStaff.password;
        }

        // Apna account edit kar rahe hain to role/type nahi bhejna
        if (editStaff.id === currentUserId) {
            delete payload.role;
            delete payload.roleId;
            delete payload.type;
        }

        jwt.updateStaff(editStaff.id, payload)
            .then(() => {
                setEditLoading(false);
                handleEditClose();
                loadStaff();
            })
            .catch((err) => {
                setEditError(err?.response?.data?.message || 'Update failed');
                setEditLoading(false);
            });
    };

    const handleDelete = (row) => {
        if (row.id === currentUserId) {
            alert('Aap apna khud ka account delete nahi kar sakte');
            return;
        }
        if (!window.confirm(`Delete staff "${row.fullname}"?`)) return;
        jwt.deleteStaff(row.id)
            .then(() => loadStaff())
            .catch((err) => alert(err?.response?.data?.message || 'Delete failed'));
    };

    // Kya yeh logged-in user ka apna row hai
    const isSelf = (row) => row.id === currentUserId;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
                <Typography variant="h5" fontWeight={600}>All Staff</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/add-staff')}
                    sx={{ backgroundColor: primaryColor, '&:hover': { backgroundColor: primaryColor, opacity: 0.9 } }}
                >
                    Add Staff
                </Button>
            </Box>

            {isLoading && <h3>Loading...!</h3>}
            {isError ? (
                <Alert severity="error">{errorMessage}</Alert>
            ) : (
                <>
                    <TableContainer sx={{ maxHeight: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={style}>Sr.</TableCell>
                                    <TableCell style={style}>Name</TableCell>
                                    <TableCell style={style}>Type</TableCell>
                                    <TableCell style={style}>Share</TableCell>
                                    <TableCell style={style}>Email</TableCell>
                                    <TableCell style={style}>Mobile</TableCell>
                                    <TableCell style={style}>CNIC</TableCell>
                                    <TableCell style={style}>Address</TableCell>
                                    <TableCell style={style}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow
                                        key={index}
                                        hover
                                        sx={{
                                            '&:last-child td': { border: 0 },
                                            backgroundColor: isSelf(row)
                                                ? '#e8f5e9'  // Apna row green highlight
                                                : row?.type === STAFF_TYPES.partner ? '#f0f0d2' : 'transparent'
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {row?.fullname}
                                                {isSelf(row) && (
                                                    <Chip label="You" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{row?.type}</TableCell>
                                        <TableCell>{row?.share}</TableCell>
                                        <TableCell>{row?.email}</TableCell>
                                        <TableCell>{row?.mobile}</TableCell>
                                        <TableCell>{row?.cnic}</TableCell>
                                        <TableCell>{row?.address}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleEditOpen(row)}>
                                                        <EditIcon fontSize="small" sx={iconStyle} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={isSelf(row) ? 'Apna account delete nahi kar sakte' : 'Delete'}>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(row)}
                                                            disabled={isSelf(row)}
                                                        >
                                                            <DeleteIcon fontSize="small" sx={{ color: isSelf(row) ? '#ccc' : '#d32f2f' }} />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[500, 1000]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Edit Staff
                        {editStaff && isSelf(editStaff) && (
                            <Chip label="Your Account" size="small" color="success" />
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
                    {editStaff && isSelf(editStaff) && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LockIcon fontSize="small" />
                                Aap apna Role aur Type nahi badal sakte — sirf profile info update ho sakti hai
                            </Box>
                        </Alert>
                    )}
                    {editStaff && (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Full Name</InputLabel>
                                    <OutlinedInput
                                        label="Full Name"
                                        value={editStaff.fullname}
                                        onChange={(e) => setEditStaff({ ...editStaff, fullname: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Email</InputLabel>
                                    <OutlinedInput
                                        label="Email"
                                        value={editStaff.email}
                                        onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>New Password (optional)</InputLabel>
                                    <OutlinedInput
                                        label="New Password (optional)"
                                        type="password"
                                        value={editStaff.password}
                                        onChange={(e) => setEditStaff({ ...editStaff, password: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Mobile</InputLabel>
                                    <OutlinedInput
                                        label="Mobile"
                                        value={editStaff.mobile}
                                        onChange={(e) => setEditStaff({ ...editStaff, mobile: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>CNIC</InputLabel>
                                    <OutlinedInput
                                        label="CNIC"
                                        value={editStaff.cnic}
                                        onChange={(e) => setEditStaff({ ...editStaff, cnic: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Address</InputLabel>
                                    <OutlinedInput
                                        label="Address"
                                        value={editStaff.address}
                                        onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Staff Type — apna type nahi badal sakta */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth disabled={isSelf(editStaff)}>
                                    <InputLabel>Staff Type</InputLabel>
                                    <Select
                                        label="Staff Type"
                                        value={['partner', 'staff', 'orgStaff', 'orgAdmin'].includes(editStaff.type) ? editStaff.type : ''}
                                        onChange={(e) => setEditStaff({ ...editStaff, type: e.target.value })}
                                    >
                                        <MenuItem value="orgAdmin">Org Admin</MenuItem>
                                        <MenuItem value="orgStaff">Org Staff</MenuItem>
                                        <MenuItem value="partner">Partner</MenuItem>
                                        <MenuItem value="staff">Staff</MenuItem>
                                    </Select>
                                    {isSelf(editStaff) && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <LockIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">Apna type nahi badal sakte</Typography>
                                        </Box>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Share</InputLabel>
                                    <OutlinedInput
                                        label="Share"
                                        type="number"
                                        value={editStaff.share}
                                        onChange={(e) => setEditStaff({ ...editStaff, share: e.target.value })}
                                        disabled={editStaff.type === 'staff' || editStaff.type === 'orgStaff'}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Role assign — apna role nahi badal sakta, system roles nahi dikhte */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth disabled={isSelf(editStaff)}>
                                    <InputLabel>Assign Role (Optional)</InputLabel>
                                    <Select
                                        label="Assign Role (Optional)"
                                        value={editStaff.roleId || ''}
                                        onChange={(e) => setEditStaff({ ...editStaff, roleId: e.target.value })}
                                    >
                                        <MenuItem value="">-- No Role --</MenuItem>
                                        {roles.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {isSelf(editStaff) && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <LockIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">Apna role nahi badal sakte</Typography>
                                        </Box>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleEditClose} variant="outlined">Cancel</Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={editLoading}
                        sx={{ backgroundColor: primaryColor, '&:hover': { backgroundColor: primaryColor } }}
                    >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}