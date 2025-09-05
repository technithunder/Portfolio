"use client";
import Spinner from "@component/Spinner";
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "contained" | "outlined";
type ButtonColor = "default" | "primary" | "success" | "error";

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  text?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  onClick?: () => void;
  endIcon?: ReactNode;
}

const StyledButton = styled.button<{ variant: ButtonVariant; color: ButtonColor; colorMap: Record<ButtonColor, string> }>`
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;

  ${(props) =>
    props.variant === "contained" &&
    css`
      color: #ffffff;
      background: ${props.colorMap[props.color] || props.colorMap.default};
      &:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
    `}

  ${(props) =>
    props.variant === "outlined" &&
    css`
      background: transparent;
      border: 1px solid ${props.colorMap[props.color]};
      color: ${props.colorMap[props.color]};
      &:hover {
        border: 1px solid ${props.colorMap[props.color]};
      }
    `}

  ${(props) => props.disabled && "cursor: not-allowed; opacity: 0.7;"}
`;

const Loader: React.FC<CommonButtonProps> = ({
  isLoading = true,
  color = "default",
  variant = "contained",
  onClick,
  endIcon,
  ...props
}) => {
  const colorMap: Record<ButtonColor, string> = {
    error: "red",
    primary: "#4a90e2",
    success: "green",
    default: "linear-gradient(to right, #9013fe, #4a90e2)",
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Spinner height="40px" width="40px" color="#9013fe" />
    </div>
  );
};

export default Loader;