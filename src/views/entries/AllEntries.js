import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { getPaymentMethodNameByKey } from 'utils/Functions';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import { STAFF_TYPES } from '../../utils/Constants';
import useAppContext from 'context/useAppContext';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Receipt from './Receipt';
import { useNavigate } from 'react-router';

function createData(
    data,
    id,
    sr,
    entryDate,
    userId,
    packageName,
    paymentMethod,
    tid,
    ipType,
    staticIp,
    staticIpSaleRate,
    saleRate,
    expiryDate
) {
    return { data, id, sr, entryDate, userId, packageName, paymentMethod, tid, ipType, staticIp, staticIpSaleRate, saleRate, expiryDate };
}

export default function AllEntries() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [isps, setIsps] = useState([]);
    const [total, setTotal] = useState(0);
    const { primaryColor: colorBg, tableHeaderStyle: style } = useOrgTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dataToPrint, setDataToPrint] = useState({});

    const { 
        data, 
        setData, 
        filteredData, 
        setFilteredData, 
        setFilters, 
        ispSelected,
        setIspSelected,
        startDate,
        setStartDate,
        endDate,
        setEndDate 
    } = useAppContext();

    
    const navigate = useNavigate();

    useEffect(() => {
        setFilters(['entryDate', 'userId', 'packageName', 'paymentMethod', 'tid', 'saleRate', 'expiryDate']);
        getIsps();
    }, []);

    useEffect(() => {
        ispSelected !== '' && getEntries();
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

    const getEntries = () => {
        setIsLoading(true);
        jwt.getAllCompletedEntries({
            isp: ispSelected,
            startDate: startDate,
            endDate: endDate
        })
            .then((res) => {
                let rowsData = [];
                res?.data?.entries?.map((item, index) =>
                    rowsData.push(
                        createData(
                            item,
                            item?.id || item?._id,
                            index + 1,
                            moment.utc(item?.entryDate).format('DD/MM/YYYY'),
                            item?.userId,
                            item?.package?.name,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.tid,
                            item?.ipType,
                            item?.staticIp,
                            item?.staticIpSaleRate,
                            item?.saleRate,
                            moment.utc(item?.expiryDate).format('DD/MM/YYYY')
                        )
                    )
                );
                setData(rowsData);
                setTotal(res?.data?.total);
                setColorBg(res?.data?.entries[0]?.isp?.color);
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

    const deleteEntry = (id) => {
        jwt.deleteEntry(id)
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                alert('Entry Deleted');
                ispSelected !== '' && getEntries();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'User Invoice',
        pageStyle: `@media print { @page { size: A5; margin-top: 0; }, .header, .footer, .letterhead { display: none } }`,
        copyStyles: true,
        scale: 0.8,
        onAfterPrint: () => {
            setDataToPrint({});
        },
        onPrintError: () => {
            setDataToPrint({});
        },
        onError: () => {
            setDataToPrint({});
        }
    });

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
                                            <TableCell style={style}>Date</TableCell>
                                            <TableCell style={style}>User Id</TableCell>
                                            <TableCell style={style}>Package</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>TID</TableCell>
                                            <TableCell style={style}>IP Type</TableCell>
                                            <TableCell style={style}>Static IP</TableCell>
                                            <TableCell style={style}>IP Rate</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Expiry Date</TableCell>
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                <TableCell style={style} colSpan={3}>
                                                    Action
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row?.entryDate}</TableCell>
                                                    <TableCell>{row?.userId}</TableCell>
                                                    <TableCell>{row?.packageName}</TableCell>
                                                    <TableCell>{row?.paymentMethod}</TableCell>
                                                    <TableCell>{row?.tid}</TableCell>
                                                    <TableCell>{row?.ipType}</TableCell>
                                                    <TableCell>{row?.staticIp}</TableCell>
                                                    <TableCell>{row?.staticIpSaleRate}</TableCell>
                                                    <TableCell>{row?.saleRate}</TableCell>
                                                    <TableCell>{row?.expiryDate}</TableCell>
                                                    {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                        <>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() => {
                                                                        setDataToPrint(row?.data);
                                                                        setTimeout(() => {
                                                                            handlePrint();
                                                                        }, 0);
                                                                    }}
                                                                >
                                                                    Print
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={() => navigate('/dashboard/edit-entry', { state: row })}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => deleteEntry(row?.id)}
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
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ mt: 2, display: 'none' }}>
                    <Receipt ref={componentRef} data={dataToPrint} />
                </Grid>
            </Grid>
        </>
    );
}
