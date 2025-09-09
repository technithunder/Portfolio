"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Avatar,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  CircularProgress,
  styled,
  Chip,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VerifiedIcon from "@mui/icons-material/Verified";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonCard from "@/components/CommonCard";
import { addNotesForStaff, fetchAllOrder, fetchUserById } from "@/api";
import { useRouter } from "next/navigation";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NextImage from "next/image";
import { getStatusOptions } from "@/utils/constant";
import CommonFilter from "@/components/CommonFilter";
import DebaunceInput from "@/utils/DebaunceInput";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch } from "react-redux";
import { setUserProgressId } from "@/redux/slice/progressSlice";
import CommonAccordion from "@/components/CommonAccordion";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { toast } from "react-toastify";

// Styled components for status chips
const StatusChip = styled(Chip)(({ status }) => {
  let backgroundColor = "#f1f5f9";
  let color = "#64748b";

  if (status === "New order") {
    backgroundColor = "#e6eefa";
    color = "#3b82f6";
  } else if (status === "Inproduction") {
    backgroundColor = "#fef7e6";
    color = "#eab308";
  } else if (status === "Shipped") {
    backgroundColor = "#e6f9f0";
    color = "#10b981";
  } else if (status === "Cancelled") {
    backgroundColor = "#fee7e6";
    color = "#ef4444";
  } else if (status === "Draft") {
    backgroundColor = "#f1f5f9";
    color = "#64748b";
  } else if (status === "order_placed") {
    backgroundColor = "#e6f9f0";
    color = "#10b981";
  }

  return {
    backgroundColor,
    color,
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 500,
    height: "24px",
    textTransform: "none",
  };
});

const InfoField = ({ label, value }) => (
  <Box sx={{ display: "flex", py: 1 }}>
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ fontSize: "0.875rem", width: "30%", mr: 2 }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
      {value || "-"}
    </Typography>
  </Box>
);

const StaffDetail = ({ params }) => {
  const staffId = params?.id;
  const router = useRouter();
  const dispatch = useDispatch();

  // State to track which accordion panel is expanded
  const [expanded, setExpanded] = useState("userId");
  const [staffData, setStaffData] = useState([]);
  const [sortBy, setSortBy] = useState("customerName");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
  });
  const [orderStatics, setOrderStatics] = useState({
    totalOrders: 0,
    discount: 0,
    queries: 0,
  });
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleOpenNoteDialog = () => {
    setNoteDialogOpen(true);
  };

  const handleCloseNoteDialog = () => {
    setNoteDialogOpen(false);
    setNoteText("");
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      await addNotesForStaff(staffData?.ProgressInfo?.id, {
        notes: noteText.trim(),
      });

      toast.success("Note added successfully");
      handleCloseNoteDialog();
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const calculateCompletionScore = () => {
    const tasks = [
      "leadChecked",
      "leadFollowed",
      "checkedTomorrowTasks",
      "reportingSheetSent",
    ];

    const completedCount = tasks.filter(
      (task) => staffData?.ProgressInfo?.[task]
    ).length;

    return completedCount * 25;
  };

  // Fetch staff data if in update mode
  const fetchStaffData = async () => {
    if (staffId) {
      try {
        const response = await fetchUserById(staffId);
        const staffData = response?.data?.data;
        if (staffData) {
          setStaffData(staffData);
          setOrderStatics((prev) => ({
            ...prev,
            discount: staffData?.BasicInfo?.discount,
          }));
        }
      } catch (error) {
        console.error("Error fetching staff order data:", error);
        toast.error("Failed to load staff order data");
      }
    }
  };

  const fetchStaffOrder = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        staffId,
        sortBy,
        order,
      };
      filters?.status && (params.status = filters.status);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllOrder({
        params,
      });
      if (res && res?.data) {
        setOrderData(res.data.data.orders);
        setTotal(res?.data?.data?.pagination?.totalOrders);
        setOrderStatics((prev) => ({
          ...prev,
          totalOrders: res?.data?.data?.pagination?.totalOrders,
        }));
      } else {
        setOrderData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch order data", err);
    } finally {
      setLoading(false);
    }
  };

  const staffBasicInfoFields = [
    { label: "Staff ID", value: `${staffData?.BasicInfo?.empId || "00"}` },
    { label: "First Name", value: staffData?.BasicInfo?.firstName || "-" },
    { label: "Last Name", value: staffData?.BasicInfo?.lastName || "-" },
    { label: "Role", value: staffData?.BasicInfo?.role || "-" },
    { label: "Position", value: staffData?.BasicInfo?.position || "-" },
    {
      label: "Joining Date",
      value: staffData?.BasicInfo?.joiningDate
        ? moment(staffData.BasicInfo.joiningDate).format("DD/MM/YYYY")
        : "-",
    },
  ];

  const staffPersonInfoFields = [
    { label: "Age", value: staffData?.PersonalInfo?.age || "-" },
    {
      label: "Date of Birth",
      value: staffData?.PersonalInfo?.dob
        ? moment(staffData.PersonalInfo.dob).format("DD/MM/YYYY")
        : "-",
    },
    {
      label: "Marital Status",
      value: staffData?.PersonalInfo?.maritalStatus || "-",
    },
    { label: "Gender", value: staffData?.PersonalInfo?.gender || "-" },
    {
      label: "Nationality",
      value: staffData?.PersonalInfo?.nationality || "-",
    },
  ];

  const staffContactInfoFields = [
    {
      label: "Mobile Number",
      value: staffData?.ContactInfo?.mobileNumber || "-",
    },
    { label: "Email Address", value: staffData?.ContactInfo?.email || "-" },
  ];

  const staffOtherInfoFields = [
    { label: "Status", value: staffData?.OtherInfo?.status || "-" },
    { label: "Department", value: staffData?.OtherInfo?.department || "-" },
  ];

  const staffBankInfoFields = [
    {
      label: "Account Number",
      value: staffData?.BankInfo?.accountNumber || "-",
    },
    { label: "Bank Name", value: staffData?.BankInfo?.bankName || "-" },
    { label: "Branch Name", value: staffData?.BankInfo?.bankBranchName || "-" },
    { label: "IFSC Code", value: staffData?.BankInfo?.ifscCode || "-" },
    { label: "PAN Number", value: staffData?.BankInfo?.panCardNumber || "-" },
  ];

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  useEffect(() => {
    fetchStaffData();
    fetchStaffOrder();
  }, [staffId, filters, sortBy, order, limit, page, searchQuery]);

  return (
    <Layout>
      <CommonCard>
        {/* Page Title and Breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 500, marginBottom: "8px", fontSize: "24px" }}
            >
              Staff
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                href="/dashboard"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/staff"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Staff
              </Link>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {staffData?.BasicInfo?.firstName || "Staff Details"}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#00ABDC",
              borderRadius: "4px",
              textTransform: "none",
            }}
            onClick={() => router.push("/staff/create")}
          >
            Add Staff
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid lightgray",
                height: "100%",
                p: 2,
                // width: { xs: "100%", md: "100%" }
              }}
            >
              {/* Profile Background */}
              <Box
                sx={{
                  height: "120px",
                  backgroundColor: "#00ABDC",
                  position: "relative",
                  borderRadius: "4px",
                }}
              />

              {/* Avatar */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: "-50px",
                  pb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    border: "4px solid white",
                    backgroundColor: "#e0e0e0",
                  }}
                  src={staffData?.PersonalInfo?.profilePic}
                />
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: 500, fontSize: "1.125rem" }}
                >
                  {staffData?.BasicInfo?.firstName}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {staffData?.BasicInfo?.firstName
                    ? `@${staffData?.BasicInfo?.firstName}_${staffData?.BasicInfo?.lastName}`
                    : ""}
                </Typography>
              </Box>
              <Divider />

              {/* User Details Accordion */}
              <Box
                sx={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#c1c1c1",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#a8a8a8",
                  },
                }}
              >
                {/* User ID Accordion */}
                <CommonAccordion
                  panel="userId"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<LockIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Basic Information"
                >
                  {staffBasicInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                {/* Email Accordion */}
                <CommonAccordion
                  panel="email"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<EmailIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Personal Information"
                >
                  {staffPersonInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                {/* Qualification Accordion */}
                <CommonAccordion
                  panel="phone"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<PhoneIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Qualification Information"
                >
                  {staffData?.Qualification?.length > 0 ? (
                    staffData.Qualification.map((qual, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 1 }}
                        >
                          Qualification {index + 1}
                        </Typography>
                        <InfoField label="Degree" value={qual?.degree} />
                        <InfoField
                          label="University"
                          value={qual?.university}
                        />
                        <InfoField
                          label="Passing Year"
                          value={qual?.passingYear}
                        />
                        <InfoField
                          label="Percentage"
                          value={
                            qual?.percentage != null
                              ? `${qual.percentage}%`
                              : "-"
                          }
                        />
                        {index < staffData.Qualification.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ py: 1 }}>
                      No qualifications added
                    </Typography>
                  )}
                </CommonAccordion>

                {/* Address Accordion */}
                <CommonAccordion
                  panel="address"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<HomeIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Address Information"
                >
                  {staffData?.Address?.length > 0 ? (
                    staffData.Address.map((address, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 1 }}
                        >
                          Address {index + 1}
                        </Typography>
                        <Typography variant="body1">
                          {`${address?.street || ""}, ${address?.city || ""}, ${
                            address?.state || ""
                          }, ${address?.country || ""} - ${
                            address?.zipCode || ""
                          }`}
                        </Typography>
                        {index < staffData.Address.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ py: 1 }}>
                      No Address Found.
                    </Typography>
                  )}
                </CommonAccordion>

                {/* Contact Accordion */}
                <CommonAccordion
                  panel="contact"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={
                    <LocationOnIcon sx={{ color: "#757575", fontSize: 20 }} />
                  }
                  title="Contact Information"
                >
                  {staffContactInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                {/* Last Transaction Accordion */}
                <CommonAccordion
                  panel="lastTransaction"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={
                    <ShoppingCartIcon sx={{ color: "#757575", fontSize: 20 }} />
                  }
                  title="Other Information"
                >
                  {staffOtherInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                <CommonAccordion
                  panel="bankInfo"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={
                    <AccountBalanceIcon
                      sx={{ color: "#757575", fontSize: 20 }}
                    />
                  }
                  title="Bank Information"
                  isBorderBottom={false}
                >
                  {staffBankInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>
              </Box>
            </Box>
          </Grid>

          {/* Stats Cards */}
          <Grid item size={{ xs: 12, md: 8 }}>
            {/* Fixed width container for stats cards */}
            <Box
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "160px",
                display: "flex",
                gap: "3%",
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              {/* Total Orders Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  height: "100%",
                  flex: 1,
                  minWidth: { xs: "100%", sm: "30%" },
                  mb: { xs: 2, sm: 0 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#ffece0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "#ff9966" }} />
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mb: 1, fontSize: "0.875rem" }}
                >
                  Total Orders
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {orderStatics?.totalOrders || "-"}
                </Typography>
              </Paper>

              {/* Discount Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  height: "100%",
                  flex: 1,
                  minWidth: { xs: "100%", sm: "30%" },
                  mb: { xs: 2, sm: 0 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#e6f0ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <VerifiedIcon sx={{ color: "#6699ff" }} />
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mb: 1, fontSize: "0.875rem" }}
                >
                  Discount
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {orderStatics?.discount ? `${orderStatics.discount}%` : "-"}
                </Typography>
              </Paper>

              {/* Query Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  height: "100%",
                  flex: 1,
                  minWidth: { xs: "100%", sm: "30%" },
                  mb: { xs: 2, sm: 0 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#e6fff2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <AccountBalanceWalletIcon sx={{ color: "#66cc99" }} />
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mb: 1, fontSize: "0.875rem" }}
                >
                  Joining Date
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {staffData?.BasicInfo?.joiningDate
                    ? moment(staffData?.BasicInfo?.joiningDate).format(
                        "DD/MM/YYYY"
                      )
                    : "-"}
                </Typography>
              </Paper>
            </Box>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                  Today&apos;s Progress
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      color: "#00ABDC",
                      borderColor: "#00ABDC",
                      borderRadius: "8px",
                      "&:hover": {
                        borderColor: "#00ABDC",
                        backgroundColor: "rgba(0, 171, 220, 0.04)",
                      },
                    }}
                    onClick={() => {
                      dispatch(setUserProgressId(staffId));
                      router.push("/progress");
                    }}
                  >
                    View All Records
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<NoteAddIcon />}
                    sx={{
                      backgroundColor: "#00ABDC",
                      borderRadius: "8px",
                      textTransform: "none",
                    }}
                    onClick={handleOpenNoteDialog}
                  >
                    Add Notes
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {/* Time Information */}
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, mb: 2, color: "text.secondary" }}
                    >
                      Time Tracking
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Date:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {staffData?.ProgressInfo?.date || "-"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Check-in Time:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {staffData?.ProgressInfo?.inTime || "-"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Check-out Time:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {staffData?.ProgressInfo?.outTime || "-"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Task Completion */}
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, mb: 2, color: "text.secondary" }}
                    >
                      Task Completion
                    </Typography>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {calculateCompletionScore()}%
                      </Typography>
                      <CircularProgress
                        variant="determinate"
                        value={calculateCompletionScore()}
                        size={40}
                        thickness={4}
                        sx={{
                          color: (theme) => {
                            const score = calculateCompletionScore();
                            if (score === 0) return theme.palette.error.main;
                            if (score === 100)
                              return theme.palette.success.main;
                            return theme.palette.primary.main;
                          },
                        }}
                      />
                    </Box>

                    {[
                      {
                        key: "leadChecked",
                        label: "Leads Checked",
                      },
                      {
                        key: "leadFollowed",
                        label: "Leads Followed Up",
                      },
                      {
                        key: "checkedTomorrowTasks",
                        label: "Tomorrow&apos;s Tasks Checked",
                      },
                      {
                        key: "reportingSheetSent",
                        label: "Reporting Sheet Sent",
                      },
                    ].map((task, index, array) => (
                      <Box
                        key={task.key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: index === array.length - 1 ? 0 : 1,
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            color: staffData?.ProgressInfo?.[task.key]
                              ? "#4CAF50"
                              : "#9E9E9E",
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          dangerouslySetInnerHTML={{ __html: task.label }}
                        />
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: "18px" }}>
                Order History
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <DebaunceInput
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  delay={500}
                  sx={{
                    width: { xs: "180px", sm: "300px" },
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: "35px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "0",
                    },
                  }}
                  value={searchQuery}
                  onChange={handleDebouncedChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NextImage
                          src={"/assets/search.svg"}
                          alt="Search Icon"
                          width={24}
                          height={24}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <CommonFilter
                  onFilterApply={handleFilterApply}
                  onSortChange={handleSortChange}
                  currentSortBy={sortBy}
                  currentOrder={order}
                  initialFilters={filters}
                  optionsMap={{ getStatusOptions }}
                />
              </Box>
            </Box>

            {/* Order History */}
            <Box
              sx={{
                mt: 2,
              }}
            >
              <TableContainer
                sx={{
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                  overflowX: "auto",
                  maxHeight: "calc(100vh - 250px)",
                  position: "relative",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell
                        onClick={() => {
                          setSortBy("id");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                      >
                        Order ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Product
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSortBy("status");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Status
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: "18px",
                              ml: 0.5,
                              transform:
                                sortBy === "status" && order === "DESC"
                                  ? "rotate(180deg)"
                                  : "none",
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell
                        onClick={() => {
                          setSortBy("customerName");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Date
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress size={20} />
                        </TableCell>
                      </TableRow>
                    ) : orderData?.length > 0 ? (
                      orderData?.map((order, index) => {
                        return (
                          <TableRow key={`${order.id}-${index}`} hover>
                            <TableCell>{order?.orderNumber}</TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {order?.orderItems?.length > 0 ? (
                                  <>
                                    <NextImage
                                      src={
                                        order.orderItems?.[0].product
                                          ?.image?.[0]
                                      }
                                      alt={
                                        order.orderItems?.[0].product
                                          ?.productName
                                      }
                                      width={34}
                                      height={34}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                      >
                                        {order.orderItems?.[0].productName}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        {order.orderItems.length > 1 && (
                                          <Typography
                                            component="span"
                                            sx={{
                                              color: "text.secondary",
                                              fontSize: "0.875rem",
                                            }}
                                          >
                                            +{order.orderItems.length - 1} other
                                            product
                                            {order.orderItems.length > 2
                                              ? "s"
                                              : ""}
                                          </Typography>
                                        )}
                                      </Typography>
                                    </Box>
                                  </>
                                ) : (
                                  "-"
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <StatusChip
                                label={
                                  getStatusOptions.find(
                                    (option) => option.value === order?.status
                                  )?.label || order?.status
                                }
                                status={order?.status}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {moment(order?.createdAt).format("DD MMM YYYY")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell sx={{ borderBottom: "none" }} colSpan={8}>
                          <Box sx={{ py: 2 }}>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                fontSize: "25px",
                                textAlign: "center",
                              }}
                            >
                              No Order Found
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: 2,
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "background.paper",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    zIndex: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {total > 0
                      ? `Showing ${(page - 1) * limit + 1}-${Math.min(
                          page * limit,
                          total
                        )} from ${total} results`
                      : "Showing 0-0 from 0 results"}
                  </Typography>
                  {total > 0 && (
                    <Pagination
                      count={Math.ceil(total / limit)}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                    />
                  )}
                </Stack>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
        <Dialog
          open={noteDialogOpen}
          onClose={handleCloseNoteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 0,
              height: 280, // fixed height for the entire dialog
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              📝 Add a New Note
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
              px: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please enter your note below. Notes can include any relevant
              details.
            </Typography>

            <TextField
              label="Your Note"
              multiline
              fullWidth
              variant="outlined"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                flex: 1,
                "& .MuiInputBase-root": {
                  height: "100%",
                  alignItems: "flex-start",
                },
              }}
              InputProps={{
                sx: {
                  height: "100%",
                },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseNoteDialog}
              variant="text"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              sx={{
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Add Note
            </Button>
          </DialogActions>
        </Dialog>
      </CommonCard>
    </Layout>
  );
};

export default StaffDetail;
