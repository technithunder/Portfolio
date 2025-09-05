import styled, { css, keyframes } from "styled-components";
import systemCss from "@styled-system/css";

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface SpinnerProps {
  height?: string;
  width?: string;
  color?: string;
}

const Spinner = styled.div<SpinnerProps>(
  ({ height = "24px", width = "24px", color = "red" }) =>
    systemCss({
      width,
      height,
      border: "4px solid",
      borderRadius: "50%",
      borderColor: color,
      borderTop: `4px solid white`,
      transitionProperty: "transform",
    }),
  css`
    animation: ${rotate} 1.2s infinite linear;
  `
);

export default Spinner;
