import styled from "styled-components";
import { layoutConstant } from "utils/constants";
import { getTheme } from "@utils/utils";

const StyledHeader = styled.header`
  z-index: 111;
  position: relative;
  height: ${layoutConstant.headerHeight};
  background: ${getTheme("colors.body.paper")};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  .logo {
    img {
      display: block;
    }
  }

  .customer-info {
    display: flex;
    flex-direction: column;
    margin-left: 40px;

    span:first-child {
      font-size: 16px;
      font-weight: 600;
    }
    span:last-child {
      font-size: 14px;
      color: #9aa3a8;
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

    .customer-info {
      display: flex;
      flex-direction: column;
      margin-left: 20px;

      span:first-child {
        font-size: 16px;
        font-weight: 600;
      }
      span:last-child {
        font-size: 12px;
        color: #9aa3a8;
      }
    }
  }
    .responsive-link a {
  font-size: 14px;
}

@media (max-width: 1200px) {
  .responsive-link a {
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .responsive-link a {
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .responsive-link a {
    font-size: 11px;
  }
}

`;

export default StyledHeader;
