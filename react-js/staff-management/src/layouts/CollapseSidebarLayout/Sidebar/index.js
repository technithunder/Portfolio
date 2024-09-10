import Scrollbar from 'src/components/Scrollbar';
import Logo from 'src/components/LogoSign';
import SidebarMenu from './SidebarMenu';
import { Box, Divider, styled } from '@mui/material';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.spacing(12)};
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        height: 100%;
        transition: width 0.3s ease-in-out;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          top: 0;
          
          left: 0;
          position: fixed;
          z-index: 10;
        }
`
);

function Sidebar() {
  return (
    <>
      <SidebarWrapper
        sx={{
          display: { xs: 'none', md: 'inline-block' }
        }}
      >
        <Box mt={3} mb={2}>
          <Logo />
        </Box>
        <Divider />
        <Box
          sx={{
            height: 'calc(100% - 80px)'
          }}
        >
          <Scrollbar>
            <SidebarMenu />
          </Scrollbar>
        </Box>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
