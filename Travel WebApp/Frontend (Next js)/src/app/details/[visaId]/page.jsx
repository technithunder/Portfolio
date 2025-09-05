"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import CommonInputField from '@/components/CommonInput'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { setFormData } from '@/redux/Slice/VisaApplicationslice'
import VisaApplicationLayout from '@/components/VisaApplicationLayout'
import { CircularProgress, styled } from '@mui/material'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import PreviewCard from '@/components/PreviewCard'
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import { theme } from '@/theme'
import VerifiedIcon from '@mui/icons-material/Verified';
import Image from 'next/image'
import { createVisaApplication, getSingleChildUser } from '@/api'
import PhoneInput from '@/components/PhoneInput'
import { format, parseISO } from 'date-fns'

const schema = yup.object().shape({
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    maritalStatus: yup.string().required('required'),
    gender: yup.string().required('required'),
    passportIssuedOn: yup.string().required('required'),
    dateOfBirth: yup.string().required('required'),
    passportValidTill: yup.string().required('required'),
    passportNumber: yup.string().required('required'),
    placeOfBirth: yup.string().required('required'),
    motherName: yup.string().required('required'),
    fatherName: yup.string().required('required'),
    email: yup.string().required('required'),
});

const maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Widowed', value: 'widowed' },
];
const gender = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];

const StyledWrapper = styled(Box)({
    borderRight: "1px solid lightgray",
    boxShadow: "6px 8px 20px 5px lightgray",
    width: "75%",
    height: "calc(100vh - 82px)",
    overflowY: 'auto',
    overflowX: "hidden"
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
    marginTop: "50px"
})
const StyledWrapper4 = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
})
const StyledWrapper5 = styled(Box)({
    border: "1px solid lightgray",
    marginTop: "30px",
    padding: "20px",
    borderRadius: "20px",
    width: "90%",
})
const StyledWrapper6 = styled(Box)({
    margin: "0px auto",
    width: "70%",
    marginTop: "20px"
})
const StyledWrapper7 = styled(Box)({
    display: "flex",
    alignItems: "center",
    marginTop: "15px"
})
const StyledWrapper8 = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: "160px"
})
const StyledWrapper9 = styled(Box)({
    overflow: 'hidden',
    height: "calc(100vh - 82px)",
    width: "25%",
    height: "100%"
})

const Details = () => {
    const router = useRouter()
    const photo = useSelector((state) => state.visaApplication.userPhoto)
    const passportFront = useSelector((state) => state.visaApplication.passportFrontPhoto);
    const passportBack = useSelector((state) => state.visaApplication.passportBackPhoto);
    const formData = useSelector((state) => state.visaApplication.formData);
    const step2 = useSelector((state) => state.visaApplication.step2);
    const { user: { userId } } = useSelector((state) => state.user);
    const [fullPhoneNumber, setFullPhoneNumber] = useState('')
    const [countryCode, setCountryCode] = useState("")
    const { visaId } = useParams()
    const searchParams = useSearchParams();
    const userid = searchParams.get('userid');
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState();
    const step1 = useSelector((state) => state.visaApplication.step1);
    const exppectedDate = useSelector((state) => state.visaApplication.exppectedDate);
    const userData = useSelector((state) => state.visaApplication.userData);
    const dispatch = useDispatch()
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    console.log("userdata========>", userData);


    const handleConfirmPhoto = async (data) => {
        const obj = {
            "parentUserId": userId,
            "id": step1.id,
            "step": 3,
            "visaId": visaId,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "dob": data.dateOfBirth,
            "gender": data.gender,
            "placeOfBirth": data.passportNumber,
            "passportNumber": data.passportNumber,
            "passportFrom": data.passportNumber,
            "passportIssuedOn": data.passportIssuedOn,
            "passportValidUntil": data.passportValidTill,
            "placeOfBirth": data.placeOfBirth,
            "motherName": data.motherName,
            "fatherName": data.fatherName,
            "email": data.email,
            "phoneNumber": fullPhoneNumber,
            // "countryCode": countryCode,
            "maritalStatus": data.maritalStatus,
        };
        console.log("obj===>", obj);
        try {
            setLoading(true);
            const res = await createVisaApplication(obj);
            // dispatch(step2Data(res.data));
            router.push(`/traveller-details/${visaId}`)
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
    const handleUpdateDetails = async (data) => {
        const obj = {
            "parentUserId": userId,
            "id": userid,
            "step": 3,
            "visaId": visaId,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "dob": data.dateOfBirth,
            "gender": data.gender,
            "placeOfBirth": data.passportNumber,
            "passportNumber": data.passportNumber,
            "passportFrom": data.passportNumber,
            "passportIssuedOn": data.passportIssuedOn,
            "passportValidUntil": data.passportValidTill,
            "fatherName": data.fatherName,
            "motherName": data.motherName,
            "email": data.email,
            "phoneNumber": fullPhoneNumber,
            // "countryCode": countryCode,
            "maritalStatus": data.maritalStatus,
        };

        try {
            setLoading(true);
            const res = await createVisaApplication(obj);
            // dispatch(step2Data(res.data));
            router.push(`/traveller-details/${visaId}`)
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

    console.log(errors, "errors===>")

    if (userid) {
        const fetchSingleUser = async (userid) => {
            try {
                setLoading(true);
                const user = await getSingleChildUser(userid);
                setDetails(user.data.data.childUser)
                setValue('firstName', user.data.data.childUser.extractedVisaDetails.FIRST_NAME || user.data.data.childUser.details.firstName || '')
                setValue('lastName', user.data.data.childUser.extractedVisaDetails.LAST_NAME || user.data.data.childUser.details.lastName || '')
                setValue('gender', user.data.data.childUser.details.gender || '')
                setValue('passportIssuedOn', user.data.data.childUser.extractedVisaDetails.DATE_OF_ISSUE || user.data.data.childUser.details.passportIssuedOn || '')
                setValue('dateOfBirth', user.data.data.childUser.extractedVisaDetails.DATE_OF_BIRTH || user.data.data.childUser.details.dob || '')
                setValue('passportValidTill', user.data.data.childUser.extractedVisaDetails.EXPIRATION_DATE || user.data.data.childUser.details.passportValidUntil || '')
                setValue('passportNumber', user.data.data.childUser.extractedVisaDetails.DOCUMENT_NUMBER || user.data.data.childUser.details.passportNumber || '')
                setValue('maritalStatus', user.data.data.childUser.details.maritalStatus || '')
                setValue('motherName', user.data.data.childUser.details.motherName || '')
                setValue('fatherName', user.data.data.childUser.details.fatherName || '')
                setValue('phoneNumber', user.data.data.childUser.details.phoneNumber || '')
                setFullPhoneNumber(user.data.data.childUser.details.phoneNumber)
                setValue('email', user.data.data.childUser.details.email || '')
                setValue('placeOfBirth', user.data.data.childUser.extractedVisaDetails.PLACE_OF_BIRTH
                    || user.data.data.childUser.details.placeOfBirth || '')

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

    const data = step2?.data?.extractedVisaDetails;


    const handleBack = () => {
        userid ? router.push(`/passport/${visaId}?userid=${userid}`) : router.push(`/passport/${visaId}`)
    };

    if (loading) {
        return (
            <VisaApplicationLayout>
                <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            </VisaApplicationLayout>
        );
    }

    const formatShortVisaDate = (dateString) => {
        const parsedDate = parseISO(dateString);
        return format(parsedDate, 'dd MMM');
    };
    const shortDate = formatShortVisaDate(exppectedDate);

    console.log("fullPhoneNumber===>", fullPhoneNumber);
    console.log("countryCode===>", countryCode);

    return (
        <VisaApplicationLayout>
            <Box width={"100%"} height={"100%"} sx={{ display: "flex" }}>
                <StyledWrapper>
                    <StyledWrapper2 >
                        <StyledWrapper3 >
                            <VerifiedIcon />
                            <Typography variant='body2' ml={"10px"}>Visa on {shortDate}, 12:00 PM</Typography>
                        </StyledWrapper3>
                        <Box textAlign={"center"} mt={"42px"}>
                            <Typography variant='h2' fontWeight={500}>Here's What You'll Get</Typography>
                            <Typography variant='h6' mt={2} color='#818181'>
                                Please review all the information
                            </Typography>
                        </Box>
                        <StyledWrapper4 >
                            <form onSubmit={handleSubmit(userid ? handleUpdateDetails : handleConfirmPhoto)} style={{ width: "100%" }}>
                                <StyledWrapper5 sx={{ marginX: "auto", }}>
                                    <Box mt={5} display={"flex"} justifyContent={"space-evenly"} width={"100%"}>
                                        <Image src={details?.photo || photo} width={121} height={121} alt='user Photo' style={{ borderRadius: "50%" }} />
                                        <Image src={"/assets/svg/barcode.svg"} height={100} width={247} alt='barcode' />
                                    </Box>
                                    <StyledWrapper6 >
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant='subtitle1' color='#554F4F'>Place & Date of issue :</Typography>
                                            <Typography variant='subtitle1' color='#DC0C0C'>Singapore | 2nd April, 2025</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant='subtitle1' color='#554F4F'>Valid until :</Typography>
                                            <Typography variant='subtitle1' color='#DC0C0C'>1st Jun, 2025</Typography>
                                        </Box>
                                    </StyledWrapper6>
                                    <Divider width={"100%"} sx={{ marginTop: "50px" }} />
                                    <Box sx={{ width: "95%" }}>
                                        <Typography variant='h5' textAlign={"left"} mt={4} width={"100%"}>Permitted to enter Singapore to :</Typography>
                                        <Grid container spacing={2} >
                                            <Grid size={{ md: 7 }} >

                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"} alignItems={"baseline "}>First Name</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="firstName" control={control} height={"30px"} defaultValue={data?.FIRST_NAME || formData.firstName || details?.details?.firstName} />
                                                        <FormControl error={!!errors.firstName} width={"100px"}>
                                                            {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Last Name</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="lastName" control={control} height={"30px"} defaultValue={data?.LAST_NAME || formData.lastName || details?.details?.lastName} />
                                                        <FormControl error={!!errors.lastName} width={"100px"}>
                                                            {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Marital status</Typography>
                                                    <FormControl fullWidth error={!!errors.maritalStatus}>
                                                        <Controller
                                                            name="maritalStatus"
                                                            control={control}
                                                            defaultValue={formData.maritalStatus}
                                                            render={({ field }) => (
                                                                <Select {...field} sx={{
                                                                    height: "30px", '& .MuiOutlinedInput-input': {
                                                                        padding: '0px 14px',
                                                                    },
                                                                }}>
                                                                    {maritalStatusOptions.map((option) => (
                                                                        <MenuItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.maritalStatus && <FormHelperText>{errors.maritalStatus.message}</FormHelperText>}
                                                    </FormControl>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Gender</Typography>
                                                    <FormControl fullWidth error={!!errors.gender}>
                                                        <Controller
                                                            name="gender"
                                                            control={control}
                                                            defaultValue={details?.details?.gender || formData.gender}
                                                            render={({ field }) => (
                                                                <Select {...field} sx={{
                                                                    height: "30px", '& .MuiOutlinedInput-input': {
                                                                        padding: '0px 14px',
                                                                    },
                                                                }}>
                                                                    {gender.map((option) => (
                                                                        <MenuItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                                                    </FormControl>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Passport issued on</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="passportIssuedOn" control={control} height={"30px"} defaultValue={data?.DATE_OF_ISSUE || formData.passportIssuedOn || details?.details?.passportIssuedOn} />
                                                        <FormControl error={!!errors.passportIssuedOn} width={"100px"}>
                                                            {errors.passportIssuedOn && <FormHelperText>{errors.passportIssuedOn.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Date of Birth</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="dateOfBirth" control={control} height={"30px"} defaultValue={data?.DATE_OF_BIRTH || formData.dateOfBirth || details?.details?.dob} />
                                                        <FormControl error={!!errors.dateOfBirth} width={"100px"}>
                                                            {errors.dateOfBirth && <FormHelperText>{errors.dateOfBirth.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Passport Valid Till</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="passportValidTill" control={control} height={"30px"} defaultValue={data?.EXPIRATION_DATE || formData.passportValidTill || details?.details?.passportValidUntil} />
                                                        <FormControl error={!!errors.passportValidTill} width={"100px"}>
                                                            {errors.passportValidTill && <FormHelperText>{errors.passportValidTill.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Passport number</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="passportNumber" control={control} height={"30px"} defaultValue={data?.DOCUMENT_NUMBER || formData.passportNumber || details?.details?.passportNumber} />
                                                        <FormControl error={!!errors.passportNumber} width={"100px"}>
                                                            {errors.passportNumber && <FormHelperText>{errors.passportNumber.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Place Of Birth</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="placeOfBirth" control={control} height={"30px"} defaultValue={data?.PLACE_OF_BIRTH || formData.placeOfBirth || details?.details?.placeOfBirth} />
                                                        <FormControl error={!!errors.passportNumber} width={"100px"}>
                                                            {errors.placeOfBirth && <FormHelperText>{errors.placeOfBirth.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Father's Name</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="fatherName" control={control} height={"30px"} defaultValue={data?.MIDDLE_NAME || details?.details?.fatherName || formData.fatherName} />
                                                        <FormControl error={!!errors.fatherName} width={"100px"}>
                                                            {errors.fatherName && <FormHelperText>{errors.fatherName.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                                <StyledWrapper7 >
                                                    <Typography variant='subtitle2' width={"50%"}>Mother's Name</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="motherName" control={control} height={"30px"} defaultValue={formData.motherName} />
                                                        <FormControl error={!!errors.motherName} width={"100px"}>
                                                            {errors.motherName && <FormHelperText>{errors.motherName.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </StyledWrapper7>
                                            </Grid>
                                            <Grid size={{ md: 5 }}>
                                                <Image src={details?.passport?.front || passportFront} width={310} height={220} alt='passportFront' style={{ borderRadius: "5px", marginBottom: "10px" }} />
                                                <Image src={details?.passport?.back || passportBack} width={310} height={220} alt='passportBack' style={{ borderRadius: "5px" }} />
                                            </Grid>
                                        </Grid>
                                        <Divider width={"100%"} sx={{ marginTop: "30px" }} />
                                        <StyledWrapper8 >
                                            <Box width={"70%"} >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant='subtitle2' width={"40%"}>E-mail</Typography>
                                                    <Box width={"100%"}>
                                                        <CommonInputField name="email" control={control} height={"30px"} defaultValue={formData.email} />
                                                        <FormControl error={!!errors.email} width={"100px"}>
                                                            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                                                    <Typography variant='subtitle2' width={"40%"}>Phone no.</Typography>
                                                    <PhoneInput name="phoneNumber" sx={{ height: "30px", borderRadius: "5px", color: "black" }} value={fullPhoneNumber} onPhoneChange={setFullPhoneNumber} code={setCountryCode} />
                                                </Box>
                                            </Box>
                                        </StyledWrapper8>
                                    </Box>
                                </StyledWrapper5>
                                <Box width={"92%"} mt={5} mb={5} display={"flex"} justifyContent={"space-between"} ml={5}>
                                    <Button variant="outlined" onClick={handleBack} sx={{
                                        width: "20%",
                                        borderRadius: "12px",
                                        height: "48px",
                                        fontSize: "20px",
                                        textTransform: "capitalize",

                                    }}>Back</Button>
                                    <Button
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
                                    </Button>
                                </Box>
                            </form>
                        </StyledWrapper4>
                    </StyledWrapper2>
                </StyledWrapper >
                <StyledWrapper9 >
                    <PreviewCard
                        title="Personal details"
                        titleIcon={<SensorOccupiedOutlinedIcon sx={{ height: 24, width: 24 }} />}
                        sx={{ padding: "10px 20px", }}
                    >
                        <Box sx={{ lineHeight: "10px" }}>
                            <Typography variant="body2" color="#9A9696" mb={1}>
                                We need your personal details for government-required identity verification and background checks.
                            </Typography>
                        </Box>
                    </PreviewCard>
                </StyledWrapper9>
            </Box >
        </VisaApplicationLayout >
    )
}

export default Details