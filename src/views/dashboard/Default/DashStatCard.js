import PropTypes from 'prop-types';
import { Box, Card, Typography, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// ── DashStatCard ──────────────────────────────────────────────────────────────
// Exactly matches DashStack design:
// - White card, subtle shadow
// - Label top-left, colored icon top-right
// - Big number
// - Trend text bottom

const DashStatCard = ({ isLoading, title, value, icon: Icon, iconBgColor, iconColor, trend, trendLabel }) => {
    if (isLoading) {
        return (
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'grey.100', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={40} sx={{ mt: 1 }} />
                <Skeleton width="70%" height={18} sx={{ mt: 1 }} />
            </Card>
        );
    }

    const isPositive = trend >= 0;

    return (
        <Card
            sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'grey.100',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                position: 'relative',
                overflow: 'visible'
            }}
        >
            {/* Top row: label + icon */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '0.875rem' }}>
                    {title}
                </Typography>
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        backgroundColor: iconBgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        ml: 1
                    }}
                >
                    <Icon sx={{ fontSize: '1.5rem', color: iconColor }} />
                </Box>
            </Box>

            {/* Big number */}
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', color: 'text.primary', lineHeight: 1.2 }}>
                {value}
            </Typography>

            {/* Trend */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? (
                    <TrendingUpIcon sx={{ fontSize: '1rem', color: '#22c55e' }} />
                ) : (
                    <TrendingDownIcon sx={{ fontSize: '1rem', color: '#ef4444' }} />
                )}
                <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: isPositive ? '#22c55e' : '#ef4444', fontSize: '0.78rem' }}
                >
                    {Math.abs(trend)}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                    {trendLabel}
                </Typography>
            </Box>
        </Card>
    );
};

DashStatCard.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.elementType,
    iconBgColor: PropTypes.string,
    iconColor: PropTypes.string,
    trend: PropTypes.number,
    trendLabel: PropTypes.string
};

DashStatCard.defaultProps = {
    trend: 0,
    trendLabel: 'from last month'
};

export default DashStatCard;
