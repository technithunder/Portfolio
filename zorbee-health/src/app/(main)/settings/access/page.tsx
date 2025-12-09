"use client";
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Button, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonButton from "@/components/CommonButton";
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import { accessData } from "@/constants/accessData";

type Status = "Suspended" | "Active";

interface UsersData {
  id?: number;
  name?: string;
  type?: string;
  lastLogin?: string;
  status?: Status;
}

interface StyledChipProps {
  isBgColor?: string;
}

const StyledChip = styled(Box)<StyledChipProps>(({ theme, isBgColor }) => ({
  height: "30px",
  width: "40%",
  paddingBlock: "10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isBgColor || theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const statusBgColor: Record<Status, string> = {
  Suspended: "#F4A6A6",
  Active: "#C8E4C0",
};

const statusTitleColor: Record<Status, string> = {
  Suspended: "#9C3C3C",
  Active: "#6A9F69",
};

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

const data = [
  {
    icon: "account",
    title: "Total accounts",
    count: 12,
  },
  {
    icon: "super_admin",
    title: "Super admin count",
    count: 3,
  },
  {
    icon: "admin_count",
    title: "Admin count",
    count: 12,
  },
  {
    icon: "suspended",
    title: "Suspended",
    count: 4,
  },
];

const Access: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: UsersData) => {
    console.log(` Row ID: ${row.id}`);
    router.push("/settings/access/kat-hall");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "User name", flex: 1, minWidth: 140 },
    {
      field: "type",
      headerName: "User type",
      flex: 1,
      minWidth: 140,
    },
    { field: "lastLogin", headerName: "Last login", flex: 1, minWidth: 140 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const status = params.row.status as Status;
        const bgColor = statusBgColor[status] || "#E0E0E0";
        const titleColor = statusTitleColor[status] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {status}
              </Typography>
            </StyledChip>
          </Box>
        );
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
            {actionItems.map((action, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleActionItemClick(params.row)}
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
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Manage access to the Zorbee Health admin panel
            </Typography>
            <Typography variant="caption" fontWeight={400} component={"p"}>
              Here is where you can add new Zorbee admins, sub-admins, or staff
              with limited access.
            </Typography>
          </Box>
          <CommonButton
            buttonText="Add user"
            sx={{ width: isMobile ? "100%" : "max-content" }}
            onClick={() => router.push("/settings/access/new-user")}
            buttonTextStyle={{ fontSize: "14px !important" }}
          />
        </Stack>
      </CommonCard>

      <Box mt={2}>
        <Grid2 container spacing={2}>
          {data.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <OverviewCard
                  path={`/assets/svg/setting/${ele.icon}.svg`}
                  alt={ele.icon}
                  title={ele.title}
                  count={ele.count}
                />
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      <Box>
        <CommonTable column={columns} rows={accessData} isPaginations />
      </Box>
    </Box>
  );
};

export default Access;
