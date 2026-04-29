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
    InputLabel, MenuItem, OutlinedInput, Select, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { STAFF_TYPES } from 'utils/Constants';
import { useState, useEffect } from 'react';
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
            .then((res) => setRoles(res?.data || []))
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
        const payload = { ...editStaff };
        if (!payload.password) delete payload.password;
        if (!payload.roleId) delete payload.roleId;
        delete payload.id;

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
        if (!window.confirm(`Delete staff "${row.fullname}"?`)) return;
        jwt.deleteStaff(row.id)
            .then(() => loadStaff())
            .catch((err) => alert(err?.response?.data?.message || 'Delete failed'));
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
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
                                        style={{ backgroundColor: row?.type === STAFF_TYPES.partner ? '#f0f0d2' : 'white' }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row?.fullname}</TableCell>
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
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => handleDelete(row)}>
                                                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                                    </IconButton>
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

            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Staff</DialogTitle>
                <DialogContent>
                    {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Staff Type</InputLabel>
                                    <Select
                                        label="Staff Type"
                                        value={['partner', 'staff'].includes(editStaff.type) ? editStaff.type : ''}
                                        onChange={(e) => setEditStaff({ ...editStaff, type: e.target.value })}
                                        sx={{ paddingTop: '10px' }}
                                    >
                                        <MenuItem value="partner">Partner</MenuItem>
                                        <MenuItem value="staff">Staff</MenuItem>
                                    </Select>
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
                                        disabled={editStaff.type === 'staff'}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Assign Role (Optional)</InputLabel>
                                    <Select
                                        label="Assign Role (Optional)"
                                        value={editStaff.roleId || ''}
                                        onChange={(e) => setEditStaff({ ...editStaff, roleId: e.target.value })}
                                        sx={{ paddingTop: '10px' }}
                                    >
                                        <MenuItem value="">-- No Role --</MenuItem>
                                        {roles.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
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