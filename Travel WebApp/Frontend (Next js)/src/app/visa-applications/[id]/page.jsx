'use client'
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Avatar, Box, Card, CardContent, Chip, Container, Grid, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getParticularVisaApplicantDetails } from "@/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation'

const ApplicationOverview = ({ application }) => {
    const { id, expectedVisaDate, visaType, visaCategory, createdAt } = application;

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h5" fontWeight="700">
                        Application #{id}
                    </Typography>
                </Box>

                <Grid container spacing={9}>
                    <Grid item xs={12} sm={6} md={3}>
                        <InfoItem
                            label="Application Date"
                            value={moment(createdAt).format("DD MMMM, YYYY")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <InfoItem label="Expected Visa Date" value={expectedVisaDate} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <InfoItem label="Visa Type" value={visaType} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <InfoItem label="Visa Category" value={visaCategory} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const InfoItem = ({ label, value }) => (
    <Box>
        <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1">{value || "-"}</Typography>
    </Box>
);

const VisaInformation = ({ visa }) => {
    const { visaDetails } = visa;

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="700" mb={2}>
                    Visa Information
                </Typography>
                <Grid container spacing={7}>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem label="Visa Type" value={visaDetails?.visaType || "-"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Entry Type"
                            value={visaDetails?.visaEntry || "-"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Length of Stay"
                            value={visaDetails?.lengthOfStay || "-"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Validity Period"
                            value={visaDetails?.validityPeriod || "-"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Visa Fee"
                            value={visaDetails?.visaFee ? `₹ ${visaDetails.visaFee}` : "-"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Service Fee"
                            value={
                                visaDetails?.vizayardFee ? `₹ ${visaDetails.vizayardFee}` : "-"
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Processing Time"
                            value={
                                visaDetails?.visaTime
                                    ? moment(visaDetails?.visaTime).format("DD MMMM, YYYY")
                                    : "-"
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                            label="Expected Completion"
                            value={
                                visaDetails?.visaGaurrentedOn
                                    ? moment(visaDetails?.visaGaurrentedOn).format(
                                        "DD MMMM, YYYY"
                                    )
                                    : "-"
                            }
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const ApplicantCard = ({ applicant }) => {
    const { childUser } = applicant;
    const { details, photo, passport } = childUser || {};

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="flex-start" mb={3}>
                <Box mr={3}>
                    {photo ? (
                        <Avatar
                            alt={`${details?.firstName} ${details?.lastName}`}
                            src={photo}
                            sx={{ width: 120, height: 120, borderRadius: 2 }}
                        />
                    ) : (
                        <Avatar sx={{ width: 120, height: 120, borderRadius: 2 }}>
                            {details?.firstName?.charAt(0)}
                            {details?.lastName?.charAt(0)}
                        </Avatar>
                    )}
                </Box>
                <Box flexGrow={1}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                    >
                        <Typography variant="h5" fontWeight="700">
                            {details?.firstName} {details?.lastName}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Passport: {details?.passportNumber} • {details?.passportFrom}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <InfoItem label="Gender" value={capitalize(details?.gender)} />
                        <InfoItem
                            label="Date of Birth"
                            value={
                                moment(details?.dob, "DD/MM/YYYY").format("DD MMMM, YYYY") ||
                                "-"
                            }
                        />
                        <InfoItem label="Place of Birth" value={details?.placeOfBirth} />
                        <InfoItem
                            label="Passport Issued On"
                            value={
                                moment(details?.passportIssuedOn, "DD/MM/YYYY").format(
                                    "DD MMMM, YYYY"
                                ) || "-"
                            }
                        />
                        <InfoItem
                            label="Passport Valid Until"
                            value={
                                moment(details?.passportValidUntil, "DD/MM/YYYY").format(
                                    "DD MMMM, YYYY"
                                ) || "-"
                            }
                        />
                    </Stack>
                </Grid>
                <Grid item xs={9.5}>
                    {passport && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight="600" mb={1}>
                                Passport Document
                            </Typography>
                            <Image
                                src={passport}
                                alt="Passport Document"
                                width={150}
                                height={180}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

const PaymentDetails = ({ payments }) => {
    if (!payments || payments.length === 0) return null;

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="700" mb={2}>
                    Payment Details
                </Typography>

                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments?.length > 0 &&
                                payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{payment.paymentId || "-"}</TableCell>
                                        <TableCell>{payment.orderId || "-"}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight="600">
                                                ₹{parseFloat(payment.amount).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={capitalize(payment.status)}
                                                color={
                                                    payment.status === "captured" ? "success" : "default"
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {moment(payment.createdAt).format("DD MMM, YYYY")}
                                        </TableCell>
                                        <TableCell>
                                            {payment.user ? (
                                                <Box>
                                                    <Typography variant="body2">
                                                        {payment.user.email}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {payment.user.phoneNumber}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};
const capitalize = (str) => {
    if (!str) return "-";
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    completed: "success",
    inprogress: "info",
    onhold: "default",
    applicationsubmit: "secondary",
};

const VisaApplications = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState({ open: false, message: "" });
    const router = useRouter();

    const fetchApplicantDetails = async () => {
        setLoading(true);
        await getParticularVisaApplicantDetails(73)
            .then((res) => {
                if (res?.status) {
                    setData(res?.data?.data);
                    setSnackBar({ open: true, message: res?.data.message });
                }
                setLoading(false);
            })
            .catch((e) => console.log("error", e));
        setLoading(false);
    };

    useEffect(() => {
        fetchApplicantDetails();
    }, []);

    const snackbarClose = () => {
        setSnackBar({ open: false, message: "" });
    };

    return (
        <Container mt={1} spacing={10}>

            <Box sx={{ py: 3, width: '70%', mx: 'auto' }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <IconButton onClick={() => router.push('/profile')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" ml={1}>Back to Profile</Typography>
                </Box>
                <Card sx={{ mb: 4, p: 6 }}>

                    <Box mb={4}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h4" fontWeight="700" mb={1}>
                                Visa Application to{" "}
                                {data.visaDetail?.basicDetails?.countryName || "Singapore"}
                            </Typography>
                            <Chip
                                label={capitalize(data?.status)}
                                color={statusColors[data?.status] || "default"}
                            />
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            Success Rate: {data.visaDetail?.basicDetails?.successRate || 0}% •
                            Processing Time:{" "}
                            {data.visaDetail?.basicDetails?.expectedTime || 0} days
                        </Typography>
                    </Box>

                    <ApplicationOverview application={data} />

                    <VisaInformation visa={data?.visaDetail || {}} />

                    <PaymentDetails payments={data?.paymentDetails || {}} />

                    <Box mb={3}>
                        <Typography variant="h5" fontWeight="700" mb={2}>
                            {data?.applicants?.length > 0
                                ? `Applicants Details (${data.applicants.length})`
                                : ""}
                        </Typography>

                        <Grid container>
                            {data?.applicants?.length > 0 &&
                                data?.applicants?.map((applicant, index) => (
                                    <ApplicantCard
                                        key={applicant.id || index}
                                        applicant={applicant}
                                    />
                                ))}
                        </Grid>
                    </Box>

                    <Snackbar
                        open={snackBar.open}
                        autoHideDuration={2000}
                        message={snackBar.message}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        onClose={snackbarClose}
                        className="snackBarColor"
                        key="snackbar"
                    />
                </Card>
            </Box>
        </Container>
    );
};
export default VisaApplications;