import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export default function ServiceCard({ image, text, heading, height, headingfont, textFont }) {
    const useStyles = makeStyles({
        container: {
            position: 'relative',
            width: '100%',
            height: height,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: '24px',
            marginTop: '10px',
            boxSizing: 'border-box',
            borderRadius: '20px'
        },
        heading: {
            margin: 0,
            fontSize: headingfont,
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            lineHeight: '100%',
            marginBottom: '20px'
        },
        text: {
            margin: 0,
            fontSize: textFont,
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            lineHeight: '100%',
            marginBottom: '20px'
        },
        image: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '-1',
            borderRadius: '20px'
        }
    });

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <img src={image} className={classes.image} alt="Background" />
            <h1 className={classes.heading}>{heading}</h1>
            <p className={classes.text}>{text}</p>
        </div>
    );
}
