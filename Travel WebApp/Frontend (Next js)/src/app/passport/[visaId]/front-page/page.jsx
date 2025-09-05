"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import VisaApplicationLayout from '@/components/VisaApplicationLayout'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Button, CircularProgress, styled } from '@mui/material'
import PreviewCard from '@/components/PreviewCard'
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import { theme } from '@/theme'
import VerifiedIcon from '@mui/icons-material/Verified';
import CommonButton from '@/components/CommonButton'
import Image from 'next/image'
import { passportFrontPhoto, step2Data } from '@/redux/Slice/VisaApplicationslice'
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
    height: 'calc(100vh - 82px)',
    position: "relative"
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
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    margin: "50px",
    width: "100%"
})
const StyledWrapper5 = styled(Box)({
    height: "260px",
    width: "370px",
    border: "2px solid #E0E0E0",
    backgroundColor: theme.palette.common.white,
    marginTop: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    padding: "10px"
})
const StyledWrapper6 = styled(Box)({
    height: "330px",
    width: "330px",
    border: "2px solid #E0E0E0",
    backgroundColor: theme.palette.common.white,
    marginTop: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    padding: "10px"
})

const PassportFrontPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { visaId } = useParams()
    const searchParams = useSearchParams();
    const userid = searchParams.get('userid');
    const passportFront = useSelector((state) => state.visaApplication.passportFrontPhoto);
    const step2 = useSelector((state) => state.visaApplication.step2);
    const { user: { userId } } = useSelector((state) => state.user);
    const step1 = useSelector((state) => state.visaApplication.step1);
    const [loading, setLoading] = useState(false);
    const [base64Photo, setBase64Photo] = useState(null);
    const [data, setData] = useState();
    const exppectedDate = useSelector((state) => state.visaApplication.exppectedDate);


    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setBase64Photo(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateFrontPhoto = async () => {
        if (!base64Photo && !passportFront) return router.push(`/passport/${visaId}/back-page?userid=${userid}`);

        const obj = {
            parentUserId: userId,
            id: userid,
            step: 2,
            visaId: visaId,
            passportFront: base64Photo || passportFront,
        };

        try {
            if (base64Photo || passportFront) {
                dispatch(passportFrontPhoto(base64Photo || passportFront));
                setLoading(true);
                const res = await createVisaApplication(obj);
                dispatch(step2Data(res.data));
                if (res.status === true) {
                    router.push(`/passport/${visaId}/back-page?userid=${userid}`);
                }
            } else {

                router.push(`/passport/${visaId}/back-page?userid=${userid}`);
            }
        } catch (error) {

            // console.error('API Error response:', {
            //     status: error.response?.status,
            //     data: error.response?.data,
            //     headers: error.response?.headers,
            // });
            // alert(`Upload failed: ${error.response.data.errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    const handleConfirmPhoto = async () => {
        if (!base64Photo && !passportFront) return;

        const obj = {
            parentUserId: userId,
            id: step1.id,
            step: 2,
            visaId: visaId,
            passportFront: base64Photo || passportFront,
        };
        console.log(base64Photo, "base64Photo ===>")

        console.log(obj, " obj ===")


        try {
            if (base64Photo || passportFront) {
                console.log("else if ====>");
                dispatch(passportFrontPhoto(base64Photo || passportFront));
                setLoading(true);
                const res = await createVisaApplication(obj);
                dispatch(step2Data(res));
                if (res.status === true) {
                    router.push(`/passport/${visaId}/back-page`);
                }
            } else {
                dispatch(passportFrontPhoto(base64Photo || passportFront));
                console.log("else====>");
                router.push(`/passport/${visaId}/back-page`);
            }
        } catch (error) {
            // console.error('API Error response:', {
            //     status: error.response?.status,
            //     data: error.response?.data,
            //     headers: error.response?.headers,
            // });
            // alert(`Upload failed: ${error.response?.data?.errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (userid) {
        const fetchSingleUser = async (userid) => {
            try {
                setLoading(true);
                const user = await getSingleChildUser(userid);
                setData(user.data.data.childUser.passport.front)
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

    const condition = base64Photo || passportFront || data;

    const formatShortVisaDate = (dateString) => {
        const parsedDate = parseISO(dateString);
        return format(parsedDate, 'dd MMM');
    };
    const shortDate = formatShortVisaDate(exppectedDate);
    return (
        <VisaApplicationLayout>
            <Box width={"100%"} height={"100%"} sx={{ display: "flex" }}>
                <StyledWrapper>
                    <StyledWrapper2>
                        <StyledWrapper3 >
                            <VerifiedIcon />
                            <Typography variant='body2' ml={"10px"}>Visa on {shortDate}, 12:00 PM</Typography>
                        </StyledWrapper3>
                        {condition ? "" :
                            <Box textAlign={"center"} mt={"50px"} width={"55%"}>
                                <Typography variant='h4' color='#393939'>
                                    The Singapore government requied front page of your Passport
                                </Typography>
                            </Box>}

                        {condition ? <StyledWrapper4 >
                            <StyledWrapper5 >
                                <Image src={condition} height={260} width={370} alt="Upload" />
                            </StyledWrapper5>
                            <Box sx={{ width: '50%', my: 2, display: "flex", alignItems: "center" }}>
                                <Divider sx={{ color: "gray", width: "100%" }} />
                            </Box>

                            <Box>
                                <Typography variant='h6' color='#818181'>Process saved</Typography>
                            </Box>
                            <Box width={"50%"} mt={2}>
                                <CommonButton
                                    children={"Confirm Photo"}
                                    sx={{ height: 48, width: "100%", cursor: "pointer" }}
                                    onClick={userid ? handleUpdateFrontPhoto : handleConfirmPhoto}
                                />
                                <Box mt={3}>
                                    <input
                                        type="file"
                                        accept=".png, .jpg,.jpeg"
                                        onChange={handleUpload}
                                        style={{ display: "none" }}
                                        id="upload-selfie"
                                    />
                                    <label htmlFor="upload-selfie">
                                        <CommonButton
                                            children={"Re-take Photo"}
                                            sx={{ height: 48, width: "100%", cursor: "pointer" }}
                                            component="span"
                                            variant="outlined"
                                        />
                                    </label>
                                </Box>
                            </Box>
                        </StyledWrapper4> :
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "50px" }}>
                                <StyledWrapper6 sx={{ backgroundColor: theme.palette.common.white }}>
                                    <Image src={"/assets/svg/passport_upload.svg"} height={100} width={100} alt="Upload" />
                                    <Box sx={{ width: "100%", marginTop: "40px" }}>
                                        <input
                                            type="file"
                                            accept=".png, .jpg,.jpeg"
                                            onChange={handleUpload}
                                            style={{ display: "none" }}
                                            id="upload-device"
                                        />
                                        <label htmlFor="upload-device">
                                            <CommonButton
                                                children={"Upload From Device"}
                                                sx={{ height: 48, width: "100%", cursor: "pointer" }}
                                                component="span"
                                            />
                                        </label>
                                    </Box>
                                    <Typography variant='h6' color='#1A1A1A' mt={2}>File must be in .png or .jpg</Typography>
                                </StyledWrapper6>
                                <Box>
                                    <Typography margin={"20px"} color='gray' variant='body1'>OR</Typography>
                                </Box>
                                <StyledWrapper6 sx={{ backgroundColor: "#303030" }}>
                                    <Image src={"/assets/svg/passport_scan.svg"} height={100} width={100} alt="Scan" />
                                    <Box sx={{ width: "100%", marginTop: "40px" }}>
                                        <input
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            capture="environment"
                                            onChange={handleUpload}
                                            style={{ display: "none" }}
                                            id="upload-camera"
                                        />
                                        <label htmlFor="upload-camera">
                                            <CommonButton
                                                children={"Scan with Camera"}
                                                sx={{ height: 48, width: "100%", cursor: "pointer" }}
                                                component="span"
                                            />
                                        </label>
                                    </Box>
                                </StyledWrapper6>
                            </Box>}
                        <Box>
                            <Button variant="outlined" onClick={handleBack} sx={{
                                width: "200px",
                                borderRadius: "12px",
                                position: "absolute",
                                height: "48px",
                                fontSize: "20px",
                                textTransform: "capitalize",
                                left: "50px"
                            }}>Back</Button>
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
        </VisaApplicationLayout>
    )
}

export default PassportFrontPage