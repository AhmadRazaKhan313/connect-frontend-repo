import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, FormControlLabel, Grid, IconButton,
    InputLabel, OutlinedInput, Tooltip, Typography, Chip, Divider, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import jwt from 'jwtservice/jwtService';
import useAppContext from 'context/useAppContext';
import useOrgTheme from 'utils/useOrgTheme';

function createData(id, fullname, roleId, roleName, isPartner, share, email, cnic, mobile, address) {
    return { id, fullname, roleId: roleId || '', roleName: roleName || '', isPartner: !!isPartner, share, email, cnic, mobile, address };
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

    const currentUser = jwt.getUser();
    const currentUserId = currentUser?.id || currentUser?._id;
    const iconStyle = { color: primaryColor };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const loadRoles = () => {
        jwt.getCustomRoles().then((res) => setRoles(res?.data || [])).catch(() => setRoles([]));
    };

    const loadStaff = () => {
        setIsLoading(true);
        jwt.getAllStaffs()
            .then((res) => {
                setIsLoading(false);
                const rowsData = res?.data?.map((item) =>
                    createData(
                        item?.id, item?.fullname,
                        item?.roleId?.id || item?.roleId, item?.roleId?.name,
                        item?.isPartner, item?.share,
                        item?.email, item?.cnic, item?.mobile, item?.address
                    )
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
        setFilters(['fullname', 'cnic', 'mobile', 'email', 'address']);
        loadRoles();
        loadStaff();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const isSelf = (row) => row.id === currentUserId;

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
        const payload = {
            fullname: editStaff.fullname,
            email: editStaff.email,
            mobile: editStaff.mobile,
            cnic: editStaff.cnic,
            address: editStaff.address
        };
        // Access fields  not editable for your own account.
        if (!isSelf(editStaff)) {
            payload.roleId = editStaff.roleId;
            payload.isPartner = editStaff.isPartner;
            payload.share = editStaff.isPartner ? Number(editStaff.share || 0) : 0;
        }
        if (editStaff.password && editStaff.password.trim()) {
            payload.password = editStaff.password;
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
            alert('You cannot delete your own account');
            return;
        }
        if (!window.confirm(`Delete staff "${row.fullname}"?`)) return;
        jwt.deleteStaff(row.id)
            .then(() => loadStaff())
            .catch((err) => alert(err?.response?.data?.message || 'Delete failed'));
    };

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
                                    <TableCell style={style}>Role</TableCell>
                                    <TableCell style={style}>Partner</TableCell>
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
                                            backgroundColor: isSelf(row) ? '#e8f5e9' : row?.isPartner ? '#f0f0d2' : 'transparent'
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {row?.fullname}
                                                {isSelf(row) && <Chip label="You" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {row?.roleName ? <Chip label={row.roleName} size="small" variant="outlined" /> : '-'}
                                        </TableCell>
                                        <TableCell>{row?.isPartner ? 'Yes' : '-'}</TableCell>
                                        <TableCell>{row?.isPartner ? row?.share : '-'}</TableCell>
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
                                                <Tooltip title={isSelf(row) ? 'You cannot delete your own account' : 'Delete'}>
                                                    <span>
                                                        <IconButton size="small" onClick={() => handleDelete(row)} disabled={isSelf(row)}>
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
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Edit Staff
                        {editStaff && isSelf(editStaff) && <Chip label="Your Account" size="small" color="success" />}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
                    {editStaff && isSelf(editStaff) && (
                        <Alert severity="info" sx={{ mb: 2 }}>You cannot change your own role  only profile info.</Alert>
                    )}
                    {editStaff && (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Full Name</InputLabel>
                                    <OutlinedInput label="Full Name" value={editStaff.fullname}
                                        onChange={(e) => setEditStaff({ ...editStaff, fullname: e.target.value })} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Email</InputLabel>
                                    <OutlinedInput label="Email" value={editStaff.email}
                                        onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>New Password (optional)</InputLabel>
                                    <OutlinedInput label="New Password (optional)" type="password" value={editStaff.password}
                                        onChange={(e) => setEditStaff({ ...editStaff, password: e.target.value })} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Mobile</InputLabel>
                                    <OutlinedInput label="Mobile" value={editStaff.mobile}
                                        onChange={(e) => setEditStaff({ ...editStaff, mobile: e.target.value })} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>CNIC</InputLabel>
                                    <OutlinedInput label="CNIC" value={editStaff.cnic}
                                        onChange={(e) => setEditStaff({ ...editStaff, cnic: e.target.value })} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Address</InputLabel>
                                    <OutlinedInput label="Address" value={editStaff.address}
                                        onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })} />
                                </FormControl>
                            </Grid>

                            {!isSelf(editStaff) && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <FormControl fullWidth>
                                            <InputLabel id="edit-role-label">Role</InputLabel>
                                            <Select
                                                labelId="edit-role-label"
                                                label="Role"
                                                value={editStaff.roleId || ''}
                                                onChange={(e) => setEditStaff({ ...editStaff, roleId: e.target.value })}
                                            >
                                                {roles.map((r) => (
                                                    <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={editStaff.isPartner}
                                                    onChange={(e) => setEditStaff({ ...editStaff, isPartner: e.target.checked, share: e.target.checked ? editStaff.share : 0 })}
                                                />
                                            }
                                            label="Financial Partner (profit sharing)"
                                        />
                                    </Grid>
                                    {editStaff.isPartner && (
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Profit Share %</InputLabel>
                                                <OutlinedInput label="Profit Share %" type="number" value={editStaff.share}
                                                    inputProps={{ min: 0, max: 100 }}
                                                    onChange={(e) => setEditStaff({ ...editStaff, share: e.target.value })} />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </>
                            )}
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
