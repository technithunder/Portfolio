// components/CommonAccordion.js
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CommonAccordion = ({
  panel,
  expanded,
  onChange,
  icon,
  title,
  isBorderBottom = true,
  children,
}) => {
  return (
    <Accordion
      expanded={expanded === panel}
      onChange={onChange(panel)}
      disableGutters
      elevation={0}
      sx={{
        "&:before": { display: "none" },
        borderBottom: isBorderBottom ? "1px solid #e0e0e0" : "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#757575" }} />}
        sx={{ px: 3, py: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontSize: "0.875rem" }}
          >
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, py: 0, pl: "calc(36px + 1.5rem)" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default CommonAccordion;