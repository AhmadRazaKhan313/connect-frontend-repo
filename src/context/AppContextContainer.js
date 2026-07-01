import jwt from 'jwtservice/jwtService';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppContextProvider } from './AppContext';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';
import storage from 'utils/storage';

function AppContextContainer({ children }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState([]);
    const [smsBalance, setSmsBalance] = useState('');
    const [ispSelected, setIspSelected] = useState('');
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [orgColors, setOrgColors] = useState({ primaryColor: null, secondaryColor: null });
    const [orgBranding, setOrgBranding] = useState({ logo: null, name: null });

    const location = useLocation();
    const navigate = useNavigate();

    // In-flight guard — concurrent calls prevent karta hai
    const isSyncing = useRef(false);

    const syncUserFromDB = useCallback(async () => {
        if (isSyncing.current) return;

        const token = jwt.getToken();
        if (!token) return;

        isSyncing.current = true;

        const lastReload = storage.getInt('_lastReload');
        const now = Date.now();

        try {
            const res = await jwt.getMe();
            if (!res?.data?.user) return;

            const { user, isPlatform, subdomain, permissions } = res.data;

            const freshUser = {
                ...user,
                isPlatform: isPlatform || false,
                subdomain,
                ...(permissions !== null && permissions !== undefined
                    ? { permissions }
                    : {}),
            };

            const currentUser = jwt.getUser();
            const currentPerms = JSON.stringify(currentUser?.permissions ?? null);
            const freshPerms   = JSON.stringify(freshUser?.permissions   ?? null);

            jwt.setUser(freshUser);

            const roleChanged =
                currentUser?.roleId !== freshUser?.roleId ||
                currentPerms      !== freshPerms;

            if (roleChanged && (now - lastReload) > 10000) {
                storage.set('_lastReload', String(now));
                window.location.reload();
            }
        } catch (err) {
            if (err?.response?.status === 401) {
                jwt.logout?.();
                navigate('/login');
            }
        } finally {
            isSyncing.current = false;
        }
    }, [navigate]);

    useEffect(() => {
        syncUserFromDB();
    }, [location.pathname, syncUserFromDB]);

    useEffect(() => {
        getSmsBalance();
        fetchOrgInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrgInfo = async () => {
        const user = jwt.getUser();
        if (!user || user?.isPlatform === true) return;
        const orgId = user?.organizationId;
        if (!orgId) return;

        // Cache se instant render (flash avoid)
        const cachedColors   = storage.getJSON('org_colors');
        const cachedBranding = storage.getJSON('org_branding');
        if (cachedColors)   setOrgColors(cachedColors);
        if (cachedBranding) setOrgBranding(cachedBranding);

        try {
            const res = await jwt.getOrganization(orgId);
            const org = res?.data;
            if (!org) return;

            const colors = {
                primaryColor:   org.primaryColor   || null,
                secondaryColor: org.secondaryColor || null,
            };
            setOrgColors(colors);
            storage.setJSON('org_colors', colors);

            const branding = { logo: org.logo || null, name: org.name || null };
            setOrgBranding(branding);
            storage.setJSON('org_branding', branding);

        } catch (err) {
            console.log('Org info fetch failed:', err?.message);
        }
    };

    const fetchOrgColors = fetchOrgInfo; // backward compat alias

    const getSmsBalance = async () => {
        jwt.getSmsBalance()
            .then((res) => setSmsBalance((+res?.data?.smsBalance).toFixed(2)))
            .catch((err) => console.log(err));
    };

    const contextValues = {
        data, setData,
        filteredData, setFilteredData,
        filters, setFilters,
        smsBalance, getSmsBalance,
        ispSelected, setIspSelected,
        startDate, setStartDate,
        endDate, setEndDate,
        orgColors, fetchOrgColors,
        orgBranding, setOrgBranding, fetchOrgInfo,
        syncUserFromDB,
    };

    return <AppContextProvider value={contextValues}>{children}</AppContextProvider>;
}

export default AppContextContainer;