import styled from "styled-components";
import { layoutConstant } from "utils/constants";
import { getTheme } from "@utils/utils";

const StyledHeader = styled.header`
  z-index: 111;
  position: relative;
  height: ${layoutConstant.headerHeight};
  background: ${getTheme("colors.body.paper")};

  .logo {
    img {
      display: block;
    }
  }

  .icon-holder {
    span {
      font-size: 12px;
      line-height: 1;
      margin-bottom: 4px;
    }
    h4 {
      margin: 0px;
      font-size: 14px;
      line-height: 1;
      font-weight: 600;
    }
    div {
      margin-left: 6px;
    }
  }

  .navs-wrapper {
    display: flex;
    gap: 20px;
    color:#4586b8;

    > div {
      display: flex;
    }
  }

  .customer {
    margin: 2rem auto;
    max-width: 1200px;
    background-color: "red";
  }

  .user {
    cursor: pointer;
  }

  @media only screen and (max-width: 900px) {
    height: ${layoutConstant.mobileHeaderHeight};
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

    .logo {
      img {
        height: 50px;
        margin: 0;
      }
    }
    .header-right {
      /* display: none !important; */
    }
    .navs-wrapper {
      display: none;
      color:#4586b8;
    }
  }
`;

export default StyledHeader;
