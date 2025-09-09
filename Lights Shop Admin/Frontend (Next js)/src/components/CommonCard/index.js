import React from "react";
import { Card } from "@mui/material";

const CommonCard = ({ children, sx = {} }) => {
  return (
    <Card
      sx={{
        px: 4,
        py: 2,
        mt: 0,
        borderRadius: "10px",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default CommonCard;
