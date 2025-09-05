import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import GaugeChart from 'react-gauge-chart';

const GaugeChartComponent = ({ title, percent }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        py: 2,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Box
        sx={{
          width: '100%'
        }}
      >
        <Typography
          align="center"
          variant="h3"
          sx={{
            mb: 2
          }}
        >
          {title}
        </Typography>
        <GaugeChart
          nrOfLevels={3}
          hideText
          colors={[
            'red',
            theme.colors.warning.main,
            '#57ca22'
          ]}
          needleColor={theme.colors.alpha.black[100]}
          needleBaseColor={theme.colors.alpha.black[100]}
          l={['Low', 'Medium', 'High']}
          arcWidth={0.25}
          arcPadding={0}
          cornerRadius={0}
          percent={percent}
        />
        <Typography align="center" variant="h1" />
      </Box>
    </Card>
  );
};

export default GaugeChartComponent;
