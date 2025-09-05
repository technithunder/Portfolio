import Box from "@component/Box";
import Container from "@component/Container";
import Typography from "@component/Typography";

// styles
import { StyledFooter } from "./styles";

const Footer = () => {
  return (
    <StyledFooter>
      <Box bg="#FFF">
        <Container p="2rem" pl="0" color="black">
          <Typography
            mb="0"
            lineHeight="1"
            fontSize={15}
            fontWeight="600"
            color="#58666e"
          >
            2019 © OrderOasis - An Ai2 Inc product
          </Typography>
        </Container>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
