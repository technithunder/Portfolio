import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";

const ButtonView = styled(Button)`
  background-color: #9dff20;
  color: black;
  display: block;
  font-size: 16px;
  padding: 7px 16px;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const CustomButton = ({ children, ...props }) => {
  return <ButtonView {...props}>{children}</ButtonView>;
};

export default CustomButton;
