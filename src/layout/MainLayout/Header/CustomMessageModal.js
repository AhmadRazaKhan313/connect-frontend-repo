import { Box, Button, Typography, Modal, OutlinedInput } from '@mui/material';
import jwt from 'jwtservice/jwtService';
import { useEffect } from 'react';
import { useState } from 'react';

function CustomMessageModal({ open, handleClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setIsLoading(false);
        setIsError(false);
        setErrorMessage('');
    }, [open]);

    const send = () => {
        if (!message || message === '') {
            setErrorMessage('Enter message please');
            setIsError(true);
        } else {
            setErrorMessage('');
            setIsError(false);
            setIsLoading(true);
            jwt.sendCustomMessage({ message })
                .then((res) => {
                    setIsLoading(false);
                    alert('Meesage sent');
                    handleClose();
                })
                .catch((err) => {
                    setErrorMessage(err?.response?.data?.message);
                    setIsLoading(false);
                    setIsError(true);
                });
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    border: 'none',
                    borderColor: 'white',
                    borderRadius: '10px'
                }}
            >
                <Typography id="modal-title" variant="h5" component="h2" sx={{ ml: 1 }}>
                    {isLoading ? <>Sending...!</> : <>Send Custom Message</>}
                </Typography>
                <OutlinedInput
                    fullWidth
                    type="text"
                    multiline={true}
                    rows={5}
                    sx={{ mt: 2, mb: 2 }}
                    placeholder="Enter Custom Message"
                    onChange={(e) => {
                        setErrorMessage('');
                        setIsError(false);
                        setMessage(e.target.value);
                    }}
                />
                {isError && <Box sx={{ color: 'red', mt: 1, mb: 1, ml: 1 }}>{errorMessage}</Box>}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClose} color="error" variant="contained" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={send} color="primary" variant="contained" sx={{ color: 'white' }}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CustomMessageModal;
