/* eslint-disable jsx-a11y/label-has-for */
import { Grid, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function PageHeader({
  heading,
  description,
  buttonHeading,
  pathname,
  Component,
  Icon
}) {
  return (
    <Component sx={{ py: 3, px: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            textTransform="uppercase"
          >
            {heading}
          </Typography>
          <Typography variant="subtitle2">{description}</Typography>
        </Grid>
        <Grid item>
          {buttonHeading ? (
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              component={RouterLink}
              to={pathname}
              variant="contained"
              startIcon={<Icon fontSize="small" />}
            >
              {buttonHeading}
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </Component>
  );
}

export default PageHeader;
