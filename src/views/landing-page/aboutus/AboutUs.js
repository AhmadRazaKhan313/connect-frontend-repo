import { Grid } from '@mui/material';
import React from 'react';
import AboutUsCard from './AboutUsCard';
import './style.css';

const Cards = [
    {
        isMiddle: false,
        title: 'OUR MISSION',
        message: `A company that endeavors to set the highest standards in corporate ethics in serving the society.
        A market leader by providing quality and superior service to our customers, while learning from their feedback to set even higher standards for our services.
        A company that continuously enhances its superior technological competence to provide innovative solutions to cater to customer needs.
        A company which combines its people, technology, management systems, and market opportunities to achieve profitable growth while providing fair returns to its shareholders.`
    },
    {
        isMiddle: true,
        title: 'Who We Are',
        message: `Connect Communications was established in 2005 and we are the largest Internet & Data Service Provider in Karachi. We offer various services to the corporate and consumer sectors. We have built a stronghold for various network services on local link, such as super nodes, LAN and MAN to provide maximum performance and high scalability to take full advantage of gigabit network. Connect is determined to provide state of the art broadband communication to each house-hold as well as corporate customer at a very low cost. Connect network is widely used in demanding markets such as service provider, financial services, media, health care, retail and government.`
    },
    {
        isMiddle: false,
        title: 'OUR VISION',
        message: `Connect vision is to be the premier provider of high bandwidth and data connectivity solutions for customers who desire a private, flexible and scalable transport infrastructure 
        Our people are our most important asset. We differentiate ourselves though our customer focused attention to detail and our ability to listen and act on customer requirements.
        We will maintain the financial deal discipline that requires us to understand the deal metrics of every deal we enter.
        We will grow and expand within our niche by taking advantage of the many opportunities that exist for providing customers with purpose built networks that meet their ever expanding connectivity needs.`
    }
];

function AboutUs() {
    return (
        <>
            <div className="aboutus">
                <div className="heading">
                    About <span>Us</span>
                </div>
                <p className="text">
                    Connect Communications is not only a name or a company. It is a passion, a desire to grow, serve and excel. It's success
                    story is carved by untiring hard work, dedication and adherence of its team members to its cause. For our clients
                    Connect Communications is a name which stands for its commitment, customer care, integrity, product knowledge, trouble
                    free services and competitive prices.
                </p>
            </div>
            <Grid container spacing={1} sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {Cards.map((item, index) => {
                    return (
                        <Grid key={index} item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <AboutUsCard title={item?.title} isMiddle={item?.isMiddle} message={item?.message} />
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
}

export default AboutUs;
