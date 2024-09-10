import { useContext, useEffect } from 'react';

import {
  Box,
  alpha,
  lighten,
  IconButton,
  Tooltip,
  styled,
  Stack,
  useTheme,
  Button,
  useMediaQuery
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Box)(
  ({ theme, collapseSidebar }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        width: 100%;
        justify-content:flex-end;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          left: ${collapseSidebar ? '100px' : theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const {
    sidebarToggle,
    toggleSidebar,
    collapseSidebar,
    openSideBar,
    closeSideBar
  } = useContext(SidebarContext);
  const theme = useTheme();
  const isLaptop = useMediaQuery('(min-width:1080px)');
  const isMobile = useMediaQuery('(max-width:1100px)');
  useEffect(() => {
    if (isMobile) {
      closeSideBar();
    }
  }, [isMobile]);

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`
      }}
      collapseSidebar={collapseSidebar}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        {isLaptop ? (
          <Button onClick={openSideBar}>
            {collapseSidebar ? <MenuIcon /> : <MenuOpenIcon />}
          </Button>
        ) : null}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
        >
          <HeaderButtons />
          <HeaderUserbox />
        </Box>
      </Stack>
    </HeaderWrapper>
  );
}

export default Header;
