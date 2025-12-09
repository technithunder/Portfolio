"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonSelect from "@/components/CommonSelect";
import CommonChip from "@/components/CommonChip";
import CommonNoteCard from "@/components/CommonNoteCard";

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

const Profile = () => {
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
                Account status
              </Typography>
              <Typography variant="caption" fontWeight={400}>
                Here is the current status of this Zorbee staff member. You can
                also add an internal note to explain any suspensions.
              </Typography>
              <Stack
                mt={isMobile ? 2 : 3}
                direction={isMobile ? "column" : "row"}
                alignItems={isMobile ? "flex-start" : "center"}
                spacing={isMobile ? 1 : 3}
              >
                <CommonChip
                  title="Suspended"
                  textStyle={{ color: "#9C3C3C" }}
                  style={{ backgroundColor: "#F4A6A6" }}
                />
                <Box>
                  <Typography variant="caption" fontWeight={400}>
                    Date suspended
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="caption"
                    fontWeight={500}
                  >
                    5th February 2025 | 19.30PM
                  </Typography>
                </Box>
              </Stack>

              <Box mt={2}>
                <CommonNoteCard
                  title="Internal notes"
                  rows={1.2}
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                />
              </Box>
            </CommonCard>
            {/* <VerificationStatus /> */}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
