import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { STAFF_TYPES } from '../../utils/Constants';
import { useLocation, useNavigate } from 'react-router';
import { Alert, Button } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import useOrgTheme from 'utils/useOrgTheme';

function createData(id, ispId, color, name, bandwidth, rateType, ratePerDay, purchaseRate, saleRate, validity) {
    return { id, ispId, color, name, bandwidth, rateType, ratePerDay, purchaseRate, saleRate, validity };
}

export default function AllPackages() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);
    const [rows, setRows] = useState([]);
    const [companyName, setCompanyName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { tableHeaderStyle: style } = useOrgTheme();

    const { primaryColor } = useOrgTheme();
    const { ispId = '', color = primaryColor } = useLocation().state;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setIsLoading(true);
        jwt.getAllPackages(ispId)
            .then((res) => {
                setIsLoading(false);
                setCompanyName(res?.data[0]?.isp?.name);
                let rowsData = [];
                res?.data?.map((item) =>
                    rowsData.push(
                        createData(
                            item?.id || item?._id,
                            item?.isp?.id,
                            item?.isp?.color,
                            item?.name,
                            item?.bandwidth,
                            item?.rateType === 'day' ? 'Per Day' : 'Per Month',
                            item?.ratePerDay,
                            item?.purchaseRate,
                            item?.saleRate,
                            item?.validity
                        )
                    )
                );
                setRows(rowsData);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    }, []);
    const EditButton = ({ id, color, data }) => {
        return (
            <Button
                variant="contained"
                color="warning"
                onClick={() => navigate(`/dashboard/edit-package/${id}`, { state: { color, data } })}
            >
                Edit
            </Button>
        );
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
                                    <TableCell colSpan={9} sx={{ fontSize: 'xx-large', backgroundColor: color, color: 'white' }}>
                                        {companyName}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={style}> Sr. </TableCell>
                                    <TableCell style={style}> Name </TableCell>
                                    <TableCell style={style}> Bandwidth </TableCell>
                                    <TableCell style={style}> Rate Type </TableCell>
                                    <TableCell style={style}> Rate/Day </TableCell>
                                    <TableCell style={style}> Purchase Rate </TableCell>
                                    <TableCell style={style}> Sale Rate </TableCell>
                                    <TableCell style={style}> Validity </TableCell>
                                    {jwt.getUser()?.type === STAFF_TYPES.admin && <TableCell style={style}> Action </TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row?.name}</TableCell>
                                            <TableCell>{row?.bandwidth}</TableCell>
                                            <TableCell>{row?.rateType}</TableCell>
                                            <TableCell>{row?.ratePerDay}</TableCell>
                                            <TableCell>{row?.purchaseRate}</TableCell>
                                            <TableCell>{row?.saleRate}</TableCell>
                                            <TableCell>{row?.validity}</TableCell>
                                            {jwt.getUser()?.type === STAFF_TYPES.admin && (
                                                <TableCell>
                                                    <EditButton id={row?.id} color={row?.color} data={row} />
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
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Paper>
    );
}
