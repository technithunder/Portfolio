import {
  alpha,
  Badge,
  IconButton,
  useTheme,
  styled,
  Tooltip
} from '@mui/material';

import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';

import { useTranslation } from 'react-i18next';

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function HeaderNotifications() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Tooltip arrow title={t('Notifications')}>
        <Badge
          variant="dot"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '.MuiBadge-badge': {
              background: theme.colors.success.main,
              animation: 'pulse 1s infinite',
              transition: `${theme.transitions.create(['all'])}`
            }
          }}
        >
          <IconButtonWrapper
            sx={{
              background: alpha(theme.colors.primary.main, 0.1),
              transition: `${theme.transitions.create(['background'])}`,
              color: theme.colors.primary.main,

              '&:hover': {
                background: alpha(theme.colors.primary.main, 0.2)
              }
            }}
            color="primary"
          >
            <NotificationsActiveTwoToneIcon fontSize="small" />
          </IconButtonWrapper>
        </Badge>
      </Tooltip>
    </>
  );
}

export default HeaderNotifications;
