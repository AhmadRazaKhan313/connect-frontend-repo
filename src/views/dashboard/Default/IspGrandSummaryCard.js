import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonIspGrandSummaryCard from 'ui-component/cards/Skeleton/IspGrandSummaryCard';

// ─── Icons (MUI SvgIcon wrappers for Tabler-style inline SVGs) ───────────────

const IconWifi = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0z" fill="currentColor" stroke="none"/>
        <path d="M2 9.5C5.5 5.5 18.5 5.5 22 9.5"/>
        <path d="M5 13c1.94-2.1 7.06-2.1 9 0"/>
        <path d="M8.5 16.5c.94-1.05 3.06-1.05 4 0"/>
    </svg>
);

const statIcons = {
    'Total Income':   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    'Total Invoice':  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    'Total Profit':   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    'Invoice Sent':   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    'Total Balance':  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    'Total Pending':  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const hexToRgb = (hex = '#000000') => {
    const c = hex.replace('#', '');
    const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
    const n = parseInt(full, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const CardWrapper = styled(MainCard)(({ cardcolor }) => ({
    overflow: 'hidden',
    borderRadius: 16,
    border: `0.5px solid rgba(${hexToRgb(cardcolor)}, 0.35)`,
    padding: 0,
    '& .MuiCardContent-root': { padding: 0 },
}));

const CardTop = styled(Box)(({ cardcolor }) => ({
    backgroundColor: cardcolor,
    padding: '20px 20px 22px',
    position: 'relative',
    overflow: 'hidden',
    // blob 1
    '&::after': {
        content: '""',
        position: 'absolute',
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.09)',
        top: -70, right: -50,
        pointerEvents: 'none',
    },
    // blob 2
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 130, height: 130,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        bottom: -40, left: -20,
        pointerEvents: 'none',
    },
}));

const IspIconWrap = styled(Box)({
    width: 42, height: 42,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: '#fff',
});

const StatPill = styled(Box)({
    background: 'rgba(255,255,255,0.13)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: '10px 12px',
    display: 'flex', flexDirection: 'column', gap: 2,
});

const CardFooter = styled(Box)(({ theme }) => ({
    padding: '12px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderTop: `0.5px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const StatusDot = styled(Box)({
    width: 7, height: 7,
    borderRadius: '50%',
    background: '#22c55e',
    flexShrink: 0,
    display: 'inline-block',
});

// ─── Component ────────────────────────────────────────────────────────────────

const IspGrandSummaryCard = ({ isLoading, data }) => {
    const color = data?.isp?.color || '#1565c0';

    const fmt = (val) =>
        (+val).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const stats = [
        { label: 'Total Income',  value: fmt(data?.totalIncome) },
        { label: 'Total Invoice', value: fmt(data?.totalInvoice) },
        { label: 'Total Profit',  value: fmt(data?.totalProfit) },
        { label: 'Invoice Sent',  value: fmt(data?.totalInvoiceSent) },
        { label: 'Total Balance', value: fmt(data?.totalBalance) },
        { label: 'Total Pending', value: fmt(data?.totalEntryPending) },
    ];

    const now = new Date();
    const monthYear = now.toLocaleString('en-PK', { month: 'long', year: 'numeric' });

    if (isLoading) return <SkeletonIspGrandSummaryCard />;

    return (
        <CardWrapper cardcolor={color} border={false} content={false}>
            <CardTop cardcolor={color}>

                {/* ── Header: icon + name + subtitle ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 2.25, position: 'relative', zIndex: 1 }}>
                    <IspIconWrap>
                        <IconWifi />
                    </IspIconWrap>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography sx={{
                            fontSize: '1.15rem', fontWeight: 500, color: '#fff',
                            letterSpacing: '-0.01em', lineHeight: 1.2,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {data?.isp?.name}
                        </Typography>
                        <Typography sx={{
                            fontSize: 11, color: 'rgba(255,255,255,0.65)',
                            letterSpacing: '0.04em', mt: '2px',
                        }}>
                            Internet Service Provider
                        </Typography>
                    </Box>
                </Box>

                {/* ── 2-column stats grid ── */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {stats.map(({ label, value }) => (
                        <StatPill key={label}>
                            {/* label row with icon */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Box sx={{ color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                    {statIcons[label]}
                                </Box>
                                <Typography sx={{
                                    fontSize: 10, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.68)',
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>
                                    {label}
                                </Typography>
                            </Box>
                            {/* value */}
                            <Typography sx={{
                                fontSize: '1.05rem', fontWeight: 500, color: '#fff',
                                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                            }}>
                                {value}
                            </Typography>
                        </StatPill>
                    ))}
                </Box>

            </CardTop>

            {/* ── Footer ── */}
            <CardFooter>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusDot />
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Active</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'inherit', opacity: 0.5 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{monthYear}</Typography>
                </Box>
            </CardFooter>
        </CardWrapper>
    );
};

IspGrandSummaryCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.shape({
        isp: PropTypes.shape({
            name:  PropTypes.string,
            color: PropTypes.string,
        }),
        totalIncome:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalInvoice:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalProfit:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalInvoiceSent:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalBalance:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalEntryPending: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default IspGrandSummaryCard;