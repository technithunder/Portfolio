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
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  CircularProgress,
  styled,
  Chip,
  InputAdornment,
  Stack,
} from "@mui/material";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommonCard from "@/components/CommonCard";
import { fetchAllOrder, fetchUserById } from "@/api";
import { useRouter } from "next/navigation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";
import NextImage from "next/image";
import { getStatusOptions } from "@/utils/constant";
import DebaunceInput from "@/utils/DebaunceInput";
import HomeIcon from "@mui/icons-material/Home";
import CommonFilter from "@/components/CommonFilter";
import CommonAccordion from "@/components/CommonAccordion";

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

const DealerDetail = ({ params }) => {
  const dealerId = params?.id;
  const router = useRouter();

  // State to track which accordion panel is expanded
  const [expanded, setExpanded] = useState("userId");
  const [dealerData, setDealerData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("customerName");
  const [order, setOrder] = useState("ASC");
  const [filters, setFilters] = useState({
    status: "",
  });
  const [orderStatics, setOrderStatics] = useState({
    totalOrders: 0,
    discount: 0,
    queries: 0,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Fetch dealer data if in update mode
  const fetchDealerData = async () => {
    if (dealerId) {
      try {
        const response = await fetchUserById(dealerId);
        const dealerData = response?.data?.data;
        if (dealerData) {
          setDealerData(dealerData);
          setOrderStatics((prev) => ({
            ...prev,
            discount: dealerData?.BasicInfo?.discount,
          }));
        }
      } catch (error) {
        console.error("Error fetching dealer data:", error);
        toast.error("Failed to load dealer data");
      }
    }
  };

  const fetchDealerOrder = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        userId: dealerId,
        sortBy,
        order,
      };
      filters?.status && (params.status = filters.status);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllOrder({ params });
      if (res && res?.data) {
        setOrderData(res?.data?.data?.orders);
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

  const dealerBasicInfoFields = [
    { label: "Dealer ID", value: `${dealerData?.BasicInfo?.empId || "00"}` },
    { label: "First Name", value: dealerData?.BasicInfo?.firstName || "-" },
    { label: "Last Name", value: dealerData?.BasicInfo?.lastName || "-" },
    { label: "Role", value: dealerData?.BasicInfo?.role || "-" },
    // { label: "Position", value: dealerData?.BasicInfo?.position || "-" },
    {
      label: "Joining Date",
      value: dealerData?.BasicInfo?.joiningDate
        ? moment(dealerData?.BasicInfo?.joiningDate).format("DD/MM/YYYY")
        : "-",
    },
  ];

  const dealerPersonInfoFields = [
    { label: "Age", value: dealerData?.PersonalInfo?.age ?? "-" },
    { label: "Date of Birth", value: dealerData?.PersonalInfo?.dob || "-" },
    {
      label: "Marital Status",
      value: dealerData?.PersonalInfo?.maritalStatus || "-",
    },
    { label: "Gender", value: dealerData?.PersonalInfo?.gender || "-" },
    {
      label: "Nationality",
      value: dealerData?.PersonalInfo?.nationality || "-",
    },
  ];

  const dealerContactInfoFields = [
    {
      label: "Mobile Number",
      value: dealerData?.ContactInfo?.mobileNumber || "-",
    },
    { label: "Email Address", value: dealerData?.ContactInfo?.email || "-" },
  ];

  const dealerOtherInfoFields = [
    { label: "Status", value: dealerData?.OtherInfo?.status || "-" },
  ];

  const dealerBankInfoFields = [
    {
      label: "Account Number",
      value: dealerData?.BankInfo?.accountNumber || "-",
    },
    { label: "Bank Name", value: dealerData?.BankInfo?.bankName || "-" },
    { label: "Branch Name", value: dealerData?.BankInfo?.bankBranchName || "-" },
    { label: "IFSC Code", value: dealerData?.BankInfo?.ifscCode || "-" },
    { label: "PAN Number", value: dealerData?.BankInfo?.panCardNumber || "-" },
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
    fetchDealerData();
    fetchDealerOrder();
  }, [dealerId, filters, sortBy, order, limit, page, searchQuery]);

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
              Dealer
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
                href="/dealers"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Dealer
              </Link>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {dealerData?.BasicInfo?.firstName || "Dealer Details"}
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
            onClick={() => router.push("/dealers/create")}
          >
            Add Dealer
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
                // height: "100%",
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
                  src={dealerData?.PersonalInfo?.profilePic}
                />
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: 500, fontSize: "1.125rem" }}
                >
                  {dealerData?.BasicInfo?.firstName}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {dealerData?.BasicInfo?.firstName
                    ? `@${dealerData?.BasicInfo?.firstName}_${dealerData?.BasicInfo?.lastName}`
                    : ""}
                </Typography>
              </Box>
              <Divider />
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
                <CommonAccordion
                  panel="userId"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<LockIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Basic Information"
                >
                  {dealerBasicInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                <CommonAccordion
                  panel="email"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<EmailIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Personal Information"
                >
                  {dealerPersonInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                <CommonAccordion
                  panel="phone"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<PhoneIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Qualification Information"
                >
                  {dealerData?.Qualification?.length > 0 ? (
                    dealerData.Qualification.map((qual, index) => (
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
                        {index < dealerData.Qualification.length - 1 && (
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

                <CommonAccordion
                  panel="address"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={<HomeIcon sx={{ color: "#757575", fontSize: 20 }} />}
                  title="Address Information"
                >
                  {dealerData?.Address?.length > 0 ? (
                    dealerData.Address.map((address, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 1 }}
                        >
                          Address {index + 1}
                        </Typography>
                        <Typography variant="body1">
                          {`${address?.street || ""}, ${address?.city || ""}, ${address?.state || ""
                            }, ${address?.country || ""} - ${address?.zipCode || ""
                            }`}
                        </Typography>
                        {index < dealerData.Address.length - 1 && (
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

                <CommonAccordion
                  panel="contact"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={
                    <LocationOnIcon sx={{ color: "#757575", fontSize: 20 }} />
                  }
                  title="Contact Information"
                >
                  {dealerContactInfoFields.map((item, index) => (
                    <InfoField key={index} {...item} />
                  ))}
                </CommonAccordion>

                <CommonAccordion
                  panel="lastTransaction"
                  expanded={expanded}
                  onChange={handleAccordionChange}
                  icon={
                    <ShoppingCartIcon sx={{ color: "#757575", fontSize: 20 }} />
                  }
                  title="Other Information"
                >
                  {dealerOtherInfoFields.map((item, index) => (
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
                  {dealerBankInfoFields.map((item, index) => (
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
                  {dealerData?.BasicInfo?.joiningDate
                    ? moment(dealerData?.BasicInfo?.joiningDate).format(
                      "DD/MM/YYYY"
                    )
                    : "-"}
                </Typography>
              </Paper>
            </Box>

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
      </CommonCard>
    </Layout>
  );
};

export default DealerDetail;
