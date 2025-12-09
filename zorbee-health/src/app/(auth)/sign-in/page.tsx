"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Import Yup and react-hook-form
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
//import icons
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//relative path imports
import CommonInput from "@/components/CommonInput";
import CommonButton from "@/components/CommonButton";
//relative api imports
import { loginApi } from "@/services/api/authApi";

const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.common.black,
}));

interface FormData {
  email: string;
  password: string;
  role?: number;
  loginType?: number;
}

interface LoginResponseData {
  data: {
    success: boolean;
    message?: string;
  };
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Required").min(6),
});

const SignIn: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");

  const toggleEyeButton = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const obj: FormData = {
        email: data.email,
        password: data.password,
        role: 6,
        loginType: 1,
      };

      const response = (await loginApi(obj)) as LoginResponseData;
      console.log(response?.data);
      if (response?.data?.success) {
        router.push(`/email?query=${encodeURIComponent(data?.email)}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        textAlign={"center"}
        fontWeight={400}
        variant={isMobile ? "h2" : "h1"}
      >
        Admin{" "}
        <Typography
          component="span"
          variant={isMobile ? "h2" : "h1"}
          fontWeight={500}
        >
          log-in
        </Typography>
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Please enter your log-in details below.
      </Typography>
      <Box mt={7} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CommonInput
              label="Email address"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...field}
            />
          )}
        />
        <Box mt={4}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CommonInput
                label="Password"
                type={isPasswordVisible ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                endAdornment={
                  <IconButton onClick={toggleEyeButton}>
                    {isPasswordVisible ? (
                      <VisibilityOffIcon />
                    ) : (
                      <RemoveRedEyeOutlinedIcon />
                    )}
                  </IconButton>
                }
                {...field}
              />
            )}
          />
        </Box>

        <NavLink href={"/forgot-password"}>
          <Typography mt={2} fontWeight={500} variant="body2">
            Forgot your password?
          </Typography>
        </NavLink>

        <Box mt={4}>
          <CommonButton
            buttonText="Sign in"
            disabled={!email || !password || password.length < 6}
            type="submit"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
