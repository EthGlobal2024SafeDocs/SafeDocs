import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { Handler } from '../../../shared/types/components';
import Button from '../../atoms/Button/Button';

import styles from './DialogModal.module.css';
import Title from '../../atoms/Title/Title';

const style = {
  position: 'absolute',
  borderRadius: '14px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type DialogModalProps = {
  title?: string;
  text: string;
  isOpen: boolean;
  onClose?: Handler;
}

const DialogModal = ({
  title,
  text,
  isOpen,
  onClose
}: DialogModalProps) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        // slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <div className={styles.contentWrapper}>
              {title && (
                <Title tag='h5' label={title} fontWeight='light' />
              )}
              <Title tag='h6' label={text} fontWeight='light' />
              <Button className={styles.button} type="button" onClick={handleClose}>Ok</Button>
            </div>
          </Box>
        </Fade>
      </Modal>
  );
};

export default DialogModal;
