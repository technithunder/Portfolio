import React from 'react'
import { Box, Typography } from '@mui/material'
import HeroComponent from '@/components/HeroComponent'
import Destinations from '@/components/Destinations'

const Dashboard = () => {
    return (
        <Box>
            <HeroComponent />
            <Destinations />
        </Box>
    )
}

export default Dashboard