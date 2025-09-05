'use client'
import React, { useEffect, useState } from 'react'
import { Box, Typography, Container, CircularProgress, Grid, Chip } from '@mui/material'
import { useSelector } from 'react-redux'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { getAllVisaApplication } from '@/api'
import { useRouter } from 'next/navigation'
import PersonIcon from '@mui/icons-material/Person';

const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    completed: "success",
    all: "default",
    inprogress: "secondary",
};

const User = () => {
    const { phoneNo, user, userData } = useSelector((state) => state.user)
    const { user: { userId } } = useSelector((state) => state.user)
    const photo = useSelector((state) => state.user.userData.photo);
    const [loading, setLoading] = useState(true);
    const [visaInfo, setVisaInfo] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const router = useRouter();
    console.log("photo====>", photo);

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        fetchAllVisaApplication(status);
    };
    const fetchAllVisaApplication = async (status = "all") => {
        try {
            setLoading(true);
            const allApplication = await getAllVisaApplication(status !== "all" ? status : '');
            setVisaInfo(allApplication.data || []);
        } catch (e) {
            setError('Error fetching applications.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAllVisaApplication();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 84px)', overflow: 'hidden' }}>
            <Grid container sx={{ height: '100%' }}>
                <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
                    <Box sx={{ height: "100vh", width: "100%" }}>
                        <Box sx={{ margin: "50px", width: "45%", display: "flex", flexDirection: "column", marginLeft: "auto", borderRadius: "24px", boxShadow: "0px 0px 20px 1px lightgray" }}>
                            <Box sx={{ marginX: "auto", mt: "40px", width: "75%", borderRadius: "20px" }}>
                                <img src={photo} style={{ height: "100%", width: "100%", borderRadius: "15px" }} />
                            </Box>
                            <VerifiedOutlinedIcon sx={{ color: "green", margin: "0px auto", mt: 2 }} />
                            <Box color={"gray"} mb={2}>
                                <Typography textAlign={"center"} >{userData.email}</Typography>
                                <Typography textAlign={"center"}>{phoneNo.countryCode} {phoneNo.number}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
                    <Box p={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Grid display="flex" gap={2} mt={3} mb={3} >
                            {["all", "pending", "inprogress", "rejected", "completed"].map((status) => (
                                <Chip
                                    key={status}
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                                    color={statusColors[status] || "default"}
                                    variant={selectedStatus === status ? "filled" : "outlined"}
                                    onClick={() => handleStatusChange(status)}
                                />
                            ))}
                        </Grid>
                        <Box
                            sx={{
                                height: { xs: '60vh', md: '100vh' },
                                overflowX: "auto",
                            }}
                            width="100%"
                        >
                            {loading ? (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <CircularProgress />
                                </Box>
                            ) : visaInfo?.length === 0 ? (
                                <Box
                                    height="50vh"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    width="100%"

                                >
                                    <Typography variant="body1" color="text.secondary" fontSize="16px">
                                        No applications found.
                                    </Typography>
                                </Box>
                            ) : (
                                visaInfo?.visaApplications?.map(visa => (
                                    <Box
                                        key={visa.id}
                                        height='20%'
                                        // overflow="auto"
                                        sx={{
                                            display: "flex",
                                            borderRadius: "12px",
                                            p: 2,
                                            mb: 2,
                                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.08)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push(`/visa-applications/${visa.id}`)}
                                    >
                                        <Box sx={{ width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden" }}>
                                            <img
                                                src={visa.visaDetail?.basicDetails?.coverImage?.[0]}
                                                alt={`${visa.country} Visa`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </Box>

                                        <Box sx={{ flex: 1, ml: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="h6">{visa.visaDetail?.basicDetails?.countryName} </Typography>
                                                {/* <Typography variant="body2">{visa?.applicants?.length}</Typography>
                                             */}
                                                <Chip
                                                    label={visa?.applicants?.length || 0}
                                                    color="default"
                                                    sx={{ fontWeight: 'bold' }}
                                                    avatar={<PersonIcon sx={{ fontSize: "18px", color: "white" }} />}

                                                />

                                            </Box>

                                            {/* {visa.guarantedDate && ( */}
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Visa guaranteed on</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Box sx={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#6d28d9", mr: 1 }} />
                                                    <Typography variant="body2" sx={{ color: "#6d28d9" }}>{visa?.visaDetails?.visaGaurrentedOn}</Typography>
                                                    <Typography variant="body2" sx={{ color: "#6d28d9" }}>{visa?.expectedVisaDate}</Typography>
                                                </Box>
                                            </Box>
                                            {/* )} */}

                                            <Box>
                                                <Chip
                                                    label={visa?.status}
                                                    color={statusColors[visa?.status] || "default"}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                )))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )
}

export default User
