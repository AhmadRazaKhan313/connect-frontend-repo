import React from 'react';

// makeStyles v4 se inline styles pe migrate kiya — koi MUI dependency nahi
export default function ServiceCard({ image, text, heading, height, headingfont, textFont }) {
    return (
        <div style={{
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
        }}>
            <img
                src={image}
                alt="Background"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: '-1',
                    borderRadius: '20px'
                }}
            />
            <h1 style={{
                margin: 0,
                fontSize: headingfont,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                lineHeight: '100%',
                marginBottom: '20px'
            }}>
                {heading}
            </h1>
            <p style={{
                margin: 0,
                fontSize: textFont,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                lineHeight: '100%',
                marginBottom: '20px'
            }}>
                {text}
            </p>
        </div>
    );
}