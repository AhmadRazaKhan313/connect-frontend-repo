import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, FormControl, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { STAFF_TYPES } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { getPaymentMethodNameByKey } from 'utils/Functions';
import { useNavigate } from 'react-router';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import useAppContext from 'context/useAppContext';
import ImageModal from 'ui-component/ImageModal';

function createData(id, image, staff, paymentMethod, spentBy, tid, amount, date, details, status) {
    return { id, image, staff, paymentMethod, spentBy, tid, amount, date, details, status };
}

export default function PendingExpenses() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(0);

    const [openModal, setOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    const { tableHeaderStyle: style } = useOrgTheme();

    useEffect(() => {
        setTimeout(() => {
            modalImage !== '' && setOpenModal(true);
        }, 1);
    }, [modalImage]);

    useEffect(() => {
        setFilters(['staff', 'paymentMethod', 'tid', 'amount', 'date', 'details', 'status']);
    }, []);

    useEffect(() => {
        getPendingExpenses();
    }, [startDate, endDate]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleClose = () => {
        setModalImage('');
        setOpenModal(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getPendingExpenses = () => {
        setIsLoading(true);
        jwt.getPendingExpenses({
            startDate: startDate,
            endDate: endDate
        })
            .then((res) => {
                let rowsData = [];
                res?.data?.expenses?.map((item) =>
                    rowsData.push(
                        createData(
                            item?.id || item?._id,
                            item?.image,
                            item?.staff?.fullname,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.spentBy?.fullname,
                            item?.tid,
                            item?.amount,
                            moment(item?.date).format('DD/MM/YYYY'),
                            item?.details,
                            item?.status
                        )
                    )
                );
                setData(rowsData);
                setTotal(res?.data?.total);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setTotal(0);
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const deleteExpense = (id) => {
        setIsLoading(true);
        jwt.deleteExpense(id)
            .then((res) => {
                setIsLoading(false);
                setIsError(false);
                alert('Expense Deleted');
                getPendingExpenses();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const approveExpense = (id) => {
        setIsLoading(true);
        jwt.approveExpense(id)
            .then((res) => {
                setIsLoading(false);
                setIsError(false);
                alert('Expense Approved');
                getPendingExpenses();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const DeleteButton = ({ id }) => {
        return (
            <Button variant="contained" color="error" onClick={() => deleteExpense(id)}>
                Delete
            </Button>
        );
    };

    const ApproveButton = ({ id }) => {
        return (
            <Button variant="contained" color="warning" onClick={() => approveExpense(id)}>
                Approve
            </Button>
        );
    };

    return (
        <>
            <form style={{ marginTop: '15px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <FormControl fullWidth>
                            <InputLabel> Start Date </InputLabel>
                            <OutlinedInput
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={moment(startDate).format('YYYY-MM-DD')}
                                onChange={(e) => setStartDate(e.target.value)}
                                label="Start Date"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <FormControl fullWidth>
                            <InputLabel> End Date </InputLabel>
                            <OutlinedInput
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={moment(endDate).format('YYYY-MM-DD')}
                                onChange={(e) => setEndDate(e.target.value)}
                                label="End Date"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
            <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={12}>
                    <TotalIncomeDarkCard isLoading={false} title="Total Expense" total={total} />
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
                {isLoading && <h3>Loading...!</h3>}
                {isError ? (
                    <Alert severity="error">{errorMessage}</Alert>
                ) : (
                    !isLoading && (
                        <>
                            <TableContainer sx={{ maxHeight: 'auto' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={style}>Sr.</TableCell>
                                            <TableCell style={style}>Image</TableCell>
                                            <TableCell style={style}>Date</TableCell>
                                            <TableCell style={style}>Details</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Spent By</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>TID/Cheque#</TableCell>
                                            <TableCell style={style}>Staff</TableCell>
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                <TableCell colSpan={2} style={style} align="center">
                                                    Action
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow tabIndex={-1} key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell onClick={() => setModalImage(row?.image)}>
                                                        <img src={row?.image} alt="Img" style={{ width: '50px', height: '50px' }} />
                                                    </TableCell>
                                                    <TableCell>{row?.date}</TableCell>
                                                    <TableCell>{row?.details}</TableCell>
                                                    <TableCell>{row?.amount}</TableCell>
                                                    <TableCell>{row?.spentBy}</TableCell>
                                                    <TableCell>{row?.paymentMethod}</TableCell>
                                                    <TableCell>{row?.tid}</TableCell>
                                                    <TableCell>{row?.staff}</TableCell>
                                                    {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                        <>
                                                            <TableCell>
                                                                <ApproveButton id={row?.id} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <DeleteButton id={row?.id} />
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
                            <ImageModal open={openModal} handleClose={handleClose} image={modalImage} />
                        </>
                    )
                )}
            </Paper>
        </>
    );
}
