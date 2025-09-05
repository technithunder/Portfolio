"use client"
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlightIcon from '@mui/icons-material/Flight';
import SpeedIcon from '@mui/icons-material/Speed';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CircularProgress, Skeleton, styled } from '@mui/material'
import Divider from '@mui/material/Divider'
import CommonButton from '@/components/CommonButton'
import DatePicker from '@/components/DatePicker'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getVisaInfo } from '@/api'
import TravellerModal from '@/components/TravellerModal'
import { useDispatch } from 'react-redux'
import { deleteExppectedDate } from '@/redux/Slice/VisaApplicationslice'



const RequiredDocuments = [
    {
        icon: <InsertDriveFileOutlinedIcon sx={{ height: "32px", width: "32px", color: "#9CA3AF" }} />,
        DocumentName: "Passport",
        DocumentKey: "passport",
    },
    {
        icon: <InsertPhotoOutlinedIcon sx={{ height: "32px", width: "32px", color: "#9CA3AF" }} />,
        DocumentName: "Photo",
        DocumentKey: "photo",
    },
    {
        icon: <InsertPhotoOutlinedIcon sx={{ height: "32px", width: "32px", color: "#9CA3AF" }} />,
        DocumentName: "Bank Statement",
        DocumentKey: "bankStatement",
    },
    {
        icon: <InsertPhotoOutlinedIcon sx={{ height: "32px", width: "32px", color: "#9CA3AF" }} />,
        DocumentName: "Income Tax Return",
        DocumentKey: "incomeTaxReturn",
    },
];


// const faqs = [
//     {
//         open: "panel1",
//         title: "What documents do I need?",
//         details: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."
//     },
//     {
//         open: "panel2",
//         title: "How long is the processing time?",
//         details: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."
//     },
//     {
//         open: "panel3",
//         title: "What are the fees involved?",
//         details: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."
//     },
// ]



const StyledWrapper = styled(Typography)({
    background: 'linear-gradient(270deg, rgba(246, 114, 0, 1) 0%, rgba(251, 78, 0, 1) 54%, rgba(255, 0, 0, 1) 100%);',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    fontWeight: 'bold',
    fontSize: "3rem",
    fontWeight: "500"
})

const StyledWrapper2 = styled(Box)({
    padding: "12px",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column"
})

const StyledWrapper3 = styled(Box)({
    border: "2px solid lightgray",
    padding: "20px 30px",
    textAlign: "center",
    borderRadius: "10px",
    height: "70%"
})
const StyledWrapper4 = styled(Box)({
    backgroundColor: "#EFF6FF",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "20px",
    marginRight: "10px",
    display: "flex"
})

const StyledWrapper5 = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "0px",
    borderTopRightRadius: "20px",
    [theme.breakpoints.up("sm")]: {
        borderBottomLeftRadius: "20px",
        borderTopRightRadius: "0px",
        height: 300,
    },
    [theme.breakpoints.up("md")]: {
        height: 400
    },
    [theme.breakpoints.up("lg")]: {
        height: 500
    },
}))

const StyledWrapper6 = styled(Box)(({ theme }) => ({
    width: "100%",
    height: 100,
    objectFit: "cover",
    [theme.breakpoints.up("sm")]: {
        height: 146,
    },
    [theme.breakpoints.up("md")]: {
        height: 196,
    },
    [theme.breakpoints.up("lg")]: {
        height: 246,
    },
}))

const ImageWrapper = styled(Box)(({ borderRadius }) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
}))

const RedUnderline = () => (
    <Box display="flex">
        <Box
            sx={{
                borderBottom: "2px solid #E20000",
                width: "100px",
                mt: "4px",
            }}
        />
        <Box
            sx={{
                marginLeft: "2px",
                borderBottom: "2px solid #E20000",
                width: "2px",
                mt: "4px",
            }}
        />
    </Box>
);

const VisaInfo = () => {
    const router = useRouter()
    const { id } = useParams()
    const dispatch = useDispatch()
    const [visaInfo, setVisaInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState("panel0");
    const [open, setOpen] = useState(false);

    const fetchDestinations = async (id) => {
        try {
            setLoading(true);
            const visaInfoRes = await getVisaInfo(id);

            if (visaInfoRes.error) {
                setError(visaInfoRes.error);
            } else {
                setVisaInfo(visaInfoRes.data || []);
            }
        } catch (e) {
            setError('Error fetching destinations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations(id);
    }, [id]);

    const handleClickOpen = () => {
        dispatch(deleteExppectedDate())
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (panel) => () => {
        setExpanded((prev) => (prev === panel ? false : panel));
    };


    const vizaDetails = [
        {
            icon: <CreditCardIcon sx={{ width: "24px", height: "24px", color: "red" }} />,
            title: "Visa Type",
            details: visaInfo?.visaDetails?.visaType || "-",
        },
        {
            icon: <CalendarMonthIcon sx={{ width: "24px", height: "24px", color: "red" }} />,
            title: "Validity Period",
            details: visaInfo?.visaDetails?.validityPeriod || "-",
        },
        {
            icon: <FlightIcon sx={{ width: "24px", height: "24px", color: "red" }} />,
            title: "Entry",
            details: visaInfo?.visaDetails?.visaEntry || "-",
        },
        {
            icon: <SpeedIcon sx={{ width: "24px", height: "24px", color: "red" }} />,
            title: "Length of Stay",
            details: visaInfo?.visaDetails?.lengthOfStay || "-",
        },
    ]

    const image = [
        {
            component: "img",
            src: visaInfo?.basicDetails?.coverImage[2],
            alt: "country image",
            borderTopLeftRadius: "20px",
        },
        {
            component: "img",
            src: visaInfo?.basicDetails?.coverImage[3],
            alt: "country image",
            borderTopRightRadius: "20px",
        },
        {
            component: "img",
            src: visaInfo?.basicDetails?.coverImage[4],
            alt: "country image",
            borderBottomLeftRadius: "20px",
        },
        {
            component: "img",
            src: visaInfo?.basicDetails?.coverImage[5],
            alt: "country image",
            borderBottomRightRadius: "20px",
        },
    ]

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 15);

    // Format future date
    const formattedDate = futureDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Container>
            {loading ? <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <CircularProgress size={30} />
            </Box> :
                <Box>
                    <Grid container mt={1} spacing={1} rowSpacing={"4px"}>
                        <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <StyledWrapper5>
                                {!loading && (
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height="100%"
                                        sx={{ position: "absolute", top: 0, left: 0, borderRadius: 'inherit' }}
                                    />
                                )}
                                <img
                                    src={visaInfo?.basicDetails?.coverImage[1]}
                                    alt="country image"
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />

                            </StyledWrapper5>
                        </Grid>

                        <Grid container item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }} spacing={1} rowSpacing={"4px"}>
                            {image.map((img, index) => (
                                <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} key={index}>
                                    <StyledWrapper6>
                                        <ImageWrapper sx={{
                                            borderTopLeftRadius: {
                                                xs: 0,
                                            },
                                            borderTopRightRadius: {
                                                xs: 0,
                                                sm: index === 1 ? img.borderTopRightRadius || "0px" : "0px",
                                            },
                                            borderBottomLeftRadius: {
                                                xs: index === 2 ? img.borderBottomLeftRadius || "20px" : "0px",
                                                sm: 0,
                                            },
                                            borderBottomRightRadius: {
                                                xs: index === 3 ? img.borderBottomRightRadius || "0px" : "0px",
                                                sm:
                                                    index === 3
                                                        ? img.borderBottomRightRadius || "0px"
                                                        : index === 2
                                                            ? img.borderBottomRightRadius || "0px"
                                                            : "0px",
                                            },
                                        }}
                                        >
                                            {!loading && (
                                                <Skeleton
                                                    variant="rounded"
                                                    width="100%"
                                                    height="100%"
                                                    sx={{ position: "absolute", top: 0, left: 0, borderRadius: 'inherit' }}
                                                />
                                            )}
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                fill
                                                style={{
                                                    objectFit: "cover", width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                        </ImageWrapper>
                                    </StyledWrapper6>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* {open && <DatePicker visaId={id} open={open} handleClose={handleClose} />} */}
                    {open && <TravellerModal visaId={id} open={open} handleClose={handleClose} />}
                    <Box mt={5}>
                        <StyledWrapper>{visaInfo?.basicDetails?.countryName}</StyledWrapper>
                    </Box>


                    <Grid container mt={5} spacing={10} mb={5}>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 7, xl: 7 }}>
                            <Box>
                                <Typography variant='h4'>Visa Details <RedUnderline /></Typography>
                            </Box>
                            <Grid container spacing={2} mt={4}>
                                {vizaDetails.map((item, index) => (
                                    <Grid size={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }} key={index}>
                                        <StyledWrapper2>
                                            <Box>{item.icon}</Box>
                                            <Typography variant='caption' mt={1} color='#4B5563'>{item.title}</Typography>
                                            <Typography variant='body1' mt={1} fontWeight={500}>{item.details}</Typography>
                                        </StyledWrapper2>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box>
                                <Typography variant='h4' mt={7}>Required Documents<RedUnderline /></Typography>
                            </Box>
                            <Grid container spacing={2} mt={4}>
                                {RequiredDocuments.map((item, index) => {
                                    const documentKey = item.DocumentKey;
                                    const isDocumentVisible = visaInfo?.documents?.[documentKey];

                                    return (
                                        isDocumentVisible && (
                                            <Grid size={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }} key={index}>
                                                <StyledWrapper3>
                                                    <Box>{item.icon}</Box>
                                                    <Typography variant='subtitle1' mt={1} color='#9CA3AF'>
                                                        {item.DocumentName}
                                                    </Typography>
                                                </StyledWrapper3>
                                            </Grid>
                                        )
                                    );
                                })}
                            </Grid>

                            <Box>
                                <Typography variant='h4' mt={7}>Frequently Asked Questions<RedUnderline /></Typography>
                            </Box>
                            <Box mt={4} >
                                {visaInfo?.additionalDetails?.faqs.map((item, index) => {
                                    const panelId = `panel${index}`
                                    return (
                                        <Accordion
                                            key={panelId}
                                            expanded={expanded === panelId}
                                            onChange={handleChange(panelId)}
                                            sx={{ boxShadow: "none" }}
                                            defaultExpanded={panelId === 'panel1' ? true : false}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`${panelId}-content`}
                                                id={`${panelId}-header`}
                                            >
                                                <Typography component="span" sx={{ width: '80%', flexShrink: 0 }}>
                                                    {item.question}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    {item.answer}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}>
                            <Box border={"2px solid lightgray"} borderRadius={"20px"} padding={"30px"}>
                                <Box display={"flex"}>
                                    <StyledWrapper4 >
                                        <CalendarTodayOutlinedIcon sx={{ height: { xs: "13px", sm: "20px" }, width: { xs: "13px", sm: "20px" }, color: "red" }} />
                                        <Typography margin={"0px 5px"} fontSize={{ xs: "13px", sm: "1rem" }} variant='body1'>{formattedDate}</Typography>
                                        <CheckCircleIcon sx={{ height: { xs: "13px", sm: "20px" }, width: { xs: "13px", sm: "20px" }, color: "green" }} />
                                    </StyledWrapper4>
                                    <StyledWrapper4 >
                                        <AccessTimeIcon sx={{ height: { xs: "13px", sm: "20px" }, width: { xs: "13px", sm: "20px" }, color: "red" }} />
                                        <Typography margin={"0px 5px"} fontSize={{ xs: "13px", sm: "1rem" }} variant='body1'>{formattedTime}</Typography>
                                        <CheckCircleIcon sx={{ height: { xs: "13px", sm: "20px" }, width: { xs: "13px", sm: "20px" }, color: "green" }} />
                                    </StyledWrapper4>
                                </Box>
                                <Box>
                                    <Box mt={5} display={"flex"} justifyContent={"space-between"}>
                                        <Typography variant='h6' color='#4B5563'>Visa Fee</Typography>
                                        <Typography variant='h6'>₹{visaInfo?.visaDetails?.visaFee}</Typography>
                                    </Box>
                                    <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                                        <Typography variant='h6' color='#4B5563'>Platform Fee</Typography>
                                        <Typography variant='h6'>₹{visaInfo?.visaDetails?.vizayardFee}</Typography>
                                    </Box>
                                    <Divider style={{ margin: "20px 0px" }} />
                                    <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                                        <Typography variant='h5' fontWeight={500}>Total Amount</Typography>
                                        <Typography variant='h5'>₹{(visaInfo?.visaDetails?.visaFee || 0) + (visaInfo?.visaDetails?.vizayardFee || 0)}</Typography>
                                    </Box>
                                </Box>
                                <Box mt={3}>
                                    <CommonButton onClick={handleClickOpen} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>}
        </Container >
    )
}

export default VisaInfo