"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import VisaApplicationLayout from '@/components/VisaApplicationLayout'
import { Button, CircularProgress, styled } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CommonButton from '@/components/CommonButton'
import PreviewCard from '@/components/PreviewCard'
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import Image from 'next/image'
import VerifiedIcon from '@mui/icons-material/Verified';
import { theme } from '@/theme'
import { step1Data, userData, userPhoto } from '@/redux/Slice/VisaApplicationslice'
import { createVisaApplication, getSingleChildUser } from '@/api'
import { format, parseISO } from 'date-fns';


const StyledWrapper = styled(Box)({
    borderRight: "1px solid lightgray",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "6px 8px 20px 5px lightgray",
    width: "75%",
    height: "100%"
})
const StyledWrapper2 = styled(Box)({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
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
    height: "270px",
    width: "270px",
    border: "2px solid black",
    borderRadius: "50%",
    backgroundColor: "#C4C4C4",
    marginTop: "20px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

const ProfilePhoto = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { visaId } = useParams()
    const searchParams = useSearchParams();
    const userid = searchParams.get('userid');
    const photo = useSelector((state) => state.visaApplication.userPhoto);
    const photoData = useSelector((state) => state.visaApplication.step1);
    const exppectedDate = useSelector((state) => state.visaApplication.exppectedDate);
    const [base64Photo, setBase64Photo] = useState(null);
    const { user: { userId } } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const visaAppState = useSelector((state) => state.visaApplication);

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

    const handleConfirmPhoto = async () => {

        if (!base64Photo && !photo) return;

        const obj = {
            parentUserId: userId,
            isNew: true,
            step: 1,
            visaId: visaId,
            photo: base64Photo,
        };


        try {
            if (photo === base64Photo) {
                router.push(`/passport/${visaId}/front-page/`);
            } else if (base64Photo) {
                dispatch(userPhoto(base64Photo));
                setLoading(true);
                const res = await createVisaApplication(obj);
                dispatch(step1Data(res.data));
                router.push(`/passport/${visaId}/front-page/`);
            } else {
                router.push(`/passport/${visaId}/front-page/`);
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

    const handleUpdatePhoto = async () => {

        if (!base64Photo && !photo) return router.push(`/passport/${visaId}/front-page?userid=${userid}`);

        const obj = {
            parentUserId: userId,
            id: userid,
            step: 1,
            visaId: visaId,
            photo: base64Photo,
        };

        try {
            if (photo === base64Photo) {
                router.push(`/passport/${visaId}/front-page?userid=${userid}`);
            } else if (base64Photo) {
                dispatch(userPhoto(base64Photo));
                setLoading(true);
                const res = await createVisaApplication(obj);
                dispatch(step1Data(res.data));
                router.push(`/passport/${visaId}/front-page?userid=${userid}`);
            } else {
                router.push(`/passport/${visaId}/front-page?userid=${userid}`);
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

    if (userid) {
        const fetchSingleUser = async (userid) => {
            try {
                setLoading(true);
                const user = await getSingleChildUser(userid);
                console.log("user===>", user);

                setData(user.data.data.childUser.photo)
                dispatch(userData(user.data.data))
            } catch (err) {
                setError('Error fetching trending destinations.');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchSingleUser(userid)
        }, [userid])
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
    const condition = base64Photo || photo || data;

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
                        {condition ?
                            "" : <Box textAlign={"center"} mt={"25px"}>
                                <Typography variant='h2' fontWeight={500}>Take a Selfie</Typography>
                                <Typography variant='h6' color='#818181'>
                                    The Singapore government required your photo
                                </Typography>
                            </Box>}

                        <StyledWrapper4 >
                            {condition && <img
                                src={condition}
                                alt="Selfie Preview"
                                style={{ width: '100%', borderRadius: '10px' }}
                            />}
                        </StyledWrapper4>

                        <Box sx={{ width: '100%', my: 4, display: "flex", alignItems: "center" }}>
                            {condition ? <Divider sx={{ color: "gray", width: "100%" }} /> : <Divider sx={{ color: 'gray', width: "100%" }}>OR</Divider>}
                        </Box>

                        <Box>
                            {condition && <Typography variant='h6' color='#818181'>Process saved</Typography>}
                        </Box>

                        <Box style={{ width: '100%', marginTop: "20px" }}>
                            {condition ?
                                <Box>
                                    <CommonButton
                                        children={"Confirm Photo"}
                                        sx={{ height: 48, width: "400px", cursor: "pointer" }}
                                        onClick={userid ? handleUpdatePhoto : handleConfirmPhoto}

                                    />
                                    <Box mt={3}>
                                        <input
                                            type="file"
                                            accept="image/*"
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
                                :
                                <Box>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        style={{ display: "none" }}
                                        id="upload-selfie"
                                    />
                                    <label htmlFor="upload-selfie">
                                        <CommonButton
                                            children={"Upload Selfie"}
                                            sx={{ height: 48, width: "100%", cursor: "pointer" }}
                                            component="span"
                                        />
                                    </label>
                                </Box>}
                        </Box>
                    </StyledWrapper2>

                </StyledWrapper>
                <Box width={"25%"} height={"100%"} >
                    <PreviewCard
                        title="Time for your closeup"
                        titleIcon={<SensorOccupiedOutlinedIcon sx={{ height: 24, width: 24 }} />}
                    >
                        <Typography variant="h6">Sample image</Typography>
                        <Image
                            src="/assets/images/preview_Profile_Photo.jpg"
                            alt="Preview Profile Photo"
                            height={150}
                            width={150}
                            style={{ borderRadius: '50%', marginTop: 20 }}
                        />
                        <Typography variant="body2" mt={3} color="#9A9696" textAlign="center">
                            The Singapore government requires your photo
                        </Typography>
                    </PreviewCard>
                </Box>

            </Box>
        </VisaApplicationLayout>
    )
}

export default ProfilePhoto