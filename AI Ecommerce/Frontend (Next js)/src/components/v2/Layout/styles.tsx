import { getTheme } from "@utils/utils";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  .header-container {
    box-shadow: ${getTheme("shadows.regular")};
  }
  .customer{
    margin: 2rem auto;
    background-color: 'red';
  }
`;  

export default StyledAppLayout;
