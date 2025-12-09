"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonButton from "@/components/CommonButton";
import CommonSelect from "@/components/CommonSelect";

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
    label: "Email",
    value: "Kathall@zorbeehealth.io",
  },
  {
    label: "Job Role",
    value: "Placeholder",
  },
  {
    label: "Location",
    value: "Hertfordshire",
  },
];

const options = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const NewUser = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [permission, setPermission] = useState<string | number | null>("");
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
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Profile image
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

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Permissions
              </Typography>
              <Typography
                variant="caption"
                fontWeight={400}
              >{`Please select the level of access you'd like to grant this new user.`}</Typography>

              <Box mt={2}>
                <CommonSelect
                  placeholder="Please Select...."
                  value={permission}
                  onChange={(value: string | number | null) =>
                    setPermission(value)
                  }
                  options={options}
                  sx={{
                    width: "100%",
                    height: "50px",
                    fontSize: "16px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #EAEAEA",
                  }}
                />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Account information
            </Typography>
            <Box mt={isMobile ? 2 : 4}>
              <KeyValueDetails items={account_informations} />
            </Box>
          </CommonCard>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Save details
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                This user will receive a one-time login password to access the
                admin panel.
              </Typography>

              <Stack mt={2} direction={"row"} alignItems={"center"} spacing={2}>
                <CommonButton
                  buttonText="Cancel"
                  sx={{ backgroundColor: "#E2E6EB", maxWidth: "80px" }}
                  buttonTextStyle={{ fontSize: "14px" }}
                />
                <CommonButton
                  buttonText="Submit"
                  sx={{ maxWidth: "80px" }}
                  buttonTextStyle={{ fontSize: "14px" }}
                />
              </Stack>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default NewUser;
