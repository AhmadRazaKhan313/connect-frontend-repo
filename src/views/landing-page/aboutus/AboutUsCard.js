function AboutUsCard({ title, message, isMiddle }) {
    return (
        <div
            style={{
                backgroundColor: isMiddle ? '#F28A2E' : '#D9D9D9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                height: isMiddle ? '430px' : '400px'
            }}
        >
            <h1
                style={{
                    color: isMiddle ? 'white' : '#F28A2E',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '3.2vw'
                }}
            >
                {title}
            </h1>
            <p style={{ color: isMiddle ? 'white' : 'black', textAlign: 'justify' }}>{message}</p>
        </div>
    );
}

export default AboutUsCard;
