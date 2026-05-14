import jwt from 'jwtservice/jwtService';
import React, { useState, useEffect, useCallback } from 'react';
import { AppContextProvider } from './AppContext';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';

function AppContextContainer({ children }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState([]);
    const [smsBalance, setSmsBalance] = useState('');
    const [ispSelected, setIspSelected] = useState('');
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    const [orgColors, setOrgColors] = useState({ primaryColor: null, secondaryColor: null });

    // Bug fix: orgBranding missing tha — LogoSection ke liye
    const [orgBranding, setOrgBranding] = useState({ logo: null, name: null });

    const location = useLocation();
    const navigate = useNavigate();

    const syncUserFromDB = useCallback(async () => {
        // Bug fix: getAccessToken() exist nahi — getToken() use karo
        const token = jwt.getToken();
        if (!token) return;

        // Bug fix: reload cooldown — infinite loop risk khatam
        const lastReload = parseInt(localStorage.getItem('_lastReload') || '0');
        const now = Date.now();

        try {
            const res = await jwt.getMe();
            if (!res?.data?.user) return;

            const { user, isHQ, subdomain, permissions } = res.data;

            const freshUser = {
                ...user,
                isHQ: isHQ || false,
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
                currentUser?.role   !== freshUser?.role   ||
                currentUser?.type   !== freshUser?.type   ||
                currentUser?.roleId !== freshUser?.roleId ||
                currentPerms        !== freshPerms;

            // Sirf reload karo agar role change hua AND 10 second se zyada guzar gaye
            if (roleChanged && (now - lastReload) > 10000) {
                localStorage.setItem('_lastReload', String(now));
                window.location.reload();
            }
        } catch (err) {
            if (err?.response?.status === 401) {
                jwt.logout?.();
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        syncUserFromDB();
    }, [location.pathname]);

    useEffect(() => {
        getSmsBalance();
        fetchOrgInfo(); // Bug fix: ek hi function — double API call khatam
    }, []);

    // Bug fix: fetchOrgColors + fetchOrgBranding merge — single API call
    // Bug fix: early return hata diya — cache sirf instant render ke liye
    const fetchOrgInfo = async () => {
        const user = jwt.getUser();
        if (!user || user?.type === 'platformSuperAdmin') return;
        const orgId = user?.organizationId;
        if (!orgId) return;

        // Cache se instant render (flash avoid)
        const cachedColors   = localStorage.getItem('org_colors');
        const cachedBranding = localStorage.getItem('org_branding');
        if (cachedColors)   { try { setOrgColors(JSON.parse(cachedColors));     } catch (_) {} }
        if (cachedBranding) { try { setOrgBranding(JSON.parse(cachedBranding)); } catch (_) {} }

        // API hamesha call hogi — early return NAHI
        try {
            const res = await jwt.getOrganization(orgId);
            const org = res?.data;
            if (!org) return;

            const colors = {
                primaryColor:   org.primaryColor   || null,
                secondaryColor: org.secondaryColor || null,
            };
            setOrgColors(colors);
            localStorage.setItem('org_colors', JSON.stringify(colors));

            const branding = { logo: org.logo || null, name: org.name || null };
            setOrgBranding(branding);
            localStorage.setItem('org_branding', JSON.stringify(branding));

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
