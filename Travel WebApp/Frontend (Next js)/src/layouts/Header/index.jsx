"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import Box from "@mui/material/Box"
import Container from '@mui/material/Container'
import { usePathname, useRouter } from 'next/navigation'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import { IconButton, Typography, Menu, MenuItem } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/redux/Slice/UserSlice'


const StyledWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    height: "80px",
    width: '100%',
    display: "flex",
    alignItems: "center",
}))

const Header = () => {
    const router = useRouter()
    const pathName = usePathname()
    const dispatch = useDispatch()
    const hideFooterPaths = ["/profile-photo", "/passport", "/details", "/checkout", "/profile", "/traveller-details"]
    const hideFooter = hideFooterPaths.some(path => pathName.startsWith(path))
    const changeHeader = ["/profile"]
    const header = changeHeader.some(path => path === pathName);
    const { user: { token } } = useSelector((state) => state.user)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        dispatch(logoutUser())
        handleClose()
        router.push('/sign-in')
    }

    const handleProfile = () => {
        handleClose()
        router.push('/profile')
    }

    return (
        <StyledWrapper sx={{ borderBottom: hideFooter ? "2px solid lightgray" : "none" }}>
            <Container>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <Image
                        src={"/assets/svg/logo/vizayard_logo.svg"}
                        height={44}
                        width={150}
                        onClick={() => router.push('/')}
                        alt='vizayardlogo'
                        style={{ cursor: "pointer" }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BeenhereOutlinedIcon sx={{ height: 30, width: 30, cursor: "pointer" }} />
                        <Typography variant='overline' sx={{ width: 70, lineHeight: "15px", mx: "3px", textDecoration: "underline", cursor: "pointer", textTransform: "capitalize" }}>
                            on Time Guaranteed
                        </Typography>

                        {token ? (
                            <>
                                <IconButton sx={{ ml: 1 }} onClick={handleClick}>
                                    <PersonOutlineOutlinedIcon sx={{ height: 34, width: 34, color: "black" }} />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    {header || <MenuItem onClick={handleProfile}>Profile</MenuItem>}
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <IconButton sx={{ ml: 1 }} onClick={() => router.push('/sign-in')}>
                                <PersonOutlineOutlinedIcon sx={{ height: 34, width: 34, color: "black" }} />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Container>
        </StyledWrapper>
    )
}

export default Header
