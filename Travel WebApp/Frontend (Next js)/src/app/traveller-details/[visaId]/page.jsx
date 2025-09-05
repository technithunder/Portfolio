'use client'
import React, { useState } from 'react'
import { Box, Checkbox, CircularProgress, Container, IconButton, Typography } from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Image from 'next/image';
import { useEffect } from 'react';
import { getAllChildUser } from '@/api';
import { useDispatch, useSelector } from 'react-redux';
import CommonButton from '@/components/CommonButton';
import { useParams, useRouter } from 'next/navigation';
import { deleteAll } from '@/redux/Slice/VisaApplicationslice';

const TravellerDetails = () => {
    const router = useRouter()
    const { visaId } = useParams()
    const dispatch = useDispatch();
    const [allChildUser, setAllChildUser] = useState([])
    const [loading, setLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const userId = useSelector((state) => state.user?.user?.userId);
    const { user: { token } } = useSelector((state) => state.user);



    const fetchAllChildUser = async (userId) => {
        try {
            setLoading(true);
            const childUser = await getAllChildUser(userId);
            setAllChildUser(childUser.data.data)

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllChildUser(userId)
    }, [])

    const handleCheckboxChange = (userId) => {
        setSelectedUserIds((prev) => {
            if (prev.includes(userId)) {
                return prev.filter((id) => id !== userId);
            } else if (prev.length < 9) {
                return [...prev, userId];
            } else {
                return prev;
            }
        });
    };

    const isDraft = (user) => {
        const details = user.details || {};
        return (
            !details.firstName ||
            !details.lastName ||
            !details.placeOfBirth ||
            !user.photo
        );
    };

    const selectedUsers = allChildUser.filter(user =>
        selectedUserIds.includes(user.id)
    );

    const handleApplyNow = (userId) => {
        dispatch(deleteAll())
        token ? router.push(`/profile-photo/${visaId}?userid=${userId}`) : router.push('/sign-in')
    }
    const handleNewTraveller = () => {
        dispatch(deleteAll())
        token ? router.push(`/profile-photo/${visaId}`) : router.push('/sign-in')
    }

    return (
        <Container>
            <Box sx={{ width: "50%", mx: "auto", height: 'calc(100vh - 82px)', display: 'flex', flexDirection: 'column' }}>
                <Box pt={3} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant='h3'>Traveller Details</Typography>
                    <Typography variant='h6' color='gray'>{selectedUsers.length}/9 Selected</Typography>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    ) : (

                        allChildUser.map((user) => {
                            const draft = isDraft(user);
                            return (
                                <Box
                                    key={user.id}
                                    display="flex"
                                    borderBottom="1px solid lightgray"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    py={1}
                                >
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            checked={selectedUserIds.includes(user.id)}
                                            onChange={() => handleCheckboxChange(user.id)}
                                            disabled={draft}
                                        />
                                        <Image
                                            src={user?.photo}
                                            alt={'User'}
                                            height={50}
                                            width={50}
                                            style={{ borderRadius: '5px' }}
                                        />
                                        <Box ml={2}>
                                            <Typography variant="h6" fontWeight={500}>
                                                {user.details?.firstName || 'N/A'} {user.details?.lastName || ''}
                                            </Typography>
                                            <Typography color="gray" variant="caption">
                                                place of birth : {user.extractedVisaDetails?.PLACE_OF_BIRTH || 'N/A'}
                                            </Typography>
                                            {draft && (
                                                <Typography color="red" variant="caption" ml={2} fontWeight={600}>
                                                    DRAFT
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <IconButton sx={{ mr: 2 }} onClick={() => handleApplyNow(user.id)}>
                                        <ModeEditOutlineOutlinedIcon />
                                    </IconButton>
                                </Box>
                            );
                        })
                    )}
                </Box>
                <Box sx={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: '#fff',
                    py: 1,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 3,
                    borderTop: '1px solid lightgray',
                }}>
                    <CommonButton children={'Add New Traveller'} sx={{ height: "48px" }} variant='outlined' onClick={handleNewTraveller} />
                    <CommonButton children={'Next'} sx={{ height: "48px" }} isDisabled={selectedUserIds.length === 0} onClick={() => router.push(`/checkout/${visaId}`)} />
                </Box>
            </Box>
        </Container >
    )
}

export default TravellerDetails