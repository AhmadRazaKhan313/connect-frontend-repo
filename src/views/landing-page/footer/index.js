import { Grid, Typography } from '@mui/material';
import Logo from '../../../assets/images/logo1.png';

function Footer() {
    const style = {
        listStyle: 'none',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '20px',
        color: '#9E9D9D',
        margin: '7px 0px 5px 0px'
    };
    return (
        <div style={{ backgroundColor: 'black', marginTop: '80px', height: 'auto' }}>
            <Grid container spacing={2} sx={{ mt: 2, pl: 10, pr: 10, pt: 5, pb: 10 }}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <img src={Logo} alt="Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                    <Typography color="white" sx={{ mt: 2, width: '70%', lineHeight: '20px' }}>
                        Connect Lodhran delivers the best, fastest and most reliable internet service and iptv service at all time and you
                        can choose from wide range of available speeds.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Typography variant="h3" color="white">
                                Services
                            </Typography>
                            <li style={style}>High Speed Connectivity</li>
                            <li style={style}>TV Cable Services</li>
                            <li style={style}>Iptv Services</li>
                            <li style={style}>Ip Camera Installation</li>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Typography variant="h3" color="white">
                                Contact
                            </Typography>
                            <li style={style}>+923005592282</li>
                            <li style={style}>+923005592265</li>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                            <Typography variant="h3" color="white">
                                Email
                            </Typography>
                            <li style={style}>Info@connectcommunicationslodhran.com</li>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Typography variant="h3" color="white">
                                Address
                            </Typography>
                            <li style={style}>Sony Cable Office, Chowk Rafique Shah Bukhari, Lodhran</li>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '90%', height: '2px', border: '1px solid #9E9D9D' }}></div>
                <div
                    style={{
                        margin: '30px 0px 30px 0px',
                        color: '#9E9D9D',
                        textAlign: 'center'
                    }}
                >
                    &copy; {new Date().getFullYear()} Connect Communication Lodhran. All RIghts Reserved
                </div>
            </div>
        </div>
    );
}

export default Footer;