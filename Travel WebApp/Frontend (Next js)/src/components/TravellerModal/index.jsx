import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createVisaAPI, getAllVisaCategory, getAllVisaType } from '@/api';
import { useState } from 'react';
import { useEffect } from 'react';
import CommonButton from '../CommonButton';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { exppectedDate } from '@/redux/Slice/VisaApplicationslice';

const schema = yup.object().shape({
    allVisaType: yup.string().required('required'),
    allVisaCategory: yup.string().required('required'),
    departureDate: yup.string().required('required'),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        padding: theme.spacing(4),
        borderRadius: 20,
        height: "max-content",
        width: '100%',
        maxWidth: 400,
        margin: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            margin: theme.spacing(2),
        },
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(1),
        overflow: "hidden",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5),
        },
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5),
        },
    },
    '& .MuiDialogTitle-root': {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            fontSize: '1rem',
        },
    },
}));
const StyledWrapper7 = styled(Box)({
    marginTop: "15px"
})
const TravellerModal = ({ visaId, open, handleClose }) => {
    const router = useRouter()
    const [allVisaType, setAllVisaType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allVisaCategory, setAllVisaCategory] = useState([]);
    const { user: { userId } } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const fetchAllVisaType = async () => {
        try {
            const visaType = await getAllVisaType();
            const visaCategory = await getAllVisaCategory();
            setAllVisaType(visaType.data.data)
            setAllVisaCategory(visaCategory.data.data)
        } catch (e) {
            console.log(e)
        }
    }
    const createVisa = async (data) => {
        setLoading(true);
        const date = dayjs(data?.departureDate).format('YYYY-MM-DD')
        const visaType = data?.allVisaType
        const visaCategory = data?.allVisaCategory

        const obj = {
            parentUserId: userId,
            expectedVisaDate: date,
            visaType,
            visaCategory,
            visaId: visaId,
        };
        try {
            const visaType = await createVisaAPI(obj);
            dispatch(exppectedDate(visaType.data.expectedVisaDate))     
            handleClose()
            router.push(`/traveller-details/${visaId}`)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllVisaType();
    }, [])


    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 0 }} variant='h3' id="customized-dialog-title" textAlign={"center"}>
                Traveller
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(createVisa)}>
                <StyledWrapper7>
                    <Typography variant='subtitle2' width={"100%"} mb={1}>Type Of Visa</Typography>
                    <FormControl fullWidth>
                        <Controller
                            name="allVisaType"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} sx={{ height: "40px", '& .MuiOutlinedInput-input': { padding: '0px 14px' } }}>
                                    {allVisaType.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.allVisaType && <Typography color="error">{errors.allVisaType.message}</Typography>}
                    </FormControl>
                </StyledWrapper7>

                <StyledWrapper7>
                    <Typography variant='subtitle2' width={"100%"} mb={1}>Visa Category</Typography>
                    <FormControl fullWidth>
                        <Controller
                            name="allVisaCategory"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} sx={{ height: "40px", '& .MuiOutlinedInput-input': { padding: '0px 14px' } }}>
                                    {allVisaCategory.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.allVisaCategory && <Typography color="error">{errors.allVisaCategory.message}</Typography>}
                    </FormControl>
                </StyledWrapper7>

                <StyledWrapper7>
                    <Typography variant='subtitle2' width={"100%"} mb={1}>Exppected Date</Typography>
                    <FormControl fullWidth>
                        <Controller
                            name="departureDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        {...field}
                                        disablePast
                                        onChange={(date) => field.onChange(date)}
                                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        {errors.departureDate && <Typography color="error">{errors.departureDate.message}</Typography>}
                    </FormControl>
                </StyledWrapper7>

                <DialogActions>
                    <CommonButton children={'Next'} sx={{ height: 48, mt: 4 }} disabled={loading} type="submit" />
                </DialogActions>
            </form>

        </BootstrapDialog>
    )
}

export default TravellerModal