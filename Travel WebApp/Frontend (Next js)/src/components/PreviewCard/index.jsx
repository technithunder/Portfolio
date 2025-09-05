import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

const PreviewCard = ({ titleIcon, title, children, sx = {} }) => {
    return (
        <Box sx={{ border: '2px solid lightgray', borderRadius: '12px', m: '20px 0 0 20px' }}>
            {(title || titleIcon) && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2,
                    }}
                >
                    {titleIcon}
                    {title && (
                        <Typography variant="h6" ml={2}>
                            {title}
                        </Typography>
                    )}
                </Box>
            )}
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: '30px 20px',
                    ...sx
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default PreviewCard;
