"use client"
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { theme } from '@/theme'
import { styled } from '@mui/material/styles'

const StyledWrapper = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#ffffff81",
    padding: "20px 30px",
    [theme.breakpoints.up("sm")]: {
        padding: "25px 50px",
    },
    [theme.breakpoints.up("md")]: {
        padding: "29px 75px",
    },
    borderRadius: "20px",
    color: "#525557"
}))

const StyledWrapper2 = styled(Box)(({ theme }) => ({
    backgroundColor: "#F6F5F5",
    marginLeft: "10px",
    height: "30px",
    width: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",

    [theme.breakpoints.up("sm")]: {
        height: "40px",
        width: "40px",
    },
    [theme.breakpoints.up("md")]: {
        height: "50px",
        width: "50px",
    },
    [theme.breakpoints.up("lg")]: {
        height: "60px",
        width: "60px",
    },
}));


const HeroComponent = () => {
    return (
        <Box position={'relative'} sx={{ height: { xs: '35vh', sm: "50vh", md: "70vh" } }}>
            <img src={"/assets/images/hero_image.jpg"} width={"100%"} height={"100%"} alt='heroImage' style={{ objectFit: "cover", }} />
            <Container>
                {/* <StyledWrapper>
                    <Typography variant='h4' fontSize={{ xs: "1rem", sm: "1.125rem", md: "1.5rem" }} textAlign={"center"} mb={2}>
                        Where You  Want to go ?
                    </Typography>
                    <TextField sx={{
                        width: { xs: "230px", sm: "400px", md: "600px" }, backgroundColor: theme.palette.common.white, borderRadius: "12px",
                        "& fieldset": {
                            border: "none",
                        },
                    }} placeholder='Search destinations' />
                </StyledWrapper> */}
            </Container>
        </Box>
    )
}

export default HeroComponent