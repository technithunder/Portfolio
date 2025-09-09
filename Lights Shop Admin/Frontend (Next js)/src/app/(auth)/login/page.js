"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  styled,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  alpha,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//relative path imports
import { useDispatch } from "react-redux";
import { login, manageFcmToken } from "@/redux/slice/authSlice";
import { adminLogin } from "@/api";
import { toast } from "react-toastify";
import { requestFCMToken } from "@/utils/firebaseUtils";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";



const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "1200px",
  minHeight: "600px",
  borderRadius: "24px",
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
  backdrop: "blur(10px)",
  background: `linear-gradient(145deg, 
    ${alpha(theme.palette.background.paper, 0.95)} 0%, 
    ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: "hidden",
  position: "relative",
  zIndex: 1,
}));

const FormContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(6),
  position: "relative",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  minHeight: "600px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  borderRadius: "0 24px 24px 0",
  overflow: "hidden",
  background: `linear-gradient(45deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.secondary.main} 50%,
    ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, transparent 30%, ${alpha(
      theme.palette.primary.dark,
      0.3
    )} 70%)`,
    zIndex: 1,
  },
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: "url('/image.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.6,
  zIndex: 0,
  filter: "blur(1px)",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  padding: theme.spacing(4),
  borderRadius: "20px",
  background: `${alpha(theme.palette.background.paper, 0.1)}`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    transition: "all 0.3s ease",
    background: alpha(theme.palette.background.paper, 0.8),
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
    "& fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      transition: "all 0.3s ease",
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: "600",
  textTransform: "none",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
  "&:active": {
    transform: "translateY(-1px)",
  },
  "&:disabled": {
    transform: "none",
    boxShadow: "none",
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  "& .title": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "800",
    marginBottom: theme.spacing(1),
  },
}));

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [fcmtoken, setFcmToken] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
  });

  const fetchFCMToken = async () => {
    try {
      const token = await requestFCMToken();
      setFcmToken(token);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    let payload = {
      ...data,
    };
    fcmtoken && (payload.fcmtoken = fcmtoken);
    try {
      const res = await adminLogin(payload);
      if (!res?.data?.data?.token) toast.error(res?.response?.data?.message);
      dispatch(
        login({
          token: res?.data?.data?.token,
          userData: res?.data?.data,
        })
      );
      dispatch(manageFcmToken(fcmtoken));
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.errorMessage);
    }
  };

  useEffect(() => {
    fetchFCMToken();
  }, []);

  return (
    <MainWrapper>
      <StyledCard>
        <Grid container sx={{ height: "100%" }}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormContainer>
              <HeaderSection>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: (theme) =>
                        `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: (theme) =>
                        `0 10px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <AdminPanelSettingsIcon
                      sx={{ fontSize: 40, color: "white" }}
                    />
                  </Box>
                </Box>
                <Typography variant="h3" className="title">
                  Welcome Back!
                </Typography>
                <Typography variant="h5" fontWeight="600" color="primary.main">
                  Virtual Lights Admin
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  Please Login to your admin dashboard
                </Typography>
              </HeaderSection>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        placeholder="Enter your email address"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                sx={{
                                  color: "primary.main",
                                  "&:hover": {
                                    backgroundColor: (theme) =>
                                      alpha(theme.palette.primary.main, 0.1),
                                  },
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Stack>

                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 4 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                    </>
                  ) : (
                    "LOGIN"
                  )}
                </StyledButton>
              </form>
            </FormContainer>
          </Grid>

          {/* Image Section */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <ImageContainer>
              <BackgroundImage />
              <LogoContainer>
                <Image
                  src="/assets/logo.svg"
                  alt="Virtual Lights Logo"
                  width={200}
                  height={200}
                  priority
                  style={{
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <Typography
                  variant="h4"
                  color="white"
                  fontWeight="bold"
                  textAlign="center"
                  sx={{
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  Virtual Lights
                </Typography>
                <Typography
                  variant="body1"
                  color="rgba(255,255,255,0.8)"
                  textAlign="center"
                  sx={{
                    textShadow: "0 1px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  Admin Control
                </Typography>
              </LogoContainer>
            </ImageContainer>
          </Grid>
        </Grid>
      </StyledCard>
    </MainWrapper>
  );
};

export default Login;
