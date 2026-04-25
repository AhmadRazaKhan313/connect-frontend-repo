import jwt from 'jwtservice/jwtService';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AppContextProvider } from './AppContext';
import moment from 'moment';

function AppContextContainer({ children }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState([]);
    const [smsBalance, setSmsBalance] = useState('');
    const [ispSelected, setIspSelected] = useState('');
    const [orgFeatures, setOrgFeatures] = useState(null);
    const [orgColors, setOrgColors] = useState({
        primaryColor: '#f07911',
        secondaryColor: '#424242'
    });
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    useEffect(() => {
        const role = jwt.getUser()?.role;
        const token = jwt.getToken();
        if (token && role !== 'platformSuperAdmin') {
            getSmsBalance();
            loadOrgFeatures();
        }
    }, []);

    const getSmsBalance = async () => {
        jwt.getSmsBalance()
            .then((res) => {
                setSmsBalance((+res?.data?.smsBalance).toFixed(2));
            })
            .catch((err) => console.log(err));
    };

    const loadOrgFeatures = async () => {
        const user = jwt.getUser();
        if (user?.organizationId) {
            jwt.getOrganizationById(user.organizationId)
                .then((res) => {
                    setOrgFeatures(res?.data?.features);
                    // Organization colors set karo
                    if (res?.data?.primaryColor) {
                        setOrgColors({
                            primaryColor: res?.data?.primaryColor || '#f07911',
                            secondaryColor: res?.data?.secondaryColor || '#424242'
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const contextValues = {
        data, setData,
        filteredData, setFilteredData,
        filters, setFilters,
        smsBalance, getSmsBalance,
        ispSelected, setIspSelected,
        startDate, setStartDate,
        endDate, setEndDate,
        orgFeatures,
        orgColors
    };

    return <AppContextProvider value={contextValues}>{children}</AppContextProvider>;
}

export default AppContextContainer;