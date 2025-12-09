"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import moment from "moment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import OverviewCard from "@/components/Cards/Overview";
//relative api path imports
import {
  getAllUsers,
  getUserSummary,
  removeUSerInfo,
  updateUserInfo,
} from "@/services/api/usersApi";

const StyledChip = styled(Box)<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "70%",
  paddingBlock: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
}));

type EmailVerifiedStatus = "Pending" | "Verified";
type AuthTypeStatus = 1 | 2 | 3 | 4;

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

interface UserDataProps {
  _id: string;
  userId: string;
  usersInfo: {
    authType: number;
    firstName: string;
    isEmailVerify: boolean;
    lastName: string;
  };
}

interface UserListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      clients: UserDataProps[];
      totalDocs: number;
    };
  };
}

interface UserInfoCount {
  totalClient: number;
  inactiveAccount: number;
  deletedAccount: number;
  totalAgreement: number;
}

interface UserSummary {
  data: {
    success: boolean;
    data: UserInfoCount;
  };
}

interface PauseUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface RemoveUserInfoResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const statusBgColor: Record<EmailVerifiedStatus, string> = {
  Pending: "#f9d8353e",
  Verified: "#C8E4C0",
};

const statusTitleColor: Record<EmailVerifiedStatus, string> = {
  Pending: "#F9D835",
  Verified: "#6A9F69",
};

const authType: Record<AuthTypeStatus, string> = {
  1: "Login",
  2: "Google",
  3: "Apple",
  4: "Facebook",
};

const Overview: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserDataProps[]>([]);
  const [userInfoCount, setUserInfoCount] = useState<UserInfoCount>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);

  useEffect(() => {
    fetchAllUsers(currentPage);
    fetchClientSummary();
  }, [currentPage]);

  const fetchAllUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllUsers({
        limit: rowsPerPage,
        page: page + 1,
      })) as UserListResponse;
      if (response?.data?.success) {
        setUserData(response?.data?.data?.clients);
        setTotalItems(response?.data?.data?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientSummary = async () => {
    try {
      const response = (await getUserSummary()) as UserSummary;
      if (response?.data?.success) {
        setUserInfoCount(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: string, cindex: number) => {
    if (cindex === 0) {
      router.push(`/users/overview/profile/${row}`);
    } else if (cindex === 1) {
      onPauseUserAccount(row);
    } else if (cindex === 2) {
      onRemoveUserAccount(row);
    }
    handleClose();
  };

  const onPauseUserAccount = async (id: string) => {
    try {
      const response = (await updateUserInfo(id)) as PauseUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveUserAccount = async (id: string) => {
    try {
      const response = (await removeUSerInfo(id)) as RemoveUserInfoResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchAllUsers(currentPage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "User name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.firstName}&nbsp;
            {params?.row?.usersInfo?.lastName}
          </Typography>
        );
      },
    },
    {
      field: "dateJoined",
      headerName: "Date joined",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.usersInfo?.createdAt).format("DD.MM.YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "dateJoined",
      headerName: "Last login",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {moment(params?.row?.usersInfo?.updatedAt).format("DD.MM.YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "isEmailVerify",
      headerName: "Email verified",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const verifiedStatus = params?.row?.usersInfo?.isEmailVerify;
        const isEmailVerify = verifiedStatus ? "Verified" : "Pending";
        const bgColor = statusBgColor[isEmailVerify] || "#E0E0E0";
        const titleColor = statusTitleColor[isEmailVerify] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {isEmailVerify}
              </Typography>
            </StyledChip>
          </Box>
        );
      },
    },
    {
      field: "authType",
      headerName: "Login method",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const authTypeValue = params?.row?.usersInfo
          ?.authType as AuthTypeStatus;
        const loginMethod = authType[authTypeValue] || "Unknown";
        return <Typography variant="body1">{loginMethod}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) => handleActionClick(event, params.row.id)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              backgroundColor: "#f5f5f7",
              color: "#000",
              textTransform: "none",
              borderRadius: "8px",

              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#e8e8ea",
              },
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              Select
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow === params.row.id}
            onClose={handleClose}
          >
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => handleActionItemClick(params?.row?._id, index)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/man_woman.svg"}
            alt={"man_woman"}
            title={"Total users"}
            count={userInfoCount?.totalClient}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/currency_pound.svg"}
            alt={"currency_pound"}
            title={"Inactive users"}
            count={userInfoCount?.inactiveAccount}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/messages_people.svg"}
            alt={"messages_people"}
            title={"Deleted account"}
            count={userInfoCount?.deletedAccount}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/carers/overview/job_choose_candidate.svg"}
            alt={"job_choose_candidate"}
            title={"Active agreements"}
            count={userInfoCount?.totalAgreement}
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={userData}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Overview;
