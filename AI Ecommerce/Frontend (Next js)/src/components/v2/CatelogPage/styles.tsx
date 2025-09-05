import { getTheme } from "@utils/utils";
import styled from "styled-components";
import Card from "@component/Card";
import { colors } from "@utils/themeColors";
import { convertHexToRGB } from "@utils/utils";

export const StyledAppLayout = styled.div`
  .header-container {
    box-shadow: ${getTheme("shadows.regular")};
  }
  .customer {
    margin: 2rem auto;
    background-color: "red";
  }
`;

type ShopWrapperProps = { coverImgUrl: string };

export const ShopCard1Wrapper = styled(Card)<ShopWrapperProps>`
  border-radius: 8px;
  .black-box {
    background-image: linear-gradient(
        to bottom,
        rgba(${convertHexToRGB(colors.gray[900])}, 0.8),
        rgba(${convertHexToRGB(colors.gray[900])}, 0.8)
      ),
      url(${(props) => props.coverImgUrl || "/assets/images/banners/cycle.png"});
    background-size: cover;
    background-position: center;
    color: white;
    padding: 17px 30px 56px;
  }
`;

