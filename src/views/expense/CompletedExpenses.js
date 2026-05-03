import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { STAFF_TYPES } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { getColorByStatus, getPaymentMethodNameByKey } from 'utils/Functions';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import useAppContext from 'context/useAppContext';
import ImageModal from 'ui-component/ImageModal';

function createData(id, image, staff, paymentMethod, tid, amount, date, details, spentBy, status, deleted) {
    return { id, image, staff, paymentMethod, tid, amount, date, details, spentBy, status, deleted };
}

export default function CompletedExpenses() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [spentBy, setSpentBy] = useState('company');
    const [total, setTotal] = useState(0);

    const [openModal, setOpenModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [partners, setPartners] = useState([]);

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    const { tableHeaderStyle: style } = useOrgTheme();

    useEffect(() => {
        setFilters(['staff', 'paymentMethod', 'tid', 'amount', 'date', 'details', 'spentBy', 'status']);
        getAllPartners();
    }, []);

    useEffect(() => {
        getCompletedExpenses();
    }, [startDate, endDate, spentBy]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            modalImage !== '' && setOpenModal(true);
        }, 1);
    }, [modalImage]);

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

    const getAllPartners = () => {
        try {
            setIsLoading(true);
            jwt.getAllPartners()
                .then((res) => {
                    setIsLoading(false);
                    setErrorMessage('');
                    setIsError(false);
                    setPartners(res?.data);
                })
                .catch((err) => {
                    setErrorMessage(err?.response?.data?.message);
                    setIsError(true);
                    setIsLoading(false);
                });
        } catch (e) {
            setErrorMessage(e.message);
            setIsError(true);
        }
    };

    const getCompletedExpenses = () => {
        setIsLoading(true);
        jwt.getCompletedExpenses({
            startDate: startDate,
            endDate: endDate,
            spentBy
        })
            .then((res) => {
                let rowsData = [];
                res?.data?.expenses?.map((item) =>
                    rowsData.push(
                        createData(
                            item?._id || item?.id,
                            item?.image,
                            item?.staff?.fullname,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.tid,
                            item?.amount,
                            moment(item?.date).format('DD/MM/YYYY'),
                            item?.details,
                            item?.spentBy,
                            item?.status,
                            item?.deleted
                        )
                    )
                );
                setData(rowsData);
                setTotal(res?.data?.total);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const deleteExpense = (id) => {
        jwt.deleteExpense(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Expense Deleted');
                getCompletedExpenses();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const reverseExpense = (id) => {
        jwt.reverseExpense(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Expense Reversed');
                getCompletedExpenses();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const reviveExpense = (id) => {
        jwt.reviveExpense(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Expense Revived');
                getCompletedExpenses();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
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
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormControl fullWidth>
                            <InputLabel> Spent By </InputLabel>
                            <Select
                                id="spentBy"
                                name="spentBy"
                                type="text"
                                value={spentBy}
                                onChange={(e) => setSpentBy(e.target.value)}
                                label="Spent By"
                            >
                                <MenuItem value="company">Company</MenuItem>
                                {partners.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                        {item.fullname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
            <Grid container spacing={2} sx={{ mt: 1 }}>
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
                                            <TableCell style={style}>Spent By</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>TID/Cheque#</TableCell>
                                            <TableCell style={style}>Status</TableCell>
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
                                                <TableRow
                                                    
                                                    key={index}
                                                >
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{index + 1}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }} onClick={() => setModalImage(row?.image)}>
                                                        <img
                                                            src={row?.image}
                                                            alt="Img"
                                                            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.date}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.details}</TableCell>
                                                    {typeof row?.spentBy === 'string' ? (
                                                        <TableCell style={{ color: getColorByStatus(row) }}>Company</TableCell>
                                                    ) : (
                                                        <TableCell style={{ color: getColorByStatus(row) }}>{row?.spentBy?.fullname}</TableCell>
                                                    )}
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.status !== 'pending' ? row?.amount : 0}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.paymentMethod}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.tid}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.status}</TableCell>
                                                    <TableCell style={{ color: getColorByStatus(row) }}>{row?.staff}</TableCell>
                                                    {(row?.deleted === true || row?.status === 'deleted') && (
                                                        <TableCell
                                                            style={{ color: getColorByStatus(row) }}
                                                            colSpan={2}
                                                            sx={{ textAlign: 'center' }}
                                                        >
                                                            N/A
                                                        </TableCell>
                                                    )}
                                                    {jwt.getUser()?.type === STAFF_TYPES.admin &&
                                                        row?.deleted === false &&
                                                        row?.status !== 'deleted' && (
                                                            <>
                                                                {row?.status !== 'reversed' ? (
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="warning"
                                                                            onClick={() => reverseExpense(row?.id)}
                                                                        >
                                                                            Reverse
                                                                        </Button>
                                                                    </TableCell>
                                                                ) : (
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="success"
                                                                            sx={{ color: 'white' }}
                                                                            onClick={() => reviveExpense(row?.id)}
                                                                        >
                                                                            Revive
                                                                        </Button>
                                                                    </TableCell>
                                                                )}
                                                                <TableCell>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        onClick={() => deleteExpense(row?.id)}
                                                                    >
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
                            <ImageModal open={openModal} handleClose={handleClose} image={modalImage} />
                        </>
                    )
                )}
            </Paper>
        </>
    );
}
