import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CommonButton from '../CommonButton';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { theme } from '@/theme';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'; // make sure to install moment if not already
import { deleteAll } from '@/redux/Slice/VisaApplicationslice';

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

const StyledWrapper = styled(Box)(({ theme }) => ({
    padding: "5px",
    backgroundColor: "#F5F5F5",
    display: "flex",
    borderRadius: "25px",
    margin: "0px auto",
    justifyContent: "space-between",
}));

const StyledWrapper2 = styled(Box)({
    borderRadius: "20px",
    cursor: "pointer",
    userSelect: "none"
});

const StyledWrapper3 = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "0px",
    overflow: "hidden",
    height: "265px",
    [theme.breakpoints.up("sm")]: {
        height: "325px",
        marginLeft: "50px",
    },
}));

export default function DatePicker({ open, handleClose, visaId }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [date, setDate] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const { user: { token } } = useSelector((state) => state.user);


    const handleFixedClick = () => {
        if (!date) setDate(true);
    };

    const handleFlexibleClick = () => {
        if (date) setDate(false);
    };

    useEffect(() => {
        if (selectedDate) {
            const day = moment(selectedDate).date();
            const dayWithSuffix = moment(selectedDate).format('Do').replace(/\d+/, day); // ensures no superscript
            const formattedDate = `${dayWithSuffix} ${moment(selectedDate).format('MMMM, YYYY')}`;

            // Optional: router.push with query
            // router.push(`/profile-photo?date=${encodeURIComponent(formattedDate)}`);
        }
    }, [selectedDate]);

    const handleApplyNow = () => {
        dispatch(deleteAll())
        token ? router.push(`/profile-photo/${visaId}`) : router.push('/sign-in')
    }


    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 0 }} variant='h3' id="customized-dialog-title" textAlign={"center"}>
                Select the Departure Date
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

            <StyledWrapper>
                <StyledWrapper2 onClick={handleFixedClick} p={{ xs: "5px 15px", sm: "5px 25px" }} sx={{ backgroundColor: (date ? theme.palette.common.white : "transparent") }}>
                    <Typography variant='h6' fontSize={{ xs: "0.85rem", sm: "1.125rem" }} color={date ? 'red' : "black"}>Fixed Date</Typography>
                </StyledWrapper2>
                <StyledWrapper2 onClick={handleFlexibleClick} p={{ xs: "5px 15px", sm: "5px 25px" }} sx={{ backgroundColor: (date ? "transparent" : theme.palette.common.white) }}>
                    <Typography variant='h6' fontSize={{ xs: "0.85rem", sm: "1.125rem" }} color={date ? 'black' : "red"} >Flexible</Typography>
                </StyledWrapper2>
            </StyledWrapper>

            {date ? (
                <DialogContent sx={{
                    p: 0, m: 1, display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            disablePast
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                            }}
                            slotProps={{
                                toolbar: { toolbarFormat: 'ddd DD MMMM', hidden: true },
                                actionBar: { actions: [] },
                            }}
                            sx={{
                                '& .MuiPickersDay-root.Mui-selected': {
                                    background: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 95%)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 95%)',
                                    },
                                },
                                '& .MuiDateCalendar-root': {
                                    height: '100%',
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                    width: "280px",
                                    justifyContent: "center"
                                },
                                '& .MuiPickersDay-root': {
                                    height: "36px",
                                    width: "36px",
                                },
                                '& .MuiDayCalendar-header': {
                                    justifyContent: "center"
                                },
                                '& .MuiDayCalendar-weekContainer': {
                                    justifyContent: "center"
                                },
                                '& .MuiDayCalendar-slideTransition': {
                                    minHeight: "200px"
                                },
                                '& .MuiDayCalendar-weekDayLabel': {
                                    height: "36px",
                                    width: "36px"
                                },
                                [theme.breakpoints.down('sm')]: {
                                    '& .MuiPickersDay-root': {
                                        height: '28px',
                                        width: '28px',
                                    },
                                    '& .MuiDayCalendar-weekDayLabel': {
                                        height: '28px',
                                        width: '28px',
                                    },
                                    '& .MuiDayCalendar-slideTransition': {
                                        minHeight: "155px"
                                    },
                                    '& .MuiPickersCalendarHeader-root': {
                                        paddingLeft: "55px",
                                        width: "230px",
                                        justifyContent: "center"
                                    },
                                }
                            }}
                        />
                    </LocalizationProvider>
                </DialogContent>
            ) : (
                <StyledWrapper3>
                    <Typography variant='h5'>working progress...</Typography>
                </StyledWrapper3>
            )}

            <DialogActions>
                <CommonButton sx={{ height: 48 }} disabled={!selectedDate} onClick={handleApplyNow} />
            </DialogActions>
        </BootstrapDialog>
    );
}
