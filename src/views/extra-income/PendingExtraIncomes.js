import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, FormControl, Grid, InputLabel, OutlinedInput } from '@mui/material';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { getPaymentMethodNameByKey } from 'utils/Functions';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import { STAFF_TYPES } from '../../utils/Constants';
import useAppContext from 'context/useAppContext';
import { useNavigate } from 'react-router';

function createData(data, id, sr, date, category, userId, amount, paymentMethod, tid, details) {
    return { data, id, sr, date, category, userId, amount, paymentMethod, tid, details };
}

export default function PendingExtraIncomes() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [total, setTotal] = useState(0);
    const { primaryColor: colorBg, tableHeaderStyle: style } = useOrgTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    
    const navigate = useNavigate();

    useEffect(() => {
        setFilters(['date', 'category', 'userId', 'amount', 'paymentMethod', 'tid', 'details']);
    }, []);

    useEffect(() => {
        getExtraIncomes();
    }, [startDate, endDate]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getExtraIncomes = () => {
        setIsLoading(true);
        jwt.getAllPendingExtraIncome({ startDate, endDate })
            .then((res) => {
                let rowsData = [];
                res?.data?.extraIncomes?.map((item, index) =>
                    rowsData.push(
                        createData(
                            item,
                            item?.id || item?._id,
                            index + 1,
                            moment(item?.date).format('DD/MM/YYYY'),
                            item?.category,
                            item?.userId,
                            item?.amount,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.tid,
                            item?.details
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

    const deleteExtraIncome = (id) => {
        jwt.deleteExtraIncome(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Extra Income Deleted');
                getExtraIncomes();
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
                </Grid>
            </form>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <TotalIncomeDarkCard isLoading={false} total={total} />
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 5 }}>
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
                                            <TableCell style={style}>Date</TableCell>
                                            <TableCell style={style}>User Id</TableCell>
                                            <TableCell style={style}>Categroy</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>TID</TableCell>
                                            <TableCell style={style}>Details</TableCell>
                                            {/* {jwt.getUser()?.type === STAFF_TYPES.admin && ( */}
                                            <TableCell style={{ ...style, textAlign: 'center' }} colSpan={2}>
                                                Action
                                            </TableCell>
                                            {/* )} */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row?.date}</TableCell>
                                                    <TableCell>{row?.userId}</TableCell>
                                                    <TableCell>{row?.category}</TableCell>
                                                    <TableCell>{row?.amount}</TableCell>
                                                    <TableCell>{row?.paymentMethod}</TableCell>
                                                    <TableCell>{row?.tid}</TableCell>
                                                    <TableCell>{row?.details}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="warning"
                                                            onClick={() =>
                                                                navigate('/dashboard/edit-extra-income', {
                                                                    state: { data: row?.data, action: 'complete' }
                                                                })
                                                            }
                                                        >
                                                            Complete
                                                        </Button>
                                                    </TableCell>
                                                    {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                        <>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => deleteExtraIncome(row?.id)}
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
                        </>
                    )
                )}
            </Paper>
        </>
    );
}
