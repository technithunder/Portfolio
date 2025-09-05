'use client';
import React, { createContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/Slice/UserSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()
    const router = useRouter();
    const pathName = usePathname();

    const { user: { token }, userData } = useSelector((state) => state.user);


    useEffect(() => {
        const checkAuthStatus = () => {
            setIsLoading(true);

            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

            const publicRoutes = [
                '/sign-in',
                '/otp-verification',
                '/email',
            ];

            const isDashboardIdRoute = pathName.startsWith('/dashboard/');


            if (token) {
                if (publicRoutes.includes(pathName)) {
                    router.replace('/');
                }
            }

            if (token && !userData.email) {
                router.push('/email')
            }
            // else if (!token || !isAuthenticatedFromStorage) {
            //     // Only redirect if not on a public route AND not on a dashboard ID route
            //     if (!publicRoutes.includes(pathName) && !isDashboardIdRoute) {
            //         router.replace('/');
            //     }
            // }

            setIsLoading(false);
        };

        checkAuthStatus();
    }, [pathName, router]);

    const login = () => {
        setIsAuthenticated(true);
        router.replace('/');
    };

    const logout = () => {
        // localStorage.removeItem('token');
        // localStorage.removeItem('userId');
        // localStorage.removeItem('isAuthenticate');
        setIsAuthenticated(false);
        dispatch(logoutUser())
        router.replace('/sign-in');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {isLoading ? (
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress sx={{ fontSize: '24px' }} />
                </Box>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};