import { styled, Box } from '@mui/material';
import { useContext } from 'react';
import { SidebarContext } from 'src/contexts/SidebarContext';

const LogoWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin: 'o auto';
`;

function Logo() {
  const { collapseSidebar } = useContext(SidebarContext);
  return (
    <LogoWrapper>
      <img
        src={`/static/images/logo/${
          collapseSidebar ? 'proscore-logo.png' : 'brand-logo.png'
        }`}
        alt=""
        height={40}
      />
    </LogoWrapper>
  );
}

export default Logo;
