"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import CommonCard from "@/components/Cards/Common";
import CommonTabs from "@/components/CommonTabs";
import { carerSupportData } from "@/constants/carerSupportData";

type ProgressStatus = "Pending" | "Resolved" | "In-progress";

interface CarerSupportData {
  id?: number;
  name?: string;
  emailAddress?: string;
  ticketType?: string;
  lastUpdated?: string;
  dateCreated?: string;
  status?: ProgressStatus;
}

interface StyledChipProps {
  isBgColor?: string;
}

interface ActionItem {
  label: string;
  value: "view" | "assign" | "escalate";
}

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

const statusBgColor: Record<ProgressStatus, string> = {
  Pending: "#f9d8353e",
  Resolved: "#C8E4C0",
  "In-progress": "#ECF2FB",
};

const statusTitleColor: Record<ProgressStatus, string> = {
  Pending: "#F9D835",
  Resolved: "#6A9F69",
  "In-progress": "#518ADD",
};

const Overview: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: CarerSupportData) => {
    console.log(` Row ID: ${row.id}`);
    router.push("/support/carer/profile");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View ticket", value: "view" },
    { label: "Assign", value: "assign" },
    { label: "Escalate", value: "escalate" },
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 140 },
    {
      field: "emailAddress",
      headerName: "Email address",
      flex: 1,
      minWidth: 140,
    },
    { field: "ticketType", headerName: "Ticket type", flex: 1, minWidth: 140 },
    {
      field: "lastUpdated",
      headerName: "Last updated",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "dateCreated",
      headerName: "Date created",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const status = params.row.status as ProgressStatus;
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
          {/* <IconButton
            onClick={(event) => handleActionClick(event, params.row.id)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton> */}
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
        <Typography variant="h6" fontWeight={500}>
          Carer support tickets
        </Typography>
        <Typography fontSize={"12px"}>
          This displays all logged carer support tickets.
        </Typography>
      </CommonCard>

      <Box mt={4}>
        <CommonTabs
          tabContent={["All", "Pending", "In-progress", "Resolved"]}
          selectedTab={activeTab}
          onTabChange={(tab) => {
            console.log("Selected Tab:", tab);
            setActiveTab(tab);
          }}
        />
        <CommonTable column={columns} rows={carerSupportData} />
      </Box>
    </Box>
  );
};

export default Overview;
