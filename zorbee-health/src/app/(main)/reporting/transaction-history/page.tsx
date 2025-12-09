"use client";
import React, { useState, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
//relative path imports
import Popover from "@mui/material/Popover";
import CommonTabs from "@/components/CommonTabs";
import CommonTable from "@/components/CommonTable";

type LegalSignedStatus = "Pending" | "Completed";

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
  Completed: "#C8E4C0",
};

const statusTitleColor: Record<LegalSignedStatus, string> = {
  Pending: "#F6C719",
  Completed: "#6A9F69",
};

interface Data {
  id: number;
  transactionId: number;
  transactionDate: string;
  from: string;
  type: string;
  amount: string;
  status: string;
}

const rowsData: Data[] = [
  {
    id: 1,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 2,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 3,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 4,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 5,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
  {
    id: 6,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 7,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 8,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 9,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
  {
    id: 10,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
  {
    id: 11,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
  {
    id: 12,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
  {
    id: 13,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 14,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Pending",
  },
  {
    id: 15,
    transactionId: 123456789,
    transactionDate: "Sep 9,2024, 04:30pm",
    from: "Reuben Hale",
    type: "User invoice",
    amount: "+£180.00",
    status: "Completed",
  },
];

const TransactionHistory: React.FC = () => {
  const [startDate, setStartDate] = useState(moment("2024-09-09"));
  const [endDate, setEndDate] = useState(moment("2024-09-15"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dateDisplayRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setAnchorEl(dateDisplayRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  const columns: GridColDef[] = [
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      flex: 1,
      minWidth: 140,
    },
    { field: "from", headerName: "From", flex: 1, minWidth: 140 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 140 },
    {
      field: "amount",
      headerName: "Amount",
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
  ];

  return (
    <Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        mt={2}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Typography variant="body2" fontWeight={500}>
          Time period
        </Typography>

        <Box
          ref={dateDisplayRef}
          onClick={handleOpen}
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "10px",
            p: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: isMobile ? "100%" : "250px",
            border: "1px solid #E2E6EB",
            boxShadow: isOpen ? 3 : 0,
          }}
        >
          <Typography variant="body2">
            {startDate.format("MMM D, YYYY")} - {endDate.format("MMM D, YYYY")}
          </Typography>
          <CalendarTodayIcon fontSize="small" sx={{ ml: 1 }} />
        </Box>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Box sx={{ p: 2, width: "300px" }}>
              <Stack spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => newValue && setStartDate(newValue)}
                />

                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => newValue && setEndDate(newValue)}
                  minDate={startDate}
                />
              </Stack>
            </Box>
          </Popover>
        </LocalizationProvider>
      </Stack>

      <Box mt={2}>
        <CommonTabs
          tabContent={["All", "Carer", "Clinical", "User Invoices"]}
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

export default TransactionHistory;
