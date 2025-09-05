import styled from "styled-components";

export const COMMON_DOT_STYLES = {
  left: 0,
  right: 0,
  bottom: 25,
  position: "absolute",
};

export const RootStyle = styled.div.withConfig({
  shouldForwardProp: (prop: string) => prop !== "space",
})<{ space: number }>(({ space }) => ({
  ".slick-list": { marginInline: -space },
  ".slick-slide": { paddingInline: space },
}));

export const DotList = styled("ul")(({ theme }) => ({
  gap: 0,
  zIndex: 1,
  margin: 0,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.primary.main,
  "& li": {
    width: 13,
    height: 7,
    scaleX: 1,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.4s",
    "&.slick-active span": { backgroundColor: theme.colors.primary.main },
    "&.slick-active": { width: 18 },
  },
}));

export const Dot = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "dotColor",
})<{ dotColor?: string }>(({ dotColor, theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: 12,
  cursor: "pointer",
  position: "relative",
  backgroundColor: dotColor || theme.colors.gray[300],
}));

export const ArrowButton = styled("div")(({ theme }) => ({
  zIndex: 1,
  width: 35,
  height: 35,
  padding: 0,
  top: "50%",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(0, -50%)",
  transition: "all 0.2s ease-in-out",
  backgroundColor: "#ffffff",
  color: "#000000",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  borderRadius: "50%",
  "&.prev": { left: -15 },
  "&.next": { right: -15 },
  "&.slick-disabled": { visibility: "hidden" },
  "& div": {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
