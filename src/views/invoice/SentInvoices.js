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
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import useOrgTheme from 'utils/useOrgTheme';
import moment from 'moment';
import { getPaymentMethodNameByKey } from 'utils/Functions';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import useAppContext from 'context/useAppContext';

function createData(id, sr, isp, date, amount, paymentMethod, tid, comments) {
    return { id, sr, isp, date, amount, paymentMethod, tid, comments };
}

export default function SentInvoices() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [isps, setIsps] = useState([]);
    const [ispSelected, setIspSelected] = useState('');
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [total, setTotal] = useState(0);
    const { primaryColor: colorBg, tableHeaderStyle: style } = useOrgTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    

    useEffect(() => {
        setFilters(['isp', 'date', 'amount', 'paymentMethod', 'tid', 'comments']);
        getIsps();
    }, []);

    useEffect(() => {
        ispSelected !== '' && getInvoices();
    }, [startDate, endDate, ispSelected]);

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

    const getInvoices = () => {
        setIsLoading(true);
        jwt.getSentInvoices({
            isp: ispSelected,
            startDate: startDate,
            endDate: endDate
        })
            .then((res) => {
                let rowsData = [];
                res?.data?.invoices?.map((item, index) =>
                    rowsData.push(
                        createData(
                            item?.id || item?._id,
                            index + 1,
                            item?.isp?.name,
                            moment(item?.date).format('DD/MM/YYYY'),
                            item?.amount,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.tid,
                            item?.comments
                        )
                    )
                );
                setData(rowsData);
                setTotal(res?.data?.total);
                setColorBg(res?.data?.invoices[0]?.isp?.color);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const getIsps = () => {
        jwt.getAllIsps()
            .then((res) => {
                setIsps(res?.data);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const deleteInvoice = (id) => {
        jwt.deleteInvoice(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Invoice Deleted');
                ispSelected !== '' && getInvoices();
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
                            <InputLabel> Select ISP </InputLabel>
                            <Select
                                id="isp"
                                name="isp"
                                type="text"
                                value={ispSelected}
                                onChange={(event) => setIspSelected(event.target.value)}
                                label="Select ISP"
                            >
                                {isps.map((isp, index) => (
                                    <MenuItem key={index} value={isp.id}>
                                        {isp.name}
                                    </MenuItem>
                                ))}
                            </Select>
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
                ) : ispSelected === '' ? (
                    <Alert severity="error">Please Select an ISP</Alert>
                ) : (
                    !isLoading && (
                        <>
                            <TableContainer sx={{ maxHeight: 'auto' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={style}>Sr.</TableCell>
                                            <TableCell style={style}>ISP</TableCell>
                                            <TableCell style={style}>Date</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>Check#/TID</TableCell>
                                            <TableCell style={style}>Comments</TableCell>
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && <TableCell style={style}>Action</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{row?.sr}</TableCell>
                                                    <TableCell>{row?.isp}</TableCell>
                                                    <TableCell>{row?.date}</TableCell>
                                                    <TableCell>{row?.amount}</TableCell>
                                                    <TableCell>{row?.paymentMethod}</TableCell>
                                                    <TableCell>{row?.tid}</TableCell>
                                                    <TableCell>{row?.comments}</TableCell>
                                                    {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                        <TableCell>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => deleteInvoice(row?.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </TableCell>
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
