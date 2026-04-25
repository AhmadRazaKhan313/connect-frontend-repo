import { Box, Modal } from '@mui/material';

function ImageModal({ open, handleClose, image }) {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    height: 500,
                    bgcolor: 'background.paper',
                    border: 'none',
                    p: 0.5,
                    borderColor: 'white',
                    borderRadius: '10px'
                }}
            >
                <img src={image} alt="Img" style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
            </Box>
        </Modal>
    );
}

export default ImageModal;
