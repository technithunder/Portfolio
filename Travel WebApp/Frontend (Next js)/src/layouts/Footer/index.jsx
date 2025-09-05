import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import Box from '@mui/material/Box'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { theme } from '@/theme'
import { styled } from '@mui/material'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useRouter } from 'next/navigation'

const Company = [
    "Career",
    "Blog",
    "Consulatance",
    "Process"
]

const StyledWrapper = styled(Box)(({ theme }) => ({
    color: theme.palette.secondary.main,
    display: "flex",
    marginBottom: "20px"
}))

const Footer = () => {
    const router = useRouter()
    return (
        <Stack pt={"50px"} borderTop={"2px solid lightgray"}>
            <Container>
                <Grid container pb={"40px"}>
                    <Grid size={{ xs: 12, sm: 6, md: 2.25, lg: 2.25 }} mt={2}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: 'space-between', height: "100%" }}>
                            <Image src={"/assets/svg/logo/vizayard_footer_logo.svg"} height={90} width={100} onClick={() => router.push('/')} alt='vizayardlogo' style={{ cursor: "pointer" }} />
                            <Box>
                                <Typography color={theme.palette.secondary.main} mb={"20px"}>Follow us on</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                                    <Image src={"/assets/svg/facebook.svg"} height={24} width={24} alt='facebook' />
                                    <Image src={"/assets/svg/instagram.svg"} height={24} width={24} alt='instagram' />
                                    <Image src={"/assets/svg/twitter.svg"} height={24} width={24} alt='twitter' />
                                    <WhatsAppIcon />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.25, lg: 2.25 }} mt={{ xs: 2, md: 0 }}>
                        <Typography mb={"30px"} variant='h4'>Company</Typography>
                        {Company.map((item, index) => (
                            <Typography variant='h6' mb={"15px"} sx={{ cursor: "pointer" }} color={
                                "secondary.main"
                            } key={index}>{item}</Typography>
                        ))}

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.25, lg: 2.25 }} mt={{ xs: 2, md: 0 }}>
                        <Typography mb={"30px"} variant='h4'>Company</Typography>
                        {Company.map((item, index) => (
                            <Typography variant='h6' mb={"15px"} sx={{ cursor: "pointer" }} color={
                                "secondary.main"
                            } key={index}>{item}</Typography>
                        ))}

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.25, lg: 2.25 }} mt={{ xs: 2, md: 0 }}>
                        <Typography mb={"30px"} variant='h4'>Company</Typography>
                        {Company.map((item, index) => (
                            <Typography variant='h6' mb={"15px"} sx={{ cursor: "pointer" }} color={
                                "secondary.main"
                            } key={index}>{item}</Typography>
                        ))}

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} mt={{ xs: 2, md: 0 }}>
                        <Typography mb={"30px"} variant='h4' color={theme.palette.secondary.main} >Contact us</Typography>
                        <StyledWrapper>
                            <EmailOutlinedIcon height={20} width={20} />
                            <Typography ml={"20px"}>abc@gmail.com</Typography>
                        </StyledWrapper>
                        <StyledWrapper>
                            <CallOutlinedIcon height={20} width={20} />
                            <Typography ml={"20px"}>+91 76564367489</Typography>
                        </StyledWrapper>
                        <StyledWrapper>
                            <LocationOnOutlinedIcon height={20} width={20} />
                            <Typography ml={"20px"}>A-101,Titanium city center,
                                Vejalpur,Ahmdabad - 380015</Typography>
                        </StyledWrapper>

                    </Grid>
                </Grid>
                <Divider />
                <Box paddingBlock={"40px"} textAlign={"center"}>
                    <Typography variant='caption' color={theme.palette.secondary.main}>@vizayard All Rights reserved  |  Privacy Policy |  Terms & Conditions</Typography>
                </Box>
            </Container>
        </Stack>
    )
}

export default Footer