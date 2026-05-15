import { useTheme } from '@mui/material/styles';
import useAppContext from 'context/useAppContext';

// ── useOrgTheme ───────────────────────────────────────────────────────────────
// Returns org primary/secondary colors + table styles matching DashStack design

const useOrgTheme = () => {
    const theme = useTheme();
    const { orgColors } = useAppContext();

    const primaryColor = orgColors?.primaryColor || theme.palette.primary.main || '#4361ee';
    const secondaryColor = orgColors?.secondaryColor || theme.palette.secondary.main || '#424242';

    // Clean white header — bold uppercase labels, bottom border only (matches image)
    const tableHeaderStyle = {
        backgroundColor: '#ffffff',
        color: '#374151',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderBottom: `2px solid ${primaryColor}`,
        whiteSpace: 'nowrap',
        padding: '14px 16px'
    };

    // Status badge helper
    const getStatusBadge = (status) => {
        const map = {
            completed:  { bg: '#d1fae5', color: '#065f46' },
            active:     { bg: '#d1fae5', color: '#065f46' },
            processing: { bg: '#ede9fe', color: '#5b21b6' },
            pending:    { bg: '#ede9fe', color: '#5b21b6' },
            rejected:   { bg: '#fee2e2', color: '#991b1b' },
            inactive:   { bg: '#fee2e2', color: '#991b1b' },
            reversed:   { bg: '#fee2e2', color: '#991b1b' },
            deleted:    { bg: '#fee2e2', color: '#991b1b' },
            'on hold':  { bg: '#fef3c7', color: '#92400e' },
            'in transit': { bg: '#dbeafe', color: '#1e40af' }
        };
        const key = (status || '').toLowerCase();
        return map[key] || { bg: '#f3f4f6', color: '#374151' };
    };

    return {
        primaryColor,
        secondaryColor,
        tableHeaderStyle,
        getStatusBadge
    };
};

export default useOrgTheme;
