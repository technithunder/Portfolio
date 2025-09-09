"use client";
import Layout from "@/Layout";
import {
  Avatar,
  Box,
  Button,
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Link,
  Tooltip,
  Breadcrumbs,
  styled,
  Chip,
  Menu,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CommonCard from "@/components/CommonCard";
import {
  createAssignTo,
  createPaymentUpload,
  fetchAllUserDetails,
  fetchOrderStaff,
  fettchOrderDetailsById,
  manageOderApproval,
  manageOderStatus,
  removeOrderStaff,
  updateStatusForOrder,
} from "@/api";
import AddIcon from "@mui/icons-material/Add";
import CommonDialog from "@/components/CommonDialog";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderItemCard from "./OrderItemCard/page";
import AssignedStaffTable from "./AssignedStaffTable/page";
import PaymentSummary from "./PaymentSummary/page";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  getStatusOptions,
  orderApprovalOptions,
  productImages,
} from "@/utils/constant";
import ProductReview from "./ProductReview/page";

// Skeleton Components
const OrderTitleSkeleton = () => (
  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
    <Skeleton variant="text" width={150} height={40} />
    <Skeleton variant="rounded" width={100} height={32} />
  </Box>
);

const CustomerInfoSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}
  >
    <Skeleton variant="text" width={120} height={30} sx={{ mb: 2 }} />
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box>
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
    </Box>
    <Divider sx={{ my: 2 }} />
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Skeleton variant="text" width={120} height={24} />
    </Box>
    <Divider sx={{ my: 2 }} />
    <Skeleton variant="text" width={180} height={30} sx={{ mb: 2 }} />
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={200} height={20} />
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={150} height={20} />
    </Box>
    <Divider sx={{ my: 2 }} />
    <Skeleton variant="text" width={180} height={30} sx={{ mb: 2 }} />
    <Box sx={{ display: "flex", mb: 2 }}>
      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
      <Skeleton variant="text" width="80%" height={60} />
    </Box>
  </Paper>
);

const OrderStatusSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mt: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}
  >
    <Skeleton variant="text" width={120} height={30} sx={{ mb: 3 }} />
    <Box sx={{ display: "flex", gap: 2 }}>
      <Skeleton variant="rounded" width="70%" height={40} />
      <Skeleton variant="rounded" width="30%" height={40} />
    </Box>
  </Paper>
);

const OrderItemsSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0", mb: 1 }}
  >
    {[1, 2].map((item) => (
      <Box key={item} sx={{ mb: 3 }}>
        <Grid container spacing={1}>
          <Grid item size={{ xs: 12, sm: 4, md: 3 }}>
            <Skeleton variant="rounded" width="100%" height={200} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 8, md: 9 }}>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={`left-${i}`}
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={`right-${i}`}
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {item < 2 && <Divider sx={{ mt: 3 }} />}
      </Box>
    ))}
  </Paper>
);

const PaymentSummarySkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0", mb: 1 }}
  >
    <Skeleton variant="text" width={180} height={32} sx={{ mb: 3 }} />
    {[1, 2, 3, 4].map((i) => (
      <Box
        key={i}
        sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
      >
        <Skeleton variant="text" width="30%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
      </Box>
    ))}
    <Divider sx={{ my: 2 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Skeleton variant="text" width="30%" height={28} />
      <Skeleton variant="text" width="20%" height={28} />
    </Box>
    <Skeleton variant="rounded" width="100%" height={150} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" width={120} height={40} />
  </Paper>
);

const AssignStaffSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mt: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Skeleton variant="text" width={200} height={32} />
      <Skeleton variant="rounded" width={180} height={40} />
    </Box>
    <Skeleton variant="rounded" width="100%" height={200} />
  </Paper>
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return `₹ ${amount?.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ApprovalStatusChip = styled(Chip)(({ status, theme }) => {
  const statusColors = {
    // Approval status colors
    pending: { bg: "#fef7e6", color: "#eab308", hover: "#fef3c7" },
    approve: { bg: "#e6f9f0", color: "#10b981", hover: "#d1fae5" },
    reject: { bg: "#fee7e6", color: "#ef4444", hover: "#fee2e2" },

    // Order status colors
    processing: { bg: "#e6eefa", color: "#3b82f6", hover: "#dbe7fd" },
    delivered: { bg: "#fef7e6", color: "#eab308", hover: "#fef3c7" },
    shipped: { bg: "#e0f2fe", color: "#0369a1", hover: "#bae6fd" },
    cancelled: { bg: "#fee7e6", color: "#ef4444", hover: "#fee2e2" },
    Draft: { bg: "#f1f5f9", color: "#64748b", hover: "#e2e8f0" },
    order_placed: { bg: "#e6f9f0", color: "#10b981", hover: "#d1fae5" },

    // Default colors
    default: { bg: "#f1f5f9", color: "#64748b", hover: "#e2e8f0" },
  };

  const colors = statusColors[status] || statusColors.default;

  return {
    backgroundColor: colors.bg,
    color: colors.color,
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 500,
    height: "24px",
    textTransform: "none",
    cursor: "pointer",
    pr: 1,
    "& .MuiChip-deleteIcon": {
      color: "inherit",
      marginLeft: "4px",
    },
    "&:hover": {
      backgroundColor: colors.hover,
    },
  };
});

const StatusChip = ({
  status,
  label,
  options,
  onChange,
  type = "approval",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    onChange({ target: { value } });
    handleClose();
  };

  return (
    <>
      <ApprovalStatusChip
        label={label}
        status={status}
        onClick={handleClick}
        onDelete={handleClick}
        deleteIcon={<KeyboardArrowDownIcon />}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options?.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const OrderDetail = ({ params }) => {
  const orderId = params?.id;
  const [orderData, setOrderData] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [openDialogBox, setOpenDialog] = useState(false);
  const [orderStaffDetails, setOrderStaffDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  // Staff table states
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("firstName");
  const [totalStaffCount, setTotalStaffCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setOrderStatus(newStatus);

    try {
      const response = await updateStatusForOrder(orderId, newStatus);
      if (response?.data) {
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await fettchOrderDetailsById(orderId);
      const orderData = await response?.data?.data?.order;
      if (orderData?.approvedStatus) {
        setApprovalStatus(orderData?.approvedStatus);
      }
      setOrderData(orderData);
      setOrderStatus(orderData?.status);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const fetchStaffDetails = async () => {
    try {
      const params = {
        page: page + 1,
        limit,
        role: "staff",
        sortBy,
        order,
      };
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllUserDetails({ params });
      if (res && res?.data) {
        setStaffData(res.data.data?.users);
        setFilteredStaffData(res.data.data?.users);
        setTotalStaffCount(
          res.data.data?.totalCount || res.data.data?.total || 0
        );
      } else {
        setStaffData([]);
        setTotalStaffCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    }
  };

  const fetchOrderStaffDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchOrderStaff(orderId);
      setOrderStaffDetails(response?.data?.data?.data?.assignedStaff);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const closeCreateNewDialog = () => {
    setOpenDialog(false);
    setSearchQuery("");
    setPage(0);
  };

  // Staff table handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredStaffData.map((n) => n.BasicInfo?.id);
      setSelectedStaff(newSelecteds);
      return;
    }
    setSelectedStaff([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedStaff.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStaff, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStaff.slice(1));
    } else if (selectedIndex === selectedStaff.length - 1) {
      newSelected = newSelected.concat(selectedStaff.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStaff.slice(0, selectedIndex),
        selectedStaff.slice(selectedIndex + 1)
      );
    }

    setSelectedStaff(newSelected);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0);
  };

  const handleAssignToStaff = async () => {
    try {
      setIsLoading(true);
      const payload = {
        staffIds: selectedStaff?.map((id) => Number(id)),
        orderId: Number(orderId),
      };
      const response = await createAssignTo(payload);
      const staffData = response?.data?.data;
      if (staffData) {
        toast.success(response?.data?.message);
        // setAssignedStaff(staffData);
        fetchOrderStaffDetails();
        closeCreateNewDialog();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load staff data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStaff = async (staffId) => {
    try {
      const payload = {
        orderId: orderId,
        staffId: staffId,
      };
      const response = await removeOrderStaff(payload);
      const message = response?.data?.message;

      if (response?.data && message) {
        toast.success(message);
        fetchOrderStaffDetails();
      }
    } catch (error) {
      console.error("Error removing staff member:", error);
      toast.error("Failed to remove staff member");
    }
  };

  const staffColumns = [
    { field: "firstName", headerName: "Staff Name", flex: 1 },

    {
      field: "email",
      headerName: "Staff Email",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Remove">
          <IconButton
            color="error"
            onClick={() => handleRemoveStaff(params?.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedStaff.indexOf(id) !== -1;

  const handleOrderStatus = async () => {
    let payload = {
      status: orderStatus,
    };
    try {
      const res = await manageOderStatus(orderId, payload);
      if (res?.data) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePaymentProofUpload = async (base64Image, fileType) => {
    try {
      let payload = {
        orderId,
        orderPayment: base64Image,
      };

      const response = await createPaymentUpload(payload);
      if (response) {
        toast.success(response?.data?.message);
        setOrderData((prevData) => ({
          ...prevData,
          orderPayment: response?.data?.data,
        }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage);
      throw error;
    }
  };

  const handleApprovalChange = async (event) => {
    const newApprovalStatus = event.target.value;
    setApprovalStatus(newApprovalStatus);

    try {
      const payload = {
        approvedStatus: newApprovalStatus,
      };
      const res = await manageOderApproval(orderId, payload);

      if (res?.data) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log("Error updating approval status", error);
      toast.error("Failed to update approval status");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchOrderStaffDetails();
  }, [orderId]);

  useEffect(() => {
    if (openDialogBox) {
      fetchStaffDetails();
    }
  }, [searchQuery, page, limit, sortBy, order, openDialogBox]);

  if (isInitialLoad) {
    return (
      <Layout>
        <CommonCard>
          <Box>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="text" width={80} height={24} />
            </Breadcrumbs>

            <Box sx={{ mt: 3 }}>
              <OrderTitleSkeleton />

              <Grid container spacing={3}>
                <Grid item size={{ xs: 12, md: 8 }}>
                  <OrderItemsSkeleton />
                  <PaymentSummarySkeleton />
                  <AssignStaffSkeleton />
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                  <CustomerInfoSkeleton />
                  <OrderStatusSkeleton />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CommonCard>
      </Layout>
    );
  }

  return (
    <Layout>
      <CommonCard>
        <Box>
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
            <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
              Dealers
            </Typography>
          </Breadcrumbs>
          {/* Order Title and Date */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Order #{orderData?.orderNumber}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {/* Approval Status Chip */}
                  <StatusChip
                    status={approvalStatus}
                    label={
                      orderApprovalOptions.find(
                        (option) => option.value === approvalStatus
                      )?.label || "Select Status"
                    }
                    options={orderApprovalOptions}
                    onChange={handleApprovalChange}
                    type="approval"
                  />

                  {/* Order Status Chip */}
                  <StatusChip
                    status={orderStatus}
                    label={
                      getStatusOptions.find(
                        (option) => option.value === orderStatus
                      )?.label || "Select Status"
                    }
                    options={getStatusOptions}
                    onChange={handleStatusChange}
                    type="order"
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatDate(orderData?.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1}>
            {/* Left Column - Order Items, Payment Summary, and Order Status */}
            <Grid item size={{ xs: 12, md: 8 }}>
              {/* Order Items */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  mb: 1,
                }}
              >
                {orderData?.orderItems?.map((item, index) => (
                  <OrderItemCard
                    key={item.id}
                    item={item}
                    isLast={index === orderData.orderItems.length - 1}
                    productImages={productImages}
                  />
                ))}
              </Paper>

              {/* Payment Summary */}
              <PaymentSummary
                // totalAmount={orderData?.totalAmount || 0}
                orderData={orderData}
                shippingFee={500}
                formatCurrency={formatCurrency}
                onPaymentProofUpload={handlePaymentProofUpload}
              />

              {/* Assign To staff members */}
              {approvalStatus === "approve" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight="medium">
                      Assign to staff members
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#00ABDC",
                        borderRadius: 2,
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#00ABDC",
                          boxShadow: "none",
                        },
                      }}
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Manage Staff members
                    </Button>
                  </Box>

                  {/* Assigned Staff Table with Scrollbar */}
                  <Box
                    sx={{
                      maxHeight:
                        orderStaffDetails.length > 5 ? "300px" : "auto",
                      overflow:
                        orderStaffDetails.length > 5 ? "auto" : "visible",
                      border:
                        orderStaffDetails.length > 5
                          ? "1px solid #e0e0e0"
                          : "none",
                      borderRadius: orderStaffDetails.length > 5 ? 1 : 0,
                    }}
                  >
                    <AssignedStaffTable
                      loading={loading}
                      data={orderStaffDetails}
                      columns={staffColumns}
                    />
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Customer Info */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                  Customer
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#f5f5f5",
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {orderData?.customerName?.[0]?.toUpperCase() || "-"}
                    </Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {orderData?.customerName || "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orderData?.orderNumber || "-"}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: 2, width: "100%" }} />

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#f5f5f5",
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      O
                    </Typography>
                  </Avatar>
                  <Typography variant="subtitle1">
                    {orderData?.totalItems
                      ? `${orderData?.totalItems} Orders`
                      : "-"}
                  </Typography>
                </Box>
                <Divider sx={{ mt: 2, width: "100%" }} />

                <Typography
                  variant="h6"
                  fontWeight="medium"
                  sx={{ mt: 4, mb: 2 }}
                >
                  Contact Information
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconButton size="small" sx={{ mr: 1, bgcolor: "#f5f5f5" }}>
                    <EmailIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">
                    {orderData?.user?.email || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <IconButton size="small" sx={{ mr: 1, bgcolor: "#f5f5f5" }}>
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">
                    {orderData?.user?.phone || "N/A"}
                  </Typography>
                </Box>
                <Divider sx={{ mt: 2, width: "100%" }} />

                <Typography
                  variant="h6"
                  fontWeight="medium"
                  sx={{ mt: 4, mb: 2 }}
                >
                  Shipping Address
                </Typography>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <IconButton
                    size="small"
                    sx={{
                      mr: 1,
                      mt: -0.5,
                      bgcolor: "#f5f5f5",
                      alignSelf: "flex-start",
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">
                    {orderData?.shippingAddress || "-"}
                  </Typography>
                </Box>
              </Paper>

              {/* Order Status */}
              {/* {approvalStatus && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
                    Order Status
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl sx={{ flex: 1 }}>
                      <Select
                        value={orderStatus}
                        onChange={handleStatusChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Order status" }}
                        size="small"
                        sx={{
                          height: 40,
                          borderRadius: 1,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                        }}
                      >
                        {getStatusOptions?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={handleOrderStatus}
                      sx={{
                        height: 40,
                        px: 3,
                        bgcolor: "#00ABDC",
                        borderRadius: 2,
                        boxShadow: "none",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content",
                        "&:hover": {
                          bgcolor: "#00ABDC",
                          boxShadow: "none",
                        },
                      }}
                      disabled={approvalStatus != "approve"}
                    >
                      Update
                    </Button>
                  </Box>
                </Paper>
              )} */}

              {/* Product Review */}
              {orderData?.query && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
                    Order Query
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9D9D9D",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    {`query : ${orderData.query}`}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
        <ProductReview open={open} handleClose={handleClose} />

        <CommonDialog
          heading={<span>Staff Members Details</span>}
          open={openDialogBox}
          handleClose={closeCreateNewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogContentText
            sx={{
              width: "100%",
              minWidth: "600px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" sx={{ color: "#000" }}>
              {"Manage Staff Members"}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="caption">Select staff members</Typography>

              <TextField
                placeholder="Search staff members..."
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  minWidth: "250px",
                  mt: -4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#757575" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  flex: 1,
                  maxHeight: "350px",
                  overflow: "auto",
                }}
              >
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="staff members table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={
                            selectedStaff.length > 0 &&
                            selectedStaff.length < filteredStaffData.length
                          }
                          checked={
                            filteredStaffData.length > 0 &&
                            selectedStaff.length === filteredStaffData.length
                          }
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSortBy("firstName");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Staff Name
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: "18px",
                              ml: 0.5,
                              transform:
                                sortBy === "firstName" && order === "DESC"
                                  ? "rotate(180deg)"
                                  : "none",
                              // transition: "transform 0.2s ease",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSortBy("email");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Staff Email
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: "18px",
                              ml: 0.5,
                              transform:
                                sortBy === "email" && order === "DESC"
                                  ? "rotate(180deg)"
                                  : "none",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffData.map((staff) => {
                      const isItemSelected = isSelected(staff.BasicInfo?.id);
                      const labelId = `enhanced-table-checkbox-${staff.BasicInfo?.id}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            handleClick(event, staff.BasicInfo?.id)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={staff.BasicInfo?.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {staff?.BasicInfo?.firstName}{" "}
                            {staff?.BasicInfo?.lastName || ""}
                          </TableCell>
                          <TableCell>{staff?.ContactInfo?.email}</TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredStaffData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            No staff members found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalStaffCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Rows per page:"
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  "& .MuiTablePagination-toolbar": {
                    justifyContent: "space-between",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    order: -1,
                  },
                  "& .MuiTablePagination-select": {
                    order: -1,
                  },
                }}
              />
            </Box>

            {selectedStaff.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 1 }}>
                <Typography variant="body2" color="primary">
                  {selectedStaff.length} staff member
                  {selectedStaff.length > 1 ? "s" : ""} selected
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={closeCreateNewDialog}
                sx={{ borderColor: "#e0e0e0", color: "#666", borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  bgcolor: "#00ABDC",
                  "&:hover": { bgcolor: "#00ABDC" },
                }}
                onClick={handleAssignToStaff}
                disabled={selectedStaff.length === 0 || isLoading}
              >
                Assign Selected ({selectedStaff.length})
              </Button>
            </Box>
          </DialogContentText>
        </CommonDialog>
      </CommonCard>
    </Layout>
  );
};

export default OrderDetail;
