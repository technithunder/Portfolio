"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  IconButton,
  Stack,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import ApproveButton from "@/components/carers/profile/ApproveButton";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
// import VerificationStatus from "@/components/carers/profile/VerificationStatus";
import Specalisations from "@/components/carers/profile/Specalisations";
import ProfileCard from "@/components/Cards/Profile";
import CommonNoteCard from "@/components/CommonNoteCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import Documentation from "@/components/carers/Documentation";
import CommonChip from "@/components/CommonChip";
import { getSingleProviderInfo } from "@/services/api/providerApi";
import { ProviderProfileResponse } from "@/types/providerProfileTypes";

const ActiveStatus = styled(Box)(({}) => ({
  padding: "8px 16px",
  border: "1px solid #6A9F69",
  backgroundColor: "#C8E4C0",
  borderRadius: "8px",
}));

interface ParamsProps {
  id: string;
}

const Profile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as unknown as ParamsProps;
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [providerProfileInfo, setProviderInfo] = useState<
    ProviderProfileResponse["data"]["data"] | null
  >(null);

  useEffect(() => {
    if (params?.id) {
      fetchSingleProfile(params?.id);
    }
  }, [params?.id]);

  const fetchSingleProfile = async (id: string) => {
    try {
      const response = (await getSingleProviderInfo(
        id
      )) as ProviderProfileResponse;
      console.log("=>103", response?.data?.data);
      if (response?.data?.success) {
        setProviderInfo(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Engagement rate",
        description: "+12% vs last 30 days",
        count: `${providerProfileInfo?.engagementRate}%`,
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Response Rate",
        description: "+12% vs last 30 days",
        count: `${providerProfileInfo?.responseRate}%`,
      },
      {
        icon: "/assets/svg/provider/profile/Calendar-1--Streamline-Ultimate.svg",
        title: "Pricing",
        description: "+12% vs last 30 days",
        count: providerProfileInfo?.pricing
          ? `${providerProfileInfo?.pricing}/week`
          : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Availability status",
        description: "+12% vs last 30 days",
        count: "N/A",
      },
    ];
  }, [providerProfileInfo]);

  const account_informations = useMemo(() => {
    return [
      {
        label: "Business name",
        value: providerProfileInfo?.businessName || "N/A",
      },
      {
        label: "Contact Number",
        value: providerProfileInfo?.contactNo || "N/A",
      },
      {
        label: "Email",
        value: providerProfileInfo?.email || "N/A",
      },
      { label: "Address", value: providerProfileInfo?.address || "N/A" },
      {
        label: "Service area",
        value: providerProfileInfo?.serviceArea || "N/A",
      },
    ];
  }, [providerProfileInfo]);

  console.log(providerProfileInfo);

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography variant="h6" fontWeight={500}>
              {providerProfileInfo?.fullName}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isMobile && (
              <>
                <Box>
                  <Typography variant="caption" fontWeight={400}>
                    Last active
                  </Typography>
                  <Typography
                    component={"p"}
                    variant="caption"
                    fontWeight={500}
                  >
                    {moment(providerProfileInfo?.updatedAt).format(
                      "Do MMMM YYYY"
                    )}
                  </Typography>
                </Box>
                <ActiveStatus>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    color={"#6A9F69"}
                  >
                    Active
                  </Typography>
                </ActiveStatus>
              </>
            )}
            <IconButton onClick={(event) => handleActionClick(event)}>
              <MoreVertSharpIcon style={{ color: "#000000" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {["Deactive account", "Remove account"].map((action, index) => (
                <MenuItem key={index} onClick={handleClose}>
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        {isMobile && (
          <Stack
            mt={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Last active
              </Typography>
              <Typography component={"p"} variant="caption" fontWeight={500}>
                {moment(providerProfileInfo?.updatedAt).format("Do MMMM YYYY")}
              </Typography>
            </Box>
            <ActiveStatus>
              <Typography variant="caption" fontWeight={500} color={"#6A9F69"}>
                Active
              </Typography>
            </ActiveStatus>
          </Stack>
        )}

        <Box mt={4} width={"100%"} height={"100%"}>
          <Grid2 container spacing={2}>
            {data.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ lg: 3, xl: 3, md: 6, sm: 6, xs: 12 }}
                >
                  <ProfileCard
                    path={ele.icon}
                    alt={ele.icon}
                    title={ele.title}
                    count={ele.count}
                    description={ele.description}
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
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
                    src={"/assets/images/Rectangle.jpg"}
                    alt="profile-pic"
                    height={182}
                    width={182}
                  />
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecorationLine: "underline",
                      mt: 1,
                    }}
                  >
                    Replace logo
                  </Typography>
                  <Box mt={2}>
                    <ApproveButton />
                  </Box>

                  <Box mt={4}>
                    <KeyValueDetails items={account_informations} />
                  </Box>
                </Box>
                <Box mt={4}>
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
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <Specalisations
                title="Services"
                specialisations={[
                  "Oncology",
                  "Cardiology",
                  "Neurology",
                  "Gynaecology",
                  "Paediatrics",
                  "Urology",
                ]}
              />
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={500}>
                    Team members
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() =>
                      router.push("/providers/overview/team-members")
                    }
                    sx={{ color: "black" }}
                  >
                    View all
                  </Button>
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
              <Documentation Documentations={[1, 2, 3]} />
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

                <Box mt={3}>
                  <Typography mb={2} fontSize={"12px"}>
                    Do they currently have availability?
                  </Typography>
                  <CommonChip title={"Yes"} variant="primary" />
                </Box>
                <Box mt={3}>
                  <Typography mb={2} fontSize={"12px"}>
                    Vacant beds
                  </Typography>
                  <CommonChip title={"20"} variant="primary" />
                </Box>
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

            <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Header image
                </Typography>

                <Box mt={4}>
                  <img
                    src="/assets/images/RectangleFullImg.png"
                    alt="profile-pic"
                    width={"100%"}
                  />
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecorationLine: "underline",
                      mt: 1,
                    }}
                  >
                    Replace image
                  </Typography>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <Box mt={4}>
        <CommonCard>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={500}>
              Image gallery
            </Typography>
            <Button
              sx={{
                fontSize: "20px",
                border: "1px solid #518ADD",
                background: "#ECF2FB",
                padding: "0px 20px !important",
                color: "#518ADD",
              }}
            >
              +
            </Button>
          </Box>
          <Grid2 container spacing={8} mt={4}>
            {/* <Box sx={{display:"flex" , justifyContent:"space-between" }}> */}
            <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
              <img
                src="/assets/images/RectangleFullImg.png"
                alt="profile-pic"
                width={"100%"}
              />
              <Typography
                sx={{
                  cursor: "pointer",
                  textDecorationLine: "underline",
                  mt: 1,
                }}
              >
                Replace image
              </Typography>
            </Grid2>
            <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
              <img
                src="/assets/images/RectangleFullImg.png"
                alt="profile-pic"
                width={"100%"}
              />
              <Typography
                sx={{
                  cursor: "pointer",
                  textDecorationLine: "underline",
                  mt: 1,
                }}
              >
                Replace image
              </Typography>
            </Grid2>
          </Grid2>
          {/* </Box> */}
        </CommonCard>
      </Box>
    </Box>
  );
};

export default Profile;
