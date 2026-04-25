import { Box, Button, Typography, Modal } from '@mui/material';

function ModalReceipt({ title, message, open, handleClose, action }) {
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
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClose} color="error" variant="contained" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={action} color="primary" variant="contained">
                        OK
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalReceipt;
