"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader";
import { logout, setFcmToken } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";
import { onMessageListener } from "@/utils/firebaseUtils";
import { Avatar, Box, Typography } from "@mui/material";

const AuthWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const currentPath = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe;

    // Function to handle incoming messages
    const handleMessage = (payload) => {
      toast(
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 1,
            minWidth: 300,
          }}
          onClick={() => router.push(payload?.data?.webRedirectUrl)}
        >
          {payload?.notification?.image && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 1,
              }}
            >
              <Avatar
                src={payload.notification.image}
                alt="Notification"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                }}
                variant="rounded"
              />
            </Box>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {payload.notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {payload.notification.body}
            </Typography>
          </Box>
        </Box>
      );
      console.log("Received foreground message", payload);
    };

    // Set up the message listener
    onMessageListener(handleMessage)
      .then((unsubscribeFunction) => {
        unsubscribe = unsubscribeFunction;
      })
      .catch((err) => console.error("FCM Message Error:", err));

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (userInfo?.token) {
        try {
          const decodedToken = jwtDecode(userInfo.token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            dispatch(logout());
            router.push("/login");
            return false;
          }
        } catch (error) {
          dispatch(logout());
          router.push("/login");
          return false;
        }
      }
      return true;
    };

    const isTokenValid = checkTokenExpiry();

    if (!isAuthenticated && currentPath !== "/login") {
      router.push("/login");
    } else if (isAuthenticated && currentPath === "/login") {
      router.push("/dashboard");
    } else if (isTokenValid) {
      setIsLoading(false);
    }
  }, [isAuthenticated, userInfo, router, currentPath, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
