import PropTypes from 'prop-types';
import { Box, Card, Typography, Skeleton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import numeral from 'numeral';

const RemainingProfitCard = ({ isLoading, total, title = 'Total', color = 'green' }) => {

    const isProfit = color === 'green';

    const config = isProfit
        ? {
            gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
            lightBg: '#eff6ff',
            iconColor: '#2563eb',
            Icon: AccountBalanceWalletIcon,
            badge: 'PKR',
            badgeBg: 'rgba(255,255,255,0.25)',
          }
        : {
            gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
            lightBg: '#fff7ed',
            iconColor: '#ea580c',
            Icon: PendingActionsIcon,
            badge: 'PKR',
            badgeBg: 'rgba(255,255,255,0.25)',
          };

    if (isLoading) {
        return (
            <Card sx={{ p: 3, borderRadius: '16px', height: 140 }}>
                <Skeleton width="50%" height={20} />
                <Skeleton width="70%" height={48} sx={{ mt: 1 }} />
                <Skeleton width="40%" height={18} sx={{ mt: 1 }} />
            </Card>
        );
    }

    const formatted = numeral(total).format('0,0');
    const isNegative = +total < 0;

    return (
        <Card
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                background: config.gradient,
                position: 'relative',
            }}
        >
            {/* Decorative circles */}
            <Box sx={{
                position: 'absolute', width: 180, height: 180,
                borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                top: -60, right: -40, pointerEvents: 'none'
            }} />
            <Box sx={{
                position: 'absolute', width: 120, height: 120,
                borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                bottom: -30, left: -20, pointerEvents: 'none'
            }} />

            <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    {/* Title + badge */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.875rem', mb: 0.5 }}
                        >
                            {title}
                        </Typography>
                        <Box
                            sx={{
                                display: 'inline-block',
                                px: 1, py: 0.2,
                                borderRadius: '6px',
                                background: config.badgeBg,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: 1
                            }}
                        >
                            PKR
                        </Box>
                    </Box>

                    {/* Icon */}
                    <Box
                        sx={{
                            width: 52, height: 52,
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <config.Icon sx={{ fontSize: '1.6rem', color: '#fff' }} />
                    </Box>
                </Box>

                {/* Amount */}
                <Typography
                    sx={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: isNegative ? '#fef08a' : '#fff',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1
                    }}
                >
                    {isNegative ? '−' : ''} Rs. {numeral(Math.abs(total)).format('0,0')}
                </Typography>

                {/* Divider */}
                <Box sx={{ my: 1.5, height: 1, background: 'rgba(255,255,255,0.2)' }} />

                {/* Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: isNegative ? '#fef08a' : '#86efac',
                        boxShadow: isNegative ? '0 0 6px #fef08a' : '0 0 6px #86efac'
                    }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                        {isProfit
                            ? (isNegative ? 'Loss this period' : 'Net profit after all expenses')
                            : (isNegative ? 'Overpaid' : 'Pending collection from users')
                        }
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

RemainingProfitCard.propTypes = {
    isLoading: PropTypes.bool,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    color: PropTypes.string
};

export default RemainingProfitCard;