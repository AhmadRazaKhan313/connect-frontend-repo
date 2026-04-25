import { Grid } from '@mui/material';
import React from 'react';
import ServiceCard from './ServiceCard';
import './style.css';
import bg1 from '../../../assets/images/bg1.jpg';
import bg2 from '../../../assets/images/bg2.jpg';
import bg3 from '../../../assets/images/bg3.jpg';
import bg4 from '../../../assets/images/bg4.jpg';

function Services() {
    return (
        <div className="services">
            <div className="heading">
                Our <span>Services</span>
            </div>
            <p className="text">
                Our job is to serve you best internet at good prices , high resolution tv cable services, HD ip camera and security cameras
                installation.
            </p>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ServiceCard
                        height="100%"
                        headingfont="4vw"
                        textFont="2vw"
                        image={bg1}
                        heading="HIGH SPEED CONNECTIVITY"
                        text="We delivers the best, fastest and most reliable internet service at all time and you can choose from wide range of available speeds."
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ServiceCard
                                height="100%"
                                headingfont="4vw"
                                textFont="2vw"
                                image={bg2}
                                heading="Internet Protocol Television"
                                text="We delivers the best, clear and most high resolution iptv and cable service at your home televisions."
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ServiceCard
                                height="100%"
                                headingfont="2vw"
                                textFont="1.4vw"
                                image={bg3}
                                heading="NEXT GENERATION TECHNOLOGY"
                                text="We utilize the latest technology and tools to gain more superiority and effectiveness. Our approach to technology allows us to provide you with complete and reliable solutions."
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ServiceCard
                                height="100%"
                                headingfont="2vw"
                                textFont="1.4vw"
                                image={bg4}
                                heading="IP CAMERA INSTALLATION"
                                text="We install the latest technology of cameras to gain more superiority and effectiveness."
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Services;
