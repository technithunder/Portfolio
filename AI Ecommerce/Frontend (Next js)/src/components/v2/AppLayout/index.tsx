"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import Loader from "./Loader";
import { logout } from "store/slices/authSlice";
import { removeCustomer } from "store/slices/customerSlice";
import { useIdleTimer } from "react-idle-timer";

interface AuthState {
  token: string | null;
}

interface RootState {
  auth: AuthState;
}

const PUBLIC_ROUTES = ["/catelog"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const currentPath = usePathname();
  const dispatch = useDispatch();

  const isPublicRoute = PUBLIC_ROUTES.includes(currentPath) || currentPath === "/login";

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  const handleIdle = () => {
    alert("User has been idle for 30 minutes. Logging out.");
      dispatch(logout());
      dispatch(removeCustomer());
      dispatch(logout())
      router.push("/login");
    
  };

  useIdleTimer({
    timeout: 1000 * 60 * 30,
    onIdle: handleIdle,
    debounce: 500,
    crossTab: true,
  });

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout());
      dispatch(removeCustomer());
      router.push("/login");
      return;
    }

    if (!token && !isPublicRoute) {
      router.push("/login");
      return;
    }

    if (token && currentPath === "/login") {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [token, currentPath, dispatch, router, isPublicRoute]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
