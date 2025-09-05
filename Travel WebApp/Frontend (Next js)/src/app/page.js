"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress } from '@mui/material'
import Dashboard from './dashboard/page'

const Page = () => {
  const router = useRouter()
  // useEffect(() => {
  //   router.push("/sign-in")
  // }, [])
  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     height: "100vh",
    //     width: "100%",
    //   }}
    // >
    //   <CircularProgress size={30} />
    // </Box>
    <Box>
      <Dashboard />
    </Box>
  )
}

export default Page