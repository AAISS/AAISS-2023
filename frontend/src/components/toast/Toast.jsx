import { useCallback } from 'react';
import { Close } from '@mui/icons-material';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import Slide from '@mui/material/Slide';

const CloseButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <Close />
  </IconButton>
);

const alertTypeColorMapping = {
  error: 'var(--error-color)',
  warning: 'var(--warn-color)',
  info: 'var(--info-color)',
  success: 'var(--success-color)',
};

export default function Toast({
  duration = 6000,
  vertical = 'top', //'top', 'bottom'
  horizontal = 'right', //'left', 'center', 'right'
  message = 'fill me',
  alertType = 'success', //'error', 'warning', 'info', 'success',
  open,
  setOpen,
}) {
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Snackbar
      autoHideDuration={duration}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={(props) => <Slide {...props} direction={'right'} />}
      action={<CloseButton />}
    >
      <SnackbarContent
        message={message}
        action={<CloseButton onClick={() => setOpen(false)} />}
        sx={{ bgcolor: alertTypeColorMapping[alertType], color: 'var(--light-text-color)' }}
      />
    </Snackbar>
  );
}
