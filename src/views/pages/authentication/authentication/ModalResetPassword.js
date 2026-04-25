import { Box, Button, Typography, Modal, FormControl, InputLabel, OutlinedInput, Alert } from '@mui/material';
import jwt from 'jwtservice/jwtService';
import { useEffect } from 'react';
import { useState } from 'react';

function ModalResetPassword({ open, handleClose }) {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        jwt.resetPassword({ email })
            .then((res) => {
                setErrorMessage('');
                setIsError(false);
                setIsLoading(false);
                setIsSent(true);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const close = () => {
        setEmail('');
        setIsLoading(false);
        setIsError(false);
        setIsSent(false);
        setErrorMessage('');
        setTimeout(() => {
            handleClose();
        }, 1);
    };

    return (
        <Modal open={open} onClose={close} aria-labelledby="modal-title" aria-describedby="modal-description">
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
                <Typography id="modal-title" variant="h6" component="h2">
                    Reset Password
                </Typography>
                {isLoading ? (
                    <Typography id="modal-title" variant="h6" component="h2">
                        Sending Email...!
                    </Typography>
                ) : (
                    <>
                        {isSent ? (
                            <>
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Email sent to: {email}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button onClick={close} color="error" variant="contained" sx={{ mr: 2 }}>
                                        Close
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <form onSubmit={onSubmit}>
                                {isError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {errorMessage}
                                    </Alert>
                                )}
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel> Enter Email </InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        inputProps={{}}
                                        sx={{ marginTop: '2px' }}
                                        required
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={close} color="error" variant="contained" sx={{ mr: 2 }}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary" variant="contained">
                                            Reset
                                        </Button>
                                    </Box>
                                </FormControl>
                            </form>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
}

export default ModalResetPassword;
