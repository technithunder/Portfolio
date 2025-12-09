"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IconButton, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";

const account_informations = [
  {
    label: "Title",
    value: "Mr",
  },
  {
    label: "Name",
    value: "Reuben Hale",
  },
  {
    label: "Date of birth",
    value: "9th January 2000",
  },
  {
    label: "Location",
    value: "Hertfordshire",
  },
];

const StyledCaptcha = styled(Box)(({ theme }) => ({
  height: "80px",
  border: "1px solid #518ADD",
  backgroundColor: "#ECF2FB",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",

  [theme.breakpoints.down("md")]: {
    height: "55px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "45px",
  },
}));

const MyAccount = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Typography
        sx={{ fontSize: { xs: "20px", sm: "24px", md: "30px" } }}
        fontWeight={500}
        color="common.black"
      >
        Welcome back, Kat!
      </Typography>
      <Typography variant="caption">
        This is your Zorbee admin account. Manage your details here.
      </Typography>

      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Profile image
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                {`You don't have a profile image yet. Add one to personalise and
                enhance your profile.`}
              </Typography>

              <Box mt={4}>
                <Image
                  src={imageSrc || "/assets/images/Rectangle.jpg"}
                  alt="profile-pic"
                  height={182}
                  width={182}
                />

                <input
                  type="file"
                  accept="image/*"
                  id="profile-image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <Typography
                  component="label"
                  htmlFor="profile-image-upload"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    mt: 1,
                    display: "block",
                  }}
                >
                  {imageSrc ? "Replace profile image" : "Add profile image"}
                </Typography>
              </Box>
            </CommonCard>

            <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Permissions
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {`You are currently a sub-admin for Zorbee Health. You can manage access and add Zorbee staff through the settings.`}
                </Typography>

                <Box mt={3}>
                  <CommonButton
                    buttonText="Manage access"
                    sx={{
                      backgroundColor: "#E2E6EB",
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                  />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Email
                </Typography>

                <Box mt={3}>
                  <CommonInput
                    label="Current email address"
                    sx={{ border: "1px solid #EAEAEA !important" }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Box>
                <Box mt={3}>
                  <CommonInput
                    label="New email address"
                    sx={{ border: "1px solid #EAEAEA !important" }}
                    onChange={(e) => setNewEmail(e.target.value)}
                    value={newEmail}
                  />
                </Box>
                <Box mt={3} display={"flex"} justifyContent={"flex-end"}>
                  <CommonButton
                    buttonText="Update email address"
                    sx={{
                      backgroundColor: "#E2E6EB",
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={isMobile ? 2 : 4}>
                <KeyValueDetails items={account_informations} />
              </Box>
            </CommonCard>

            <Box mt={3}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Password
                </Typography>
                <Box mt={3}>
                  <CommonInput
                    label="Current password"
                    sx={{ border: "1px solid #EAEAEA !important" }}
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                    endAdornment={
                      <IconButton
                        onClick={() =>
                          setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                        }
                      >
                        {isCurrentPasswordVisible ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <RemoveRedEyeOutlinedIcon />
                        )}
                      </IconButton>
                    }
                  />
                </Box>
                <Box mt={3}>
                  <StyledCaptcha>
                    <Typography
                      variant={"h2"}
                      letterSpacing={2.5}
                      fontWeight={400}
                      color="#518ADD"
                    >
                      {"03a9Q"}
                    </Typography>
                  </StyledCaptcha>
                </Box>
                <Box mt={3}>
                  <CommonInput
                    label="Enter captcha"
                    sx={{ border: "1px solid #EAEAEA !important" }}
                    onChange={(e) => setCaptcha(e.target.value)}
                    value={captcha}
                  />
                </Box>
                <Box mt={3}>
                  <CommonInput
                    label="New password"
                    type={isNewPasswordVisible ? "text" : "password"}
                    sx={{ border: "1px solid #EAEAEA !important" }}
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    endAdornment={
                      <IconButton
                        onClick={() =>
                          setIsNewPasswordVisible(!isNewPasswordVisible)
                        }
                      >
                        {isNewPasswordVisible ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <RemoveRedEyeOutlinedIcon />
                        )}
                      </IconButton>
                    }
                  />
                </Box>
                <Box mt={3}>
                  <Typography textAlign={"right"}>
                    Forgot your password
                  </Typography>
                </Box>
                <Box mt={3} display={"flex"} justifyContent={"flex-end"}>
                  <CommonButton
                    buttonText="Update password"
                    sx={{
                      backgroundColor: "#E2E6EB",
                      height: "36px",
                      width: "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "12px !important" }}
                  />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default MyAccount;
