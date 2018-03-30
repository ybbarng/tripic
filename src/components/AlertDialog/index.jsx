import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const AlertDialog = (properties) => { 
  confirmAlert({
    customUI: ({onClose}) => {
      const { title, message, confirmLabel, cancelLabel, onConfirm } = properties; 
      return (
        <Dialog
          open={true}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
            {cancelLabel}
            </Button>
            <Button onClick={() => {
              onClose();
              onConfirm();
            }} color="primary" autoFocus>
            {confirmLabel}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  })
};

export default AlertDialog;
