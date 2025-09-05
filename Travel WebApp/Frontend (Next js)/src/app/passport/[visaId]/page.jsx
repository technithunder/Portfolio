"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import VisaApplicationLayout from '@/components/VisaApplicationLayout'
import { Button, CircularProgress, styled } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PreviewCard from '@/components/PreviewCard'
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import { theme } from '@/theme'
import VerifiedIcon from '@mui/icons-material/Verified';
import CommonButton from '@/components/CommonButton'
import Image from 'next/image'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { passportBackPhoto, passportFrontPhoto, step2Data } from '@/redux/Slice/VisaApplicationslice'
import { createVisaApplication, getSingleChildUser } from '@/api'
import { format, parseISO } from 'date-fns'

const StyledWrapper = styled(Box)({
    borderRight: "1px solid lightgray",
    boxShadow: "6px 8px 20px 5px lightgray",
    width: "75%",
    height: "100%"
})
const StyledWrapper2 = styled(Box)({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: 'calc(100vh - 82px)'
})
const StyledWrapper3 = styled(Box)({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#C71010",
    color: theme.palette.common.white,
    padding: "5px 17px",
    borderRadius: "20px",
})
const StyledWrapper4 = styled(Box)({
    display: "flex",
    alignItems: "center",
    margin: "50px",
    width: "100%",
    justifyContent: "space-evenly"
})
const StyledWrapper5 = styled(Box)(({ theme }) => ({
    height: "330px",
    width: "330px",
    backgroundColor: theme.palette.common.white,
    marginTop: "20px",
    overflow: "hidden",
    borderRadius: "12px",
}));

const StyledWrapper6 = styled(Box)({
    height: "56px",
    backgroundColor: "#DED7D7",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
})


const Passport = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);
    const { visaId } = useParams()
    const searchParams = useSearchParams();
    const userid = searchParams.get('userid');
    const { user: { userId } } = useSelector((state) => state.user);
    const step1 = useSelector((state) => state.visaApplication.step1);
    const [loading, setLoading] = useState(false);
    const [base64Photo, setBase64Photo] = useState(null);
    const [backBase64Photo, setBackBase64Photo] = useState(null);
    const [data, setData] = useState();
    const passportFront = useSelector((state) => state.visaApplication.passportFrontPhoto);
    const exppectedDate = useSelector((state) => state.visaApplication.exppectedDate);
    const passportBack = useSelector((state) => state.visaApplication.passportBackPhoto);

    // const handleImageChangeFront = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         dispatch(passportFrontPhoto(imageUrl));
    //     }
    // };
    // const handleImageChangeBack = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         dispatch(passportBackPhoto(imageUrl));
    //     }
    // };

    const handleImageChangeFront = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const front = reader.result;
                setBase64Photo(front);
                dispatch(passportFrontPhoto(front));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleImageChangeBack = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const back = reader.result;
                setBackBase64Photo(back);
                dispatch(passportBackPhoto(back));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmPhoto = async () => {
        if (!base64Photo && !backBase64Photo && !passportFront) return;

        const obj = {
            parentUserId: userId,
            id: step1.id,
            step: 2,
            visaId: visaId,
            passportFront: base64Photo || passportFront,
            passportBack: backBase64Photo || passportBack,
        };

        try {
            if (base64Photo || backBase64Photo) {

                setLoading(true);
                const res = await createVisaApplication(obj);
                // dispatch(step2Data(res.data)); 
                router.push(`/details/${visaId}`);
            }
            else if (!base64Photo && !backBase64Photo && passportFront && passportBack) {
                router.push(`/details/${visaId}`);
            }
        } catch (error) {
            console.error('API Error response:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
            });
            // alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateFront = async () => {
        if (!base64Photo && !backBase64Photo && !passportFront && !passportBack) return router.push(`/details/${visaId}?userid=${userid}`);;

        const obj = {
            parentUserId: userId,
            id: userid,
            step: 2,
            visaId: visaId,
            passportFront: base64Photo || passportFront,
            passportBack: backBase64Photo || passportBack,
        };

        try {
            if (base64Photo || passportFront || backBase64Photo || passportBack) {
                setLoading(true);
                const res = await createVisaApplication(obj);
                dispatch(step2Data(res.data));
                router.push(`/details/${visaId}?userid=${userid}`);
            }
            // else {
            //     router.push(`/details/${visaId}?userid=${userid}`);
            // }
        } catch (error) {
            console.error('API Error response:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
            });
            // alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (userid) {
        const fetchSingleUser = async (userid) => {
            try {
                setLoading(true);
                const user = await getSingleChildUser(userid);
                setData(user.data.data.childUser.passport)
            } catch (err) {
                setError('Error fetching trending destinations.');
            } finally {
                setLoading(false);
            }
        };
        useEffect(() => {
            fetchSingleUser(userid)
        }, [])
    }


    if (loading) {
        return (
            <VisaApplicationLayout>
                <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            </VisaApplicationLayout>
        );
    }
    const handleBack = () => {
        userid ? router.push(`/profile-photo/${visaId}?userid=${userid}`) : router.push(`/profile-photo/${visaId}`)
    };

    const conditionFront = base64Photo || passportFront || data?.front;
    const conditionBack = base64Photo || passportBack || data?.back;

    const formatShortVisaDate = (dateString) => {
        const parsedDate = parseISO(dateString);
        return format(parsedDate, 'dd MMM');
    };
    const shortDate = formatShortVisaDate(exppectedDate);

    return (
        <VisaApplicationLayout>
            <Box width={"100%"} height={"100%"} sx={{ display: "flex" }}>
                <StyledWrapper>
                    <StyledWrapper2 >
                        <StyledWrapper3 >
                            <VerifiedIcon />
                            <Typography variant='body2' ml={"10px"}>Visa on {shortDate}, 12:00 PM</Typography>
                        </StyledWrapper3>

                        <Box textAlign={"center"} mt={"50px"} width={"55%"}>
                            <Typography variant='h4' color='#393939'>
                                Review your Passport
                            </Typography>
                        </Box>

                        <StyledWrapper4 >
                            <StyledWrapper5 >
                                <StyledWrapper6 >
                                    <Typography variant='h6' ml={2}>Passport Front</Typography>
                                    <BorderColorTwoToneIcon onClick={() => frontInputRef.current.click()} sx={{ marginRight: "16px", cursor: 'pointer' }} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={frontInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleImageChangeFront}
                                    />
                                </StyledWrapper6>
                                <Box sx={{ backgroundColor: "#F5F5F5", height: "100%", padding: "10px" }}>
                                    <Image src={conditionFront} height={255} width={310} alt="Upload" />
                                </Box>

                            </StyledWrapper5>
                            <StyledWrapper5 >
                                <StyledWrapper6 >
                                    <Typography variant='h6' ml={2}>Passport Back</Typography>
                                    <BorderColorTwoToneIcon onClick={() => backInputRef.current.click()} sx={{ marginRight: "16px", cursor: "pointer" }} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={backInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleImageChangeBack}
                                    />
                                </StyledWrapper6>
                                <Box sx={{ backgroundColor: "#F5F5F5", height: "100%", padding: "10px" }}>
                                    <Image src={conditionBack} height={255} width={310} alt="Upload" />
                                </Box>

                            </StyledWrapper5>
                        </StyledWrapper4>

                        <Box width={"90%"} mt={5} mb={5} display={"flex"} justifyContent={"space-between"} >
                            <Button variant="outlined" onClick={handleBack} sx={{
                                width: "20%",
                                borderRadius: "12px",
                                height: "48px",
                                fontSize: "20px",
                                textTransform: "capitalize",

                            }}>Back</Button>
                            {/* <Button
                                        variant="contained"
                                        type="submit"
                                        sx={{
                                            backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 95%)',
                                            width: "20%",
                                            borderRadius: "12px",
                                            height: "48px",
                                            fontSize: "20px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        Continue
                                    </Button> */}
                            <CommonButton children={"Looks Good !!"} onClick={userid ? handleUpdateFront : handleConfirmPhoto} sx={{ width: "30%" }} />
                        </Box>
                    </StyledWrapper2>
                </StyledWrapper>
                <Box width={"25%"} height={"100%"} >
                    <PreviewCard
                        title="Passport Scan"
                        titleIcon={<SensorOccupiedOutlinedIcon sx={{ height: 24, width: 24 }} />}
                        sx={{ padding: "10px 20px", }}
                    >
                        <Box sx={{ lineHeight: "10px" }}>
                            <Typography variant="body2" color="#9A9696" mb={1}>
                                We need your passport scan for government-required identity verification and background checks.
                            </Typography>
                            <Typography variant="caption" color="#9A9696">
                                1.  Open front ID page of your passport
                            </Typography><br />
                            <Typography variant="caption" color="#9A9696">
                                2.  Align passport page in the frame
                            </Typography><br />
                            <Typography variant="caption" color="#9A9696" >
                                3.  Follow directions on the screen for the perfect capture
                            </Typography>
                        </Box>
                    </PreviewCard>
                </Box>
            </Box>
        </VisaApplicationLayout >
    )
}

export default Passport