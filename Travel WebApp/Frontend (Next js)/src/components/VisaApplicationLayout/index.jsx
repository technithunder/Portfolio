"use client"
import React from 'react'
import { Box, Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import Stepper from '../Stepper';

const VisaApplicationLayout = ({ children }) => {
    const pathName = usePathname()
    const stepPaths = ["/profile-photo", "/passport", "/details", "/checkout"];
    const activeStepIndex = stepPaths.findIndex(path => pathName.startsWith(path));
    return (
        <Container>
            <Box display={"flex"} height={'calc(100vh - 82px)'}>
                <Box width={"12%"} borderRight={"2px solid lightgray"}>
                    <Stepper activeStep={activeStepIndex} />
                </Box>
                <Box width={"88%"}>
                    {children}
                </Box>
            </Box>
        </Container>
    )
}

export default VisaApplicationLayout;