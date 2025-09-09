import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

const CommonDialog = (props) => {
  const { open, handleClose, heading, children } = props;
  return (
    <Dialog
      maxWidth={"lg"}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "#000",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {heading} <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
