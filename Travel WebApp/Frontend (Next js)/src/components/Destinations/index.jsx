"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TrendingDestinationsCard from '@/components/TrendingDestinationsCard';
import PopularDestinationsCard from '../PopularDestinationsCard';
import { useRouter } from 'next/navigation';
import { getAllVisas, getTrendingVisas } from '@/api';
import { CircularProgress, Pagination, PaginationItem, Stack, styled, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const StyledWrapper3 = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: "-15px",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        top: "-20px",
    },
    [theme.breakpoints.up("md")]: {
        top: "-25px",
    },
    [theme.breakpoints.up("lg")]: {
        top: "-30px",
    },
}));

const StyledWrapper2 = styled(Box)(({ theme }) => ({
    backgroundColor: "#F6F5F5",
    marginLeft: "10px",
    height: "40px",
    width: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",

    [theme.breakpoints.up("sm")]: {
        height: "50px",
        width: "50px",
    },
    [theme.breakpoints.up("md")]: {
        height: "60px",
        width: "60px",
    },
    [theme.breakpoints.up("lg")]: {
        height: "70px",
        width: "70px",
    },
}));

const searchFieldSx = {
    width: { xs: "270px", sm: "500px", md: "600px", lg: "685px" },
    backgroundColor: "#F6F5F5",
    borderRadius: "12px",
    height: { xs: "40px", sm: "50px", md: "60px", lg: "70px" },
    "& .MuiOutlinedInput-root": {
        height: "100%",
        borderRadius: "12px",
        "& fieldset": {
            border: "none",
        },
        "& input": {
            height: "100%",
            padding: "0 0px",
            fontSize: { xs: "13px", sm: "13px", md: "15px", lg: "20px" },
            display: "flex",
            alignItems: "center",
        },
    },
};

const Destinations = () => {
    const [trendingDestinations, setTrendingDestinations] = useState([]);
    const [popularDestinations, setPopularDestinations] = useState([]);
    const [page, setPage] = useState();
    const [totalPages, setTotalPages] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchTrendingDestinations = async () => {
        try {
            setLoading(true);
            const trendingRes = await getTrendingVisas();

            if (trendingRes.error) {
                setError(trendingRes.error);
            } else {
                setTrendingDestinations(trendingRes.data || []);
            }
        } catch (err) {
            setError('Error fetching trending destinations.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTrendingDestinations();
    }, [])

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const fetchPopularDestinations = async () => {
        try {
            setLoading(true);
            const res = await getAllVisas({ limit: 10, page: 1, query: searchTerm });

            if (res.error) {
                setError(res.error);
            } else {
                const newVisas = res.data.visas || [];
                setPopularDestinations(newVisas);
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            setError("Error fetching popular destinations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularDestinations()
    }, [])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchPopularDestinations = async () => {
                setLoading(true);
                try {
                    const res = await getAllVisas({ page, limit: 10, query: searchTerm });
                    if (res.error) {
                        setError(res.error);
                    } else {
                        setPopularDestinations(res.data.visas || []);
                        setTotalPages(res.data.totalPages || 1);
                    }
                } catch (err) {
                    setError("Error fetching popular destinations.");
                } finally {
                    setLoading(false);
                }
            };

            fetchPopularDestinations();
        }, 500); // debounce delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);



    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }


    return (
        <Container>
            {loading ? <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "119vh",
                    width: "100%",
                }}
            >
                <CircularProgress size={30} />
            </Box> :
                <Box>
                    <StyledWrapper3 >
                        <TextField
                            placeholder="Search destinations"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={searchFieldSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* <StyledWrapper2>
                            <FilterListIcon sx={{ height: { xs: "15px", sm: "20px", md: "25px", lg: "30px" }, width: { xs: "15px", sm: "20px", md: "25px", lg: "30px" } }} />
                        </StyledWrapper2> */}
                    </StyledWrapper3>
                    <Box mt={6}>
                        {popularDestinations && popularDestinations.length > 0 ? (
                            <>
                                <Typography
                                    variant="h2"
                                    fontSize={{ xs: "1.5rem", sm: "1.75rem", md: "2rem" }}
                                    mb={3}
                                >
                                    Popular Destinations
                                </Typography>

                                <Grid container spacing={4} mt={6} mb={10}>
                                    {popularDestinations.map((item, index) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={index}>
                                            <PopularDestinationsCard
                                                onclick={() => router.push(`/dashboard/${item.id}`)}
                                                country={item.basicDetails.countryName}
                                                image={item.basicDetails.coverImage[0]}
                                                days={item.basicDetails.expectedTime}
                                                price={item?.visaDetails?.visaFee}
                                                success={item.basicDetails.successRate}
                                                title={item.basicDetails.countryName}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) :
                            <Typography variant='h3' m={5} textAlign='center'>
                                No Country Available
                            </Typography>}
                        <Stack spacing={5} mb={3} direction="row" justifyContent="center">
                            {totalPages > 1 && (
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    variant="outlined"
                                    color="primary"
                                    siblingCount={1}
                                    boundaryCount={1}
                                />
                            )}
                        </Stack>
                    </Box>

                    <Box mt={{ xs: 3, sm: 4, md: 3 }} mb={5}>
                        {trendingDestinations && trendingDestinations.length > 0 && (
                            <>
                                <Typography
                                    variant="h2"
                                    fontSize={{ xs: "1.5rem", sm: "1.75rem", md: "2rem" }}
                                    mb={3}
                                >
                                    Trending Destinations
                                </Typography>

                                <Grid container spacing={4}>
                                    {trendingDestinations.map((item, index) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={index}>
                                            <TrendingDestinationsCard
                                                onclick={() => router.push(`/dashboard/${item.id}`)}
                                                image={item.basicDetails.coverImage[0]}
                                                title={item.basicDetails.countryName}
                                                subtitle={item.basicDetails.countryName}
                                                days={item.basicDetails.expectedTime}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Box>
                </Box>}
        </Container>
    );
};

export default Destinations;
