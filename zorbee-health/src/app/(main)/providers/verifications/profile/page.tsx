"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import Specalisations from "@/components/carers/profile/Specalisations";
import CommonNoteCard from "@/components/CommonNoteCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import Documentation from "@/components/carers/Documentation";
import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";

const provider_informations = [
  {
    label: "Business name",
    value: "Guernsey Cheshire Home",
  },
  {
    label: "Contact number",
    value: "+44 7781 109030",
  },
  {
    label: "Email",
    value: "guernsey@care.gg",
  },
  {
    label: "Address",
    value: "Rohais, Guernsey, GY1 1FB",
  },
];

const Profile: React.FC = () => {
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
  //   const router = useRouter();

  return (
    <Box>
      <CommonCard>
        <ApprovalListItem
          profilePic={"/assets/images/Rectangle.jpg"}
          profileName={"Guernsey Cheshire Home"}
          dateTitle={"Date joined"}
          date={"5th February 2025"}
          approvalTitle={"Awaiting verification"}
          approvalVariant={"default"}
        />
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider information
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
                    {imageSrc ? "Replace logo" : "Add logo"}
                  </Typography>
                  <Box mt={2}>
                    <ApproveButton />
                  </Box>

                  <Box mt={4}>
                    <KeyValueDetails items={provider_informations} />
                  </Box>
                </Box>
                <Box mt={2}>
                  <ApproveButton />
                </Box>
              </CommonCard>
            </Box>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  About
                </Typography>
                <Typography
                  mb={2}
                  variant="subtitle2"
                  fontSize={"12px"}
                  fontWeight={500}
                >
                  This is the providers description of their service(s).
                </Typography>
                <CommonNoteCard value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
                <Box mt={4}>
                  <ApproveButton />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <Specalisations
                title="Services"
                specialisations={[
                  "Personal care",
                  "Nursing Care",
                  "Dementia Care",
                  "Rehabilitation Services",
                  "Social Activities",
                  "Laundry and Housekeeping",
                ]}
                isApproveButton
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={500}>
                    Team members
                  </Typography>
                </Box>
                {[1, 2].map((ele, index) => {
                  return (
                    <Box key={index}>
                      <TeamMemberCard
                        name={"Reuben Hale"}
                        jobRole={"Nurse"}
                        email={"Reubenhale@care.gg"}
                        status={false}
                        permission={"Admin"}
                      />
                    </Box>
                  );
                })}
              </CommonCard>
            </Box>
          </Grid2>

          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box mt={4}>
              <Documentation Documentations={[1, 2, 3]} isApproveButton />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Pricing
                </Typography>
                <Box mt={"22px"} sx={{ display: "flex", gap: 2 }}>
                  <img
                    src="/assets/svg/carers/overview/currency_pound.svg"
                    alt="currency pound"
                    height={20}
                    width={20}
                  />
                  <Typography>£1200 per week</Typography>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Availability
                </Typography>
                <Typography mt={2}>Awaiting admin to add data</Typography>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Provider video
                </Typography>
                <Box
                  mt={4}
                  sx={{
                    background: "#E2E6EB",
                    height: "309px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="/On-Error-Sad--Streamline-Ultimate.svg"
                    alt="img"
                    height={"50px"}
                    width={"50px"}
                  />
                  <Typography mt={1} maxWidth={"120px"} fontSize={"12px"}>
                    The provider has not added a video.
                  </Typography>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Header image
                </Typography>
                <Box
                  mt={4}
                  sx={{
                    background: "#E2E6EB",
                    height: "309px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="/On-Error-Sad--Streamline-Ultimate.svg"
                    alt="img"
                    height={"50px"}
                    width={"50px"}
                  />
                  <Typography mt={1} maxWidth={"120px"} fontSize={"12px"}>
                    The provider has not added a video.
                  </Typography>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Profile;
