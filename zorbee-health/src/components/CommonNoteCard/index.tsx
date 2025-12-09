"use client";
import React, { ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface CommonNoteCardProps {
  title?: string;
  value?: string;
  placeholder?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  description?: string;
}

const StyledTextArea = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    padding: "8px",
    marginTop: "12px",
    "& fieldset": {
      borderColor: theme.palette.mode === "light" ? "#E0E0E0" : "#424242",
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "light" ? "#BDBDBD" : "#616161",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.common.black,
    },
    "& textarea": {
      minHeight: "70px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
}));

const CommonNoteCard: React.FC<CommonNoteCardProps> = ({
  title,
  value = "",
  placeholder = "",
  onChange,
  multiline = true,
  rows = 1,
  fullWidth = true,
  disabled = false,
  description,
  ...props
}) => {
  return (
    <Box>
      {title && (
        <Typography variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography component={"p"} variant="caption" fontWeight={400}>
          {description}
        </Typography>
      )}
      <StyledTextArea
        multiline={multiline}
        rows={rows}
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
    </Box>
  );
};

export default CommonNoteCard;
