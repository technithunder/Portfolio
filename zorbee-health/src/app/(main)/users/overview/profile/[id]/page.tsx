"use client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
//relative path imorts
import ProfileCard from "@/components/Cards/Profile";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonCard from "@/components/Cards/Common";
import RequestCard from "@/components/Cards/Request";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";
import ViewAllButton from "@/components/ViewAllButton";
//relative api path imports
import { getSingleUserInfo } from "@/services/api/usersApi";
import { UserInfoResponse } from "@/types/singleUserInfoType";
import ApproveButton from "@/components/carers/profile/ApproveButton";

interface ParamsProps {
  id: string;
}

const ActiveStatus = styled(Box)(({}) => ({
  padding: "8px 16px",
  border: "1px solid #6A9F69",
  backgroundColor: "#C8E4C0",
  borderRadius: "8px",
}));

interface accountInfo {
  key: string;
  label: string;
  value: string | number | React.ReactNode;
}

// const data = [
//   {
//     icon: "/assets/svg/dashboard/users.svg",
//     title: "Overall bookings",
//     count: "12",
//   },
//   {
//     icon: "/assets/svg/dashboard/hospital.svg",
//     title: "Active agreements",
//     count: "2",
//   },
//   {
//     icon: "/assets/svg/dashboard/hospital.svg",
//     title: "Total saftey alerts",
//     count: "2",
//   },
//   {
//     icon: "/assets/svg/dashboard/currency.svg",
//     title: "Support tickets",
//     count: "N/A",
//   },
// ];

const cardData = [
  {
    title: "Care plan",
    description:
      "View this user's care plan, which has been created by them and not by the carer or clinician.",
    buttontext: "View care plan",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/care-plan",
  },
  {
    title: "Medical history",
    description:
      "View this user's medical history, which has been created by them and not by the carer or clinician.",
    buttontext: "View medical history",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/medical-history",
  },
  {
    title: "Medication log",
    description:
      "View all the medication that has been administered by the carer/clinician, along with any scanned prescriptions provided by the user.",
    buttontext: "View medication log",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/medication-log",
  },
  {
    title: "Health report",
    description:
      "View this user's health report. This data can be manually entered by the user, carer/clinician, or collected via a wearable device.",
    buttontext: "View health report",
    redirectionRoute:
      "/carers/overview/profile/trent-graham/client-list/health-report",
  },
];

const Profile = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams() as unknown as ParamsProps;
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = useState<
    UserInfoResponse["data"]["data"] | null
  >(null);
  const [isEditAccountInformation, setIsEditAccountInformation] =
    useState<boolean>(false);
  const [editableInfo, setEditableInfo] = useState<accountInfo[]>([]);

  console.log("==>137", userInfo);

  useEffect(() => {
    if (params?.id) {
      fetchSingleUserInfo(params?.id);
    }
  }, [params?.id]);

  const fetchSingleUserInfo = async (id: string) => {
    try {
      const response = (await getSingleUserInfo(id)) as UserInfoResponse;
      if (response?.data?.success) {
        setUserInfo(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionItemClick = () => {
    router.push("/users/overview/profile/service-agreement");
  };

  const data = useMemo(() => {
    return [
      {
        icon: "/assets/svg/dashboard/users.svg",
        title: "Overall bookings",
        count:
          userInfo?.overallBookings !== null &&
          userInfo?.overallBookings !== undefined
            ? userInfo.overallBookings === 0
              ? "0"
              : userInfo.overallBookings
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Active agreements",
        count:
          userInfo?.activeAgreements !== null &&
          userInfo?.activeAgreements !== undefined
            ? userInfo.activeAgreements === 0
              ? "0"
              : userInfo.activeAgreements
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/hospital.svg",
        title: "Total saftey alerts",
        count:
          userInfo?.totalSafetyAlerts !== null &&
          userInfo?.totalSafetyAlerts !== undefined
            ? userInfo.totalSafetyAlerts === 0
              ? "0"
              : userInfo.totalSafetyAlerts
            : "N/A",
      },
      {
        icon: "/assets/svg/dashboard/currency.svg",
        title: "Support tickets",
        count:
          userInfo?.supportTickets !== null &&
          userInfo?.supportTickets !== undefined
            ? userInfo.supportTickets === 0
              ? "0"
              : userInfo.supportTickets
            : "N/A",
      },
    ];
  }, [userInfo]);

  const account_information = useMemo(() => {
    if (!userInfo) return [];

    return [
      { label: "Title", value: "Mr", key: "title" },
      {
        label: "Name",
        value: userInfo?.fullName || "N/A",
        key: "name",
      },
      {
        label: "Date of birth",
        value: moment(userInfo?.dob).format("Do MMMM YYYY"),
        key: "date",
      },
      {
        label: "Email",
        value: userInfo?.email || "N/A",
        key: "email",
      },
      {
        label: "Gender",
        value: userInfo?.carerGender?.name || "N/A",
        key: "gender",
      },
      {
        label: "Address",
        value: userInfo?.address || "N/A",
        key: "address",
      },
      {
        label: "Login Method",
        value: "N/A",
        key: "loginMethod",
      },
    ];
  }, [userInfo]);

  useEffect(() => {
    if (isEditAccountInformation) {
      setEditableInfo(account_information);
    }
  }, [isEditAccountInformation, account_information]);

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (key: string | undefined, value: string) => {
    if (key === undefined) return;

    setEditableInfo((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const onClick = () => {
    setIsEditAccountInformation(true);
  };

  const onCancel = () => {
    setIsEditAccountInformation(false);
  };

  const onSave = () => {
    console.log("Saving updated info:", editableInfo);
    setIsEditAccountInformation(false);
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Image
              src={`/assets/images/profile.jpg`}
              alt="user-profile-pic"
              height={60}
              width={60}
              style={{ borderRadius: "50px" }}
            />
            <Typography variant="h6" fontWeight={500}>
              {userInfo?.fullName}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {!isTablet && (
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.careStartDate).format("Do MMMM YYYY")}
                </Typography>
              </Box>
            )}
            {!isTablet && (
              <ActiveStatus>
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={"#6A9F69"}
                >
                  Active
                </Typography>
              </ActiveStatus>
            )}
            {!isTablet && (
              <DownloadDocumentButton title="Download user report" />
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

        {isTablet && !isMobile && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.careStartDate).format("Do MMMM YYYY")}
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
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Stack>
        )}

        {isMobile && (
          <Box mt={2}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Box>
                <Typography variant="caption" fontWeight={400}>
                  Date joined
                </Typography>
                <Typography component={"p"} variant="caption" fontWeight={500}>
                  {moment(userInfo?.careStartDate).format("Do MMMM YYYY")}
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
            </Stack>
            <DownloadDocumentButton title="Download user report" />
          </Box>
        )}

        <Box mt={4} width={"100%"}>
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
                  />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CommonCard>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Account information
              </Typography>
              <Box mt={5}>
                <KeyValueDetails
                  items={
                    isEditAccountInformation
                      ? editableInfo
                      : account_information
                  }
                  isEditable={isEditAccountInformation}
                  onChange={handleChange}
                />
              </Box>
              <Box mt={3}>
                {isEditAccountInformation ? (
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <ApproveButton title="Cancel" onClick={onCancel} />
                    <ApproveButton
                      title="Save"
                      onClick={onSave}
                      variant="primary"
                    />
                  </Stack>
                ) : (
                  <ApproveButton title="Edit information" onClick={onClick} />
                )}
              </Box>
            </CommonCard>
          </Box>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Active service agreements
              </Typography>
              <Box mt={4}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  onClickRightButton={handleActionItemClick}
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  onClickRightButton={handleActionItemClick}
                />
              </Box>
            </CommonCard>
          </Box>

          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Completed service agreements
              </Typography>
              <Box mt={4}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  // onClickRightButton={handleActionItemClick}
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  // onClickRightButton={handleActionItemClick}
                />
              </Box>
              <Box mt={3}>
                <RequestCard
                  path="/assets/svg/carers/profile/payment_request.svg"
                  title="Agreement#02"
                  subtitle="Client:Reuben Hale"
                  subtitle2="Requested: 15 Jan 2025"
                  // onClickRightButton={handleActionItemClick}
                />
              </Box>
              <Box mt={4}>
                <ViewAllButton title="View all" />
              </Box>
            </CommonCard>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          {cardData.map((ele, index) => (
            <Box key={index} mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  {ele.title}
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  {ele.description}
                </Typography>
                <Box mt={4}>
                  <ViewAllButton
                    title={ele.buttontext}
                    onClick={() => {
                      router.push(ele.redirectionRoute);
                    }}
                  />
                </Box>
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
