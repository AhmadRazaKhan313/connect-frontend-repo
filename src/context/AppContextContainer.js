import jwt from 'jwtservice/jwtService';
import React, { useState, useEffect } from 'react';
import { AppContextProvider } from './AppContext';
import moment from 'moment';

function AppContextContainer({ children }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState([]);
    const [smsBalance, setSmsBalance] = useState('');
    const [ispSelected, setIspSelected] = useState('');
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    // ── Org theme colors ──────────────────────────────────────
    const [orgColors, setOrgColors] = useState({
        primaryColor: null,
        secondaryColor: null
    });

    useEffect(() => {
        getSmsBalance();
        fetchOrgColors();
        // eslint-disable-next-line
    }, []);

    const fetchOrgColors = async () => {
        const user = jwt.getUser();
        if (!user) return;

        const orgId = user?.organizationId;
        if (!orgId) return;

        // platformSuperAdmin ka koi org nahi hota — skip
        if (user?.type === 'platformSuperAdmin') return;

        // Pehle cached colors check karo localStorage mein
        const cached = localStorage.getItem('org_colors');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setOrgColors(parsed);
                return;
            } catch (_) {}
        }

        // Cache nahi mila toh API se fetch karo
        try {
            const res = await jwt.getOrganization(orgId);
            const org = res?.data;
            if (org?.primaryColor || org?.secondaryColor) {
                const colors = {
                    primaryColor: org.primaryColor || null,
                    secondaryColor: org.secondaryColor || null
                };
                setOrgColors(colors);
                localStorage.setItem('org_colors', JSON.stringify(colors));
            }
        } catch (err) {
            console.log('Org colors fetch failed:', err?.message);
        }
    };

    const getSmsBalance = async () => {
        jwt.getSmsBalance()
            .then((res) => setSmsBalance((+res?.data?.smsBalance).toFixed(2)))
            .catch((err) => console.log(err));
    };

    const contextValues = {
        data,
        setData,
        filteredData,
        setFilteredData,
        filters,
        setFilters,
        smsBalance,
        getSmsBalance,
        ispSelected,
        setIspSelected,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        orgColors,
        fetchOrgColors
    };

    return <AppContextProvider value={contextValues}>{children}</AppContextProvider>;
}

export default AppContextContainer;