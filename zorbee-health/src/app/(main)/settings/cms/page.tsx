"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import { getAllCarerList, getAllCarerSummary } from "@/services/api/carerApi";
import moment from "moment";

type LegalSignedStatus = "Pending" | "Yes";

interface StyledChipProps {
  isBgColor?: string;
}

interface CarerData {
  _id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  approvedBy: string;
  approvedDate: string | null;
  careType: string | null;
  legalSigned: string | null;
  profile: string | null;
  activeJobs: string;
  completedJobs: string;
  responseRate: string;
  createdAt: string;
  updatedAt: string;
}

interface CarerListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      carer: CarerData[];
      totalCount: number;
    };
  };
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
  Yes: "#C8E4C0",
};

const statusTitleColor: Record<LegalSignedStatus, string> = {
  Pending: "#F9D835",
  Yes: "#6A9F69",
};

const CMS: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [carerData, setCarerData] = useState<CarerData[]>([]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns: GridColDef[] = [
    {
      field: "userFirstName",
      headerName: "Carer name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.userFirstName}&nbsp;
            {params?.row?.userLastName}
          </Typography>
        );
      },
    },
    {
      field: "approvedDate",
      headerName: "Date approved",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.approvedDate &&
              moment(params?.row?.approvedDate).format("DD.MM.YYYY")) ||
              "N/A"}
          </Typography>
        );
      },
    },
    { field: "approvedBy", headerName: "Approved by", flex: 1, minWidth: 140 },
    {
      field: "hourlyRate",
      headerName: "Hourly rate",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {(params?.row?.ratePerHours && `£${params?.row?.ratePerHours}`) ||
              "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "responseRate",
      headerName: "Response rate",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "completedJobs",
      headerName: "Completed jobs",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "activeJobs",
      headerName: "Active jobs",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "legalSigned",
      headerName: "Legal signed?",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const legalStatus = params.row.legalSigned as LegalSignedStatus;
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
                {legalStatus || "N/A"}
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
      <Box>
        <CommonTable
          column={columns}
          rows={carerData}
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

export default CMS;
