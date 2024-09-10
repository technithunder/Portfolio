import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import {
  Box,
  Drawer,
  styled,
  useTheme,
  Divider,
  Typography
} from '@mui/material';

import SidebarMenu from './SidebarMenu';
import Logo from 'src/components/LogoSign';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        transition: width 0.3s ease-in-out; 
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        position: relative;
        z-index: 7;
        height: 100%;
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0
        }}
      >
        <Box mt={3}>
          <Box mx={2}>
            <Logo small="true" />
            <Typography
              sx={{
                mt: theme.spacing(3),
                mb: theme.spacing(1)
              }}
            >
              {' '}
              Partner Portal
            </Typography>
            <Divider
              sx={{
                mt: theme.spacing(1),
                mb: theme.spacing(3)
              }}
            />
          </Box>
        </Box>
        <Box sx={{ height: '90%' }}>
          <Scrollbar>
            <SidebarMenu />
          </Scrollbar>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`
        }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <Box
          mx={2}
          mt={2}
          alignItems="center"
          display="flex"
          justifyContent="center"
        >
          <Logo />
          <Divider
            sx={{
              my: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10]
            }}
          />
        </Box>
        <SidebarWrapper>
          <Scrollbar>
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
