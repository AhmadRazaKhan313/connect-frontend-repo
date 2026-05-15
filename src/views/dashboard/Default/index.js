import { useEffect, useState } from 'react';
import PlatformDashboard from './PlatformDashboard';
import jwt from 'jwtservice/jwtService';

// material-ui
import { FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';

// project imports
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import { gridSpacing } from 'store/constant';
import IspGrandSummaryCard from './IspGrandSummaryCard';
import RemainingProfitCard from './RemainingProfitCard';
import PartnerGrandSummaryCard from './PartnerGrandSummaryCard';
import { STAFF_TYPES } from 'utils/Constants';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const MASTER_ORG_ID = '69e6ea81f25b8158cf1c62ac';

const MyDivider = () => {
    return (
        <div
            style={{ width: '100%', height: '1.5px', backgroundColor: '#BEBEBE', borderRadius: '20px', margin: '30px 10px 10px 30px' }}
        ></div>
    );
};

const Dashboard = () => {
    const [isLoading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [ispsData, setIspsData] = useState([]);
    const [partnersExpenses, setPartnersExpenses] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [companyExpense, setCompanyExpense] = useState(0);
    const [companyProfit, setCompanyProfit] = useState(0);
    const [partnersTotalExpense, setPartnersTotalExpense] = useState(0);
    const [totalRemainingProfit, setTotalRemainingProfit] = useState(0);
    const [totalPendingAmount, setTotalPendingAmount] = useState(0);
    const [totalExtraIncome, setTotalExtraIncome] = useState(0);
    const [totalNumberOfCompletedEntries, setTotalNumberOfCompletedEntries] = useState(0);
    const [totalNumberOfPendingEntries, setTotalNumberOfPendingEntries] = useState(0);

    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);

    // ✅ FIX: Check inside component so jwt.getUser() returns correct value at render time
    const isMasterOrg = jwt.getUser()?.organizationId === MASTER_ORG_ID;
    if (isMasterOrg) return <PlatformDashboard />;

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            getSummary(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear]);

    const getSummary = (month, year) => {
        setLoading(true);
        jwt.getSummary({ month, year })
            .then((res) => {
                setIspsData(res?.data?.ispsData);
                setPartnersExpenses(res?.data?.partnersExpenses);
                setTotalIncome(res?.data?.totalIncome);
                setCompanyExpense(res?.data?.companyExpense);
                setCompanyProfit(res?.data?.companyProfit);
                setPartnersTotalExpense(res?.data?.partnersTotalExpense);
                setTotalRemainingProfit(res?.data?.totalRemainingProfit);
                setTotalPendingAmount(res?.data?.totalPendingAmount);
                setTotalExtraIncome(res?.data?.totalExtraIncome);
                setTotalNumberOfCompletedEntries(res?.data?.totalNumberOfCompletedEntries);
                setTotalNumberOfPendingEntries(res?.data?.totalNumberOfPendingEntries);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} xs={12} md={6} lg={3} xl={3}>
                                <Select
                                    fullWidth
                                    sx={{ height: '100%' }}
                                    value={selectedMonth}
                                    onChange={(event) => setSelectedMonth(event.target.value)}
                                >
                                    <MenuItem value="1">January</MenuItem>
                                    <MenuItem value="2">February</MenuItem>
                                    <MenuItem value="3">March</MenuItem>
                                    <MenuItem value="4">April</MenuItem>
                                    <MenuItem value="5">May</MenuItem>
                                    <MenuItem value="6">June</MenuItem>
                                    <MenuItem value="7">July</MenuItem>
                                    <MenuItem value="8">August</MenuItem>
                                    <MenuItem value="9">September</MenuItem>
                                    <MenuItem value="10">October</MenuItem>
                                    <MenuItem value="11">November</MenuItem>
                                    <MenuItem value="12">December</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6} lg={3} xl={3}>
                                <Select
                                    fullWidth
                                    sx={{ height: '100%' }}
                                    value={selectedYear}
                                    onChange={(event) => setSelectedYear(event.target.value)}
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <MyDivider />
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} xs={12} md={6} lg={4} xl={4}>
                                <FormControl fullWidth>
                                    <InputLabel> Active Users </InputLabel>
                                    <OutlinedInput type="text" value={totalNumberOfCompletedEntries} label="Active Users" disabled />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6} lg={4} xl={4}>
                                <FormControl fullWidth>
                                    <InputLabel> Pending Users </InputLabel>
                                    <OutlinedInput type="text" value={totalNumberOfPendingEntries} label="Pending Users" disabled />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6} lg={4} xl={4}>
                                <FormControl fullWidth>
                                    <InputLabel> Total Users </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        value={totalNumberOfCompletedEntries + totalNumberOfPendingEntries}
                                        label="Total Users"
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <MyDivider />
                    <>
                        {ispsData.map((data, index) => (
                            <Grid key={index} item xl={3} lg={4} md={6} sm={12} xs={12}>
                                <IspGrandSummaryCard isLoading={isLoading} data={data} />
                            </Grid>
                        ))}
                    </>
                    <MyDivider />
                    <Grid container item spacing={2}>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard isLoading={isLoading} title="Entry Income" total={totalIncome} />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard isLoading={isLoading} title="Extra Income" total={totalExtraIncome} />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard isLoading={isLoading} title="Total Income" total={+totalIncome + +totalExtraIncome} />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard isLoading={isLoading} title="Company Expense" total={companyExpense} />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard
                                isLoading={isLoading}
                                title="Company Profit"
                                total={+totalIncome + +totalExtraIncome - companyExpense}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={4} xl={3}>
                            <TotalIncomeDarkCard isLoading={isLoading} title="Partners Expense" total={partnersTotalExpense} />
                        </Grid>
                    </Grid>
                    <MyDivider />
                    <Grid container item spacing={2}>
                        <Grid item xs={12} md={6}>
                            <RemainingProfitCard
                                color="green"
                                isLoading={isLoading}
                                title="Total Remaining Profit"
                                total={+totalIncome + +totalExtraIncome - companyExpense - partnersTotalExpense}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RemainingProfitCard
                                color="red"
                                isLoading={isLoading}
                                title="Total Pending Amount"
                                total={totalPendingAmount}
                            />
                        </Grid>
                    </Grid>
                    <MyDivider />
                    <>
                        {(jwt.getUser()?.type === STAFF_TYPES.partner
                            ? partnersExpenses.filter((item) => item?.partnerId === jwt.getUser()?.id)
                            : partnersExpenses
                        ).map((data, index) => (
                            <Grid key={index} item xl={3} lg={4} md={6} sm={12} xs={12}>
                                <PartnerGrandSummaryCard isLoading={isLoading} data={data} companyIncome={+totalIncome + +totalExtraIncome - companyExpense} />
                            </Grid>
                        ))}
                    </>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;