'use client'
import React, { useState } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import 'react-phone-input-2/lib/style.css';
import SignInLayout from '@/components/SignInLayout';
import CommonButton from '@/components/CommonButton';
import PhoneInput from '@/components/PhoneInput';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/api';
import { useDispatch } from 'react-redux';
import { setPhoneNo } from '@/redux/Slice/UserSlice';


const SignIn = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [fullPhoneNumber, setFullPhoneNumber] = useState('')
    const [countryCode, setCountryCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const onClickContinueBtn = async () => {
        const obj = {
            countryCode: countryCode,
            phoneNumber: fullPhoneNumber,
        };

        setIsLoading(true);
        try {
            const res = await loginApi(obj);
            if (res?.data?.status) {
                dispatch(setPhoneNo({
                    countryCode: countryCode,
                    number: fullPhoneNumber,
                }));
                router.push('/otp-verification');
            }
        } catch (error) {
            console.error('Login API Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SignInLayout >
            <Box
                // component="form"
                // onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: "100%"
                }}
            >
                <Box sx={{ width: '60%', display: "flex", flexDirection: 'column' }}>
                    <Box sx={{ margin: "0px auto", cursor: "pointer" }} onClick={() => router.push('/')}>
                        <Image
                            src="/assets/svg/logo/vizayard_footer_logo.svg"
                            height={120}
                            width={120}
                            alt="logo"
                        />
                    </Box>
                    {/* <Box mt={5}>
                        <Typography variant="h2" fontWeight={500} textAlign="center" color='#E50C0C'>
                            Visas on time
                        </Typography>
                        <Typography variant="h2" fontWeight={500} textAlign="center" >
                            And sign ups in no time.
                        </Typography>
                    </Box> */}
                    <Box mt={3} >
                        <Typography variant="subtitle1" fontWeight={500} lineHeight={"20px"}>
                            What's your phone?
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={500} color='#626262' lineHeight={"18px"}>
                            We will provide status updates on your visa
                        </Typography>
                    </Box>

                    <Box mt={1} display="flex" justifyContent="center" width={"100%"} >
                        <PhoneInput onPhoneChange={setFullPhoneNumber} code={setCountryCode} />
                    </Box>

                    <Box width="100%" mt={4} display="flex" justifyContent="center">
                        <CommonButton loading={isLoading} children={"Continue"} onClick={onClickContinueBtn} />
                    </Box>
                </Box>
            </Box>
        </SignInLayout>
    );
};

export default SignIn;
