import React from 'react';
import { CircularProgress } from '@mui/material';

const ProgressBar = () => {
  return (
    <CircularProgress
      size="3rem"
      sx={{ display: 'flex', margin: '0 auto', my: 5 }}
    />
  );
};

export default ProgressBar;
