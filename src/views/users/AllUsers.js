import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button } from '@mui/material';
import { STAFF_TYPES } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import ModalReceipt from '../entries/ModalReceipt';
import useAppContext from 'context/useAppContext';
import { useNavigate } from 'react-router';

function createData(id, sr, fullname, userId, cnic, mobile, email, address, organizationId) {
    return { id, sr, fullname, userId, cnic, mobile, email, address, organizationId };
}

export default function AllUsers() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');
    const [organizations, setOrganizations] = useState([]);

    const navigate = useNavigate();
    const isPlatformSuperAdmin = jwt.getUser()?.role === 'platformSuperAdmin';

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    const { tableHeaderStyle: style } = useOrgTheme();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleModalOpen = (id) => {
        setIdToDelete(id);
        setTimeout(() => {
            setOpenModal(true);
        }, 1);
    };

    const editUser = (user) => {
        navigate('/dashboard/edit-user', { state: { user } });
    };

    // Organization name dhundne ka helper
    const getOrgName = (organizationId) => {
        const org = organizations.find((o) => o.id === organizationId || o._id === organizationId);
        return org ? org.name : '—';
    };

    useEffect(() => {
        setFilters(['fullname', 'userId', 'cnic', 'mobile', 'email', 'address']);
        getAllUsers();
        if (isPlatformSuperAdmin) {
            jwt.getAllOrganizations()
                .then((res) => setOrganizations(res?.data || []))
                .catch((err) => console.log(err));
        }
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const getAllUsers = () => {
        setIsLoading(true);
        jwt.getAllUsers()
            .then((res) => {
                setIsLoading(false);
                let rowsData = [];
                res?.data?.map((item, index) =>
                    rowsData.push(
                        createData(
                            item?.id,
                            index + 1,
                            item?.fullname,
                            item?.userId,
                            item?.cnic,
                            item?.mobile,
                            item?.email,
                            item?.address,
                            item?.organizationId
                        )
                    )
                );
                setData(rowsData);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const deleteUser = () => {
        if (idToDelete && idToDelete !== '') {
            jwt.deleteUser(idToDelete)
                .then((res) => {
                    setErrorMessage('');
                    setIsError(false);
                    handleModalClose();
                    alert('User Deleted');
                    getAllUsers();
                })
                .catch((err) => {
                    setErrorMessage(err?.response?.data?.message);
                    setIsError(true);
                    setIsLoading(false);
                });
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                    <TableCell style={style}>User Id</TableCell>
                                    <TableCell style={style}>Name</TableCell>
                                    <TableCell style={style}>CNIC</TableCell>
                                    <TableCell style={style}>Mobile</TableCell>
                                    <TableCell style={style}>Email</TableCell>
                                    <TableCell style={style}>Address</TableCell>
                                    {/* Organization column — sirf platformSuperAdmin ko */}
                                    {isPlatformSuperAdmin && (
                                        <TableCell style={style}>Organization</TableCell>
                                    )}
                                    <TableCell style={style} colSpan={2} sx={{ textAlign: 'center' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{row?.sr}</TableCell>
                                            <TableCell>{row?.userId}</TableCell>
                                            <TableCell>{row?.fullname}</TableCell>
                                            <TableCell>{row?.cnic}</TableCell>
                                            <TableCell>{row?.mobile}</TableCell>
                                            <TableCell>{row?.email}</TableCell>
                                            <TableCell>{row?.address}</TableCell>
                                            {/* Organization name */}
                                            {isPlatformSuperAdmin && (
                                                <TableCell>{getOrgName(row?.organizationId)}</TableCell>
                                            )}
                                            <TableCell>
                                                <Button variant="contained" color="success" onClick={() => editUser(row)}>
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                <>
                                                    <TableCell>
                                                        <Button variant="contained" color="error" onClick={() => handleModalOpen(row?.id)}>
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
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
            <ModalReceipt
                open={openModal}
                handleClose={handleModalClose}
                title="Delete User"
                message="Are You Sure You Want To Delete This User ?"
                action={deleteUser}
            />
        </Paper>
    );
}