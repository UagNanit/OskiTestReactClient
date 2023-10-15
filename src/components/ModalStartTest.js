import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Navigate } from "react-router-dom";

export default function ModalStartTest(props) {
  const [open, setOpen] = useState(true);
  const [checFlag, setChecFlag] = useState(false);
  const [redirectFlag, setRedirectFlag] = useState(false);

  const hendleChange = (event) => {
    setChecFlag(event.target.checked);
  };

  const handleClose = () => {
    props.close();
    setOpen(false);
  };

  const handleProceed = () => {
    if (!checFlag) {
      return;
    }
    setRedirectFlag(true);
  };

  if (redirectFlag) {
    return (
      <Navigate
        to={`/question/${props.testkey}/${props.name}`}
        replace={true}
      />
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{props.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={<Checkbox onChange={hendleChange} />}
            label="I agree to start"
          />
          <Button onClick={handleProceed}>Proceed</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
