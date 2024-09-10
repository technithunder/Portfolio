import { Box, Button, Dialog, Typography } from "@mui/material";
import React from "react";

const DeleteModal = ({ open, onClose, onClick }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={3}
      >
        <Typography
          align="center"
          sx={{
            py: 2,
            px: 3,
          }}
          variant="h3"
        >
          Are you sure you want to delete this record?
        </Typography>

        <Box>
          <Button
            color="error"
            onClick={onClick}
            size="large"
            sx={{
              mx: 1,
              px: 3,
            }}
            variant="contained"
          >
            Delete
          </Button>
          <Button
            variant="text"
            size="large"
            sx={{
              mx: 1,
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteModal;
