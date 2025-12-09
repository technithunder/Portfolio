"use client";
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonTable from "@/components/CommonTable";
import CommonTabs from "@/components/CommonTabs";

type LegalSignedStatus = "Pending" | "Approved" | "Declined";

interface StyledChipProps {
  isBgColor?: string;
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

const statusBgColor: Record<LegalSignedStatus, string> = {
  Pending: "#f9d8353e",
  Approved: "#C8E4C0",
  Declined: "#F4A6A6",
};

const statusTitleColor: Record<LegalSignedStatus, string> = {
  Pending: "#F9D835",
  Approved: "#6A9F69",
  Declined: "#9C3C3C",
};

interface Data {
  id: number;
  provider: string;
  date: string;
  approvedBy: string;
  type: string;
  dateApproved: string;
  status: string;
}

const rowsData: Data[] = [
  {
    id: 1,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Pending",
  },
  {
    id: 2,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Approved",
  },
  {
    id: 3,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Declined",
  },
  {
    id: 4,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Approved",
  },
  {
    id: 5,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Declined",
  },
  {
    id: 6,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Pending",
  },
  {
    id: 7,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Pending",
  },
  {
    id: 8,
    provider: "Guernsey Cheshire Home",
    date: "Sep 9, 2024, 04:30pm",
    approvedBy: "Kat Hall",
    type: "Document",
    dateApproved: "Sep 9, 2024, 04:30pm",
    status: "Pending",
  },
];

const Approvals: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();

  const handleActionItemClick = (row: Data) => {
    console.log(`Row ID: ${row.id}`);
    router.push("/providers/approvals/profile");
  };

  const columns: GridColDef[] = [
    { field: "provider", headerName: "Provider", flex: 1, minWidth: 140 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 140 },
    { field: "approvedBy", headerName: "Approved by", flex: 1, minWidth: 140 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 140 },
    {
      field: "dateApproved",
      headerName: "Date approved",
      flex: 1,
      minWidth: 140,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const legalStatus = params.row.status as LegalSignedStatus;
        const bgColor = statusBgColor[legalStatus] || "#E0E0E0";
        const titleColor = statusTitleColor[legalStatus] || "#000000";

        return (
          <Box
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
          >
            <StyledChip isBgColor={bgColor}>
              <Typography variant="caption" fontWeight={500} color={titleColor}>
                {legalStatus}
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
        <IconButton size="small">
          <MoreVertIcon onClick={() => handleActionItemClick(params.row)} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Approvals
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          This displays any requested changes from carers that require approval.
        </Typography>
      </CommonCard>

      <Box mt={2}>
        <CommonTabs
          tabContent={["All", "Awaiting approval", "Approved"]}
          selectedTab={activeTab}
          onTabChange={(tab) => {
            console.log("Selected Tab:", tab);
            setActiveTab(tab);
          }}
        />
      </Box>
      <Box mt={1}>
        <CommonTable column={columns} rows={rowsData} />
      </Box>
    </Box>
  );
};

export default Approvals;
