import { Box, Grid } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const SignInLayout = ({ children }) => {
    return (
        <Box sx={{ height: '100vh' }}>
            <Grid container>
                <Grid size={{ lg: 7 }}>
                    <Box
                        sx={{
                            height: '100vh',
                            background: 'linear-gradient(332deg, rgba(243,63,63,1) 0%, rgba(190,150,247,1) 54%, rgba(26,35,93,1) 100%)',
                            width: '100%',
                            display: "flex",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}
                    >
                        <img src={"/assets/images/sign-in-layout.png"} height={"140%"} width={"75%"} alt='img' />
                    </Box>

                </Grid>
                <Grid size={{ lg: 5 }}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    )
}

export default SignInLayout