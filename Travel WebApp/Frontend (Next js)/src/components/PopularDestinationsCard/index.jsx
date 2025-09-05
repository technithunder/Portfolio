"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { theme } from '@/theme'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import { styled } from '@mui/material'

const StyledWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    display: "flex",
    alignItems: 'center',
    padding: "5px 10px",
    borderRadius: "8px",
    position: "absolute",
    top: "12px",
    left: "12px"
}))

const PopularDestinationsCard = ({ country, title, days, price, success, image, onclick }) => {
    return (
        <Box>
            <Card sx={{ minWidth: 280, borderRadius: "20px" }}>
                <CardActionArea onClick={onclick}>
                    <Box position="relative" width="100%" height="206px">
                        <CardMedia
                            component="img"
                            height="206"
                            image={image}
                            alt="green iguana"
                            sx={{ width: '100%', height: '100%' }}
                        />
                        <StyledWrapper >
                            <TourOutlinedIcon sx={{ height: "12px", width: "12px", marginRight: '5px', color: "red" }} />
                            <Typography
                                color={theme.palette.common.black}
                                variant='overline'
                                lineHeight={1}
                                textTransform={'capitalize'}
                            >
                                {country}
                            </Typography>
                        </StyledWrapper>
                    </Box>
                    <CardContent sx={{ padding: "10px 20px" }}>


                        <Box>
                            <Typography variant="h6" fontWeight={600} component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                            <AccessTimeIcon sx={{ color: "#6B7280" }} />
                            <Typography variant="body1" color='#6B7280' ml={"5px"}>{days} days</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography variant="body1" color={theme.palette.common.black} ml={"5px"}>₹{price}</Typography>
                            <Typography variant="body1" color='#10B981' ml={"5px"}>{success}%</Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}

export default PopularDestinationsCard