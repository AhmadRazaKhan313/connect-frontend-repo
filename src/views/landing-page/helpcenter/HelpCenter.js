import { TextFieldsOutlined } from '@mui/icons-material';
import { Grid, TextareaAutosize, TextField } from '@mui/material';
import React from 'react';
import '../services/style.css';

const latlng = {
    lat: 29.5435837,
    lng: 71.627328
};

function HelpCenter() {
    const apiParams = `center=${latlng.lat},${latlng.lng}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7C${latlng.lat},${latlng.lng}&key=AIzaSyDU9pVFGuro4RhRsg0iorK6JGzXmqrP6mY`;
    const apiURL = `https://maps.googleapis.com/maps/api/staticmap?${apiParams}`;

    return (
        <div className="services">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <div className="heading">
                        Contact <span>Us</span>
                    </div>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField fullWidth variant="outlined" type="text" label="Full Name" placeholder="Enter Full Name" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField fullWidth variant="outlined" type="email" label="Email" placeholder="Enter EMail" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField fullWidth variant="outlined" type="text" label="Phone Number" placeholder="Enter Phone Number" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                type="text"
                                label="Message"
                                placeholder="Enter Message"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <img src={apiURL} alt="Google Map" style={{ height: '100%', width: '100%' }} />
                </Grid>
            </Grid>
        </div>
    );
}

export default HelpCenter;
