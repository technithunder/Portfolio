"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material'

const StyledWrapper = styled(Typography)(({ theme }) => ({
    backgroundColor: "#DE2025",
    borderRadius: "15px",
    color: theme.palette.common.white,
    padding: "5px 10px",
    height: "20px"
}))

const TrendingDestinations = ({ title, subtitle, days, image, onclick }) => {
    return (
        <Box>
            <Card sx={{ minWidth: 280, borderRadius: "12px" }}>
                <CardActionArea onClick={onclick}>
                    <CardMedia
                        component="img"
                        height="160"
                        image={image}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="body1" fontWeight={600} component="div">
                                    {title}
                                </Typography>
                                <Typography variant="subtitle2" color='#6B7280' component="div">
                                    {subtitle}
                                </Typography>
                            </Box>
                            <StyledWrapper variant='caption'>Popular</StyledWrapper>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                            <AccessTimeIcon sx={{ color: "#6B7280" }} />
                            <Typography variant="body2" color='#6B7280' ml={"5px"}>{days} days</Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}

export default TrendingDestinations