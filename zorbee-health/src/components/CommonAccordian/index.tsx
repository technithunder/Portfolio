"use client";
import React, { ReactNode, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface CommonAccordionProps {
  children: ReactNode;
  title?: string;
  defaultExpanded?: boolean;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledAccordionSummary = styled(AccordionSummary)(({}) => ({
  paddingBlock: "5px",
  minHeight: "auto",
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({}) => ({
  paddingBottom: "10px",
}));

const CommonAccordion: React.FC<CommonAccordionProps> = ({
  children,
  title = "Experience",
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Box>
      <StyledAccordion expanded={expanded} onChange={handleChange}>
        <StyledAccordionSummary
          expandIcon={
            expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
        >
          <Typography variant="h6" fontWeight={500}>
            {title}
          </Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>{children}</StyledAccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

export default CommonAccordion;
