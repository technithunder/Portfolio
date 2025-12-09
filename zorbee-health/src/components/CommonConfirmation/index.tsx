"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

type CommonConfirmationProps = {
  question?: string;
  options?: string[];
  onSelect: (option: string) => void;
  sx?: React.CSSProperties;
};

const StyledBox = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? "#ECF2FB" : "#EFEFEF",
  color: "#000000",
  padding: "7px 14px",
  border: selected ? "1px solid #518ADD" : "1px solid #000000",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.3s, color 0.3s",
}));

const CommonConfirmation: React.FC<CommonConfirmationProps> = ({
  question,
  options = ["Yes", "No"],
  onSelect,
  sx,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <Box>
      <Typography variant="body1" fontWeight={400} mb={2}>
        {question}
      </Typography>
      <Stack direction="row" spacing={2}>
        {options.map((option, index) => (
          <StyledBox
            key={index}
            selected={selectedOption === option}
            onClick={() => handleSelect(option)}
            sx={sx}
          >
            <Typography variant="body1" fontWeight={400}>
              {option}
            </Typography>
          </StyledBox>
        ))}
      </Stack>
    </Box>
  );
};

export default CommonConfirmation;
