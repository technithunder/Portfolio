'use client'
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Typography,
    FormHelperText,
    IconButton,
    Grid,
} from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-phone-input-2/lib/style.css';
import SignInLayout from '@/components/SignInLayout';
import CommonButton from '@/components/CommonButton';
import CommonInputField from '@/components/CommonInput';
import PhoneInput from '@/components/PhoneInput';
import { updateUser } from '@/api';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '@/redux/Slice/UserSlice';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { toast } from 'react-toastify';


const schema = yup.object().shape({
    email: yup
        .string()
        .required('required')
    ,
    city: yup
        .string()
        .required('required')
    ,
});

const Email = () => {
    // const searchParams = useSearchParams();
    // const phoneNumber = searchParams.get('phoneNumber');
    const router = useRouter()
    const { login } = useAuth()
    const dispatch = useDispatch();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [fullPhoneNumber, setFullPhoneNumber] = useState('')
    const [countryCode, setCountryCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [passportFront, setPassportFront] = useState(null);
    const [passportBack, setPassportBack] = useState(null);
    const [incomeTaxReturn, setIncomeTaxReturn] = useState(null);
    const { phoneNo, user: { userId } } = useSelector((state) => state.user);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);

        });
    };
    // const onFileChangeAndUpdate = async (file) => {
    //     try {
    //         const base64File = await fileToBase64(file);  // Wait until file is converted to base64

    //         const obj = {
    //             userPhoto: base64File,
    //             // ... other data you want to send with this API call
    //         };

    //         const res = await updateUser(userId, obj);  // API call after base64 is ready

    //         if (res?.data?.status) {
    //             console.log("User updated successfully after file upload");
    //             // do whatever you want here like updating state or showing a message
    //         }
    //     } catch (err) {
    //         console.error("Error uploading file and updating user", err);
    //     }
    // };

    const handlePassportFront = async (e, data) => {
        const file = e.target.files?.[0];
        console.log("file===>", file);

        if (file) {
            const base64 = await fileToBase64(file);
            console.log("base64===>", base64);

            setPassportFront(base64);
            if (base64) {
                let obj = {
                    phoneNumber: phoneNo.number,
                    email: data?.email,
                    city: data?.city,
                    passportFront: base64,
                };
                setIsLoading(true);
                try {
                    const res = await updateUser(userId, obj);
                    toast.success("Passport Front updated successfully!");
                } catch (e) {
                    console.log(e)
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }
    const handlePassportBack = async (e, data) => {
        const file = e.target.files?.[0];
        console.log("file===>", file);

        if (file) {
            const base64 = await fileToBase64(file);
            console.log("base64===>", base64);

            setPassportBack(base64);
            if (base64) {
                let obj = {
                    phoneNumber: phoneNo.number,
                    email: data?.email,
                    city: data?.city,
                    passportBack: base64,
                };
                setIsLoading(true);
                try {
                    const res = await updateUser(userId, obj);
                    toast.success("Passport Back updated successfully!");
                } catch (e) {
                    console.log(e)
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }
    const handleIncomeTaxReturn = async (e, data) => {
        const file = e.target.files?.[0];
        console.log("file===>", file);

        if (file) {
            const base64 = await fileToBase64(file);
            console.log("base64===>", base64);

            setIncomeTaxReturn(base64);
            if (base64) {
                let obj = {
                    phoneNumber: phoneNo.number,
                    email: data?.email,
                    city: data?.city,
                    incomeTaxReturn: base64,
                };
                setIsLoading(true);
                try {
                    const res = await updateUser(userId, obj);
                    toast.success("Income Text Return updated successfully!");
                } catch (e) {
                    console.log(e)
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }

    // console.log("photoPreview===>", photoPreview);
    // console.log("passportFront===>", passportFront);
    // console.log("passportBack===>", passportBack);
    // console.log("incomeTaxReturn===>", incomeTaxReturn);
    console.log("error", errors)

    const onSubmit = async (data) => {
        let obj = {
            phoneNumber: phoneNo.number,
            email: data?.email,
            city: data?.city,
            userPhoto: photoPreview
        };

        if (fullPhoneNumber) {
            obj["alternateNo"] = fullPhoneNumber
        }

        setIsLoading(true);
        try {
            const res = await updateUser(userId, obj);
            if (res?.data?.status) {
                dispatch(setUserData({
                    photo: photoPreview,
                    email: data?.email,
                    city: data?.city,
                    altPhoneNo: fullPhoneNumber || '',
                }));
                await login()
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <SignInLayout >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '100%',
                }}
            >
                {/* <Box sx={{ cursor: "pointer", position: 'absolute', right: '20px', top: '20px', color: "#134c9b" }}>
                    <Typography variant='h6' sx={{ textDecoration: 'underline' }} onClick={manageSkipBtn}>skip</Typography>
                </Box> */}
                <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ margin: '0 auto' }}>
                        <Image
                            src="/assets/svg/logo/vizayard_footer_logo.svg"
                            height={80}
                            width={80}
                            alt="logo"
                        />
                    </Box>
                    <Box sx={{ margin: '0 auto', mt: 3, position: "relative" }}>
                        <Box sx={{ height: "100px", width: "100px", background: "lightgray", border: "1px solid black", borderRadius: "50%" }}>
                            {photoPreview ? (
                                <Image
                                    src={photoPreview}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    style={{ objectFit: 'cover', borderRadius: "50%" }}
                                />
                            ) : (
                                <Typography sx={{ textAlign: "center", lineHeight: "100px" }}>Upload</Typography>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                id="upload-photo"
                                hidden
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPhoto(file);
                                        const base64 = await fileToBase64(file);
                                        setPhotoPreview(base64);
                                    }
                                }}
                            />
                            <label htmlFor="upload-photo">
                                <IconButton
                                    component="span"
                                    sx={{
                                        position: "absolute",
                                        bottom: "0px",
                                        right: "0px",
                                        background: "#6196e4",
                                        "&:hover": {
                                            background: "lightblue",
                                        },
                                    }}
                                >
                                    <EditDocumentIcon />
                                </IconButton>
                            </label>
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <Typography variant="h3" fontWeight={500} textAlign="center">
                            What's your email?
                        </Typography>
                    </Box>

                    <Box mt={1} width="100%" display="flex" justifyContent="center">
                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            color="#626262"
                            textAlign="center"
                            width="65%"
                            lineHeight="20px"
                        >
                            We need your email to provide status updates on your visa
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box width="100%" mt={2}>
                            <CommonInputField name="email" control={control} height="40px" placeholder={"Enter Email"} />
                            {errors.email && (
                                <Box mt={2}>
                                    <FormHelperText error>{errors.email.message}</FormHelperText>
                                </Box>
                            )}
                        </Box>
                        <Box width="100%" mt={2}>
                            <CommonInputField name="city" control={control} height="40px" placeholder={"Enter City"} />
                            {errors.city && (
                                <Box mt={1}>
                                    <FormHelperText error>{errors.city.message}</FormHelperText>
                                </Box>
                            )}
                        </Box>
                        <Box mt={2}>
                            <PhoneInput sx={{ height: "40px" }} onPhoneChange={setFullPhoneNumber} code={setCountryCode} />
                        </Box>

                        {/* <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Box sx={{ background: "lightgray", mt: 2, textAlign: "center", p: "10px", borderRadius: "5px" }}>
                                    <Typography>Passport Front Photo</Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Box sx={{ background: "lightgray", mt: 2, textAlign: "center", p: "10px", borderRadius: "5px" }}>
                                    <Typography>Passport Back Photo</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ background: "lightgray", mt: 2, textAlign: "center", p: "10px", borderRadius: "5px" }}>
                            <Typography>Income Tax Return</Typography>
                        </Box> */}


                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Box
                                    component="label"
                                    htmlFor="passport-front"
                                    sx={{
                                        background: "lightgray",
                                        mt: 2,
                                        textAlign: "center",
                                        p: "10px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        display: "block",
                                    }}
                                >
                                    <Typography>Passport Front Photo</Typography>
                                    {passportFront && (
                                        <Typography variant="caption">{passportFront.name}</Typography>
                                    )}
                                    <input
                                        type="file"
                                        id="passport-front"
                                        hidden
                                        accept="image/*,.pdf"
                                        onChange={handlePassportFront}
                                    />
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                                <Box
                                    component="label"
                                    htmlFor="passport-back"
                                    sx={{
                                        background: "lightgray",
                                        mt: 2,
                                        textAlign: "center",
                                        p: "10px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        display: "block",
                                    }}
                                >
                                    <Typography>Passport Back Photo</Typography>
                                    {passportBack && (
                                        <Typography variant="caption">{passportBack.name}</Typography>
                                    )}
                                    <input
                                        type="file"
                                        id="passport-back"
                                        hidden
                                        accept="image/*,.pdf"
                                        onChange={handlePassportBack}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Box
                            component="label"
                            htmlFor="income-tax"
                            sx={{
                                background: "lightgray",
                                mt: 2,
                                textAlign: "center",
                                p: "10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                display: "block",
                            }}
                        >
                            <Typography>Income Tax Return</Typography>
                            {incomeTaxReturn && (
                                <Typography variant="caption">{incomeTaxReturn.name}</Typography>
                            )}
                            <input
                                type="file"
                                id="income-tax"
                                hidden
                                accept="image/*,.pdf"
                                onChange={handleIncomeTaxReturn}
                            />
                        </Box>
                        <Box width="100%" mt={4} display="flex" justifyContent="center">
                            <CommonButton loading={isLoading} type="submit">Confirm</CommonButton>
                        </Box>
                    </form>
                </Box>
            </Box>

        </SignInLayout>
    );
};

export default Email;
