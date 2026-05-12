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

    const [orgColors, setOrgColors] = useState({
        primaryColor: null,
        secondaryColor: null
    });

    const location = useLocation();
    const navigate = useNavigate();

    // ── Sync fresh user from DB ──────────────────────────────────────────────
    // Fetches /auth/me on every route change + every 30s
    // Ensures role changes take effect immediately without re-login
    const syncUserFromDB = useCallback(async () => {
        const token = jwt.getAccessToken?.() || localStorage.getItem('accessToken');
        if (!token) return; // not logged in

        try {
            const res = await jwt.getMe();
            if (!res?.data?.user) return;

            const { user, isHQ, subdomain } = res.data;

            // Build fresh user object same as login
            const freshUser = { ...user, isHQ: isHQ || false, subdomain };

            // Get current stored user
            const currentUser = jwt.getUser();

            // If role/type changed — update localStorage + force sidebar refresh
            if (
                currentUser?.role !== freshUser?.role ||
                currentUser?.type !== freshUser?.type ||
                currentUser?.roleId !== freshUser?.roleId
            ) {
                jwt.setUser(freshUser);
                // Force full page reload to rebuild menu and clear stale state
                window.location.reload();
            }
        } catch (err) {
            // 401 = token expired/invalid → redirect to login
            if (err?.response?.status === 401) {
                jwt.logout?.();
                navigate('/login');
            }
        }
    }, [navigate]);

    // Sync on every route change
    useEffect(() => {
        syncUserFromDB();
    }, [location.pathname]);

    // 30s interval hata diya — route change pe hi sync kaafi hai
    // Interval se unnecessary reloads hote the

    // ── Initial setup ────────────────────────────────────────────────────────
    useEffect(() => {
        getSmsBalance();
        fetchOrgColors();
    }, []);

    const fetchOrgColors = async () => {
        const user = jwt.getUser();
        if (!user) return;
        const orgId = user?.organizationId;
        if (!orgId) return;
        if (user?.type === 'platformSuperAdmin') return;

        const cached = localStorage.getItem('org_colors');
        if (cached) {
            try {
                setOrgColors(JSON.parse(cached));
                return;
            } catch (_) {}
        }

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
        data, setData,
        filteredData, setFilteredData,
        filters, setFilters,
        smsBalance, getSmsBalance,
        ispSelected, setIspSelected,
        startDate, setStartDate,
        endDate, setEndDate,
        orgColors, fetchOrgColors,
        syncUserFromDB,
    };

    return <AppContextProvider value={contextValues}>{children}</AppContextProvider>;
}

export default AppContextContainer;