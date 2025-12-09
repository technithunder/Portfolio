"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface CommonChipProps {
  variant?: "primary" | "default";
  title?: string;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

const StyledChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<CommonChipProps>(({ variant, theme }) => ({
  backgroundColor: variant === "primary" ? "#ECF2FB" : "#E2E6EBB2",
  border: `1px solid ${variant === "primary" ? "#518ADD" : "#E2E6EB"}`,
  borderRadius: "8px",
  padding: "8px 16px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "6px 10px",
  },
}));

const CommonChip: React.FC<CommonChipProps> = ({
  variant = "default",
  title,
  style,
  textStyle,
}) => {
  return (
    <StyledChip variant={variant} sx={style}>
      <Typography sx={textStyle} variant="caption" fontWeight={400}>
        {title}
      </Typography>
    </StyledChip>
  );
};

export default CommonChip;
