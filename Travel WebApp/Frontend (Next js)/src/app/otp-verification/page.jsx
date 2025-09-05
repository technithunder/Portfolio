'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    FormHelperText,
} from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-phone-input-2/lib/style.css';
import SignInLayout from '@/components/SignInLayout';
import CommonButton from '@/components/CommonButton';
import CommonInputField from '@/components/CommonInput';
import { loginApi, verifyOtp } from '@/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/Slice/UserSlice';
import { useSelector } from 'react-redux';


const schema = yup.object().shape({
    otp: yup
        .string()
        .required('otp is required')
});

const OtpVerification = () => {
    // const searchParams = useSearchParams();
    // const countryCode = searchParams.get('code');
    // const phoneNumber = searchParams.get('phone');
    const phoneNo = useSelector((state) => state.user.phoneNo);
    const phoneNumber = phoneNo?.number;
    const countryCode = phoneNo?.countryCode;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    // const { login } = useAuth()  
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [countDown, setCountDown] = useState(0)

    useEffect(() => {
        if (countDown === 0) return;
        const timer = setTimeout(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countDown]);

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            code: data?.otp,
        };
        try {
            const res = await verifyOtp(obj);
            if (res?.data?.status) {
                const userData = res?.data?.data?.user;
                const userId = res?.data?.data?.user?.id;
                const token = userData?.token;
                dispatch(setUser({ userId, token }));
                // localStorage.setItem("userId", userId)
                // localStorage.setItem("token", token)
                // await login()
                router.push('/email');
            }
        } catch (e) {
            toast.error('Please enter the correct OTP')
        } finally {
            setLoading(false);
        }
    };

    const resendOtpBtn = async () => {
        setCountDown(40);
        const obj = {
            countryCode: countryCode,
            phoneNumber: phoneNumber,
        };

        try {
            const res = await loginApi(obj);
            if (res?.data?.status) {
                toast.success(res?.data?.message || 'OTP sent successfully!')
            }
        } catch (error) {
            console.error('Login API Error:', error);
        }
    }


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
                <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ margin: '0 auto' }}>
                        <Image
                            src="/assets/svg/logo/vizayard_footer_logo.svg"
                            height={120}
                            width={120}
                            alt="logo"
                        />
                    </Box>

                    <Box mt={3}>
                        <Typography variant="h2" fontWeight={500} textAlign="center">
                            OTP Verification
                        </Typography>
                    </Box>

                    <Box mt={2} width="100%" display="flex" justifyContent="center">
                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            color="#626262"
                            textAlign="center"
                            width="65%"
                            lineHeight="20px"
                        >
                            Enter the 6 digit code which we sent to your number *{phoneNumber?.slice(-4)}
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box width="100%" mt={2}>
                            <CommonInputField name="otp" control={control} height="50px" inputProps={{ maxLength: 6 }} placeholder={"Enter otp"} />
                            {errors.otp && (
                                <Box mt={1}>
                                    <FormHelperText error>{errors.otp.message}</FormHelperText>
                                </Box>
                            )}
                        </Box>
                        <Typography
                            my={1}
                            sx={{
                                cursor: countDown === 0 ? 'pointer' : 'not-allowed',
                                color: countDown === 0 ? '#007bff' : '#999',
                                textAlign: 'right',
                            }}
                            onClick={resendOtpBtn}
                        >
                            {countDown > 0 ? `Resend OTP in ${countDown}s` : 'Resend OTP'}
                        </Typography>

                        <Box width="100%" mt={4} display="flex" justifyContent="center">
                            <CommonButton type="submit" loading={loading}>Continue</CommonButton>
                        </Box>
                    </form>
                </Box>
            </Box>

        </SignInLayout>
    );
};

export default OtpVerification;
