"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  Button,
  InputAdornment,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
  styled,
  Paper,
  Tooltip,
} from "@mui/material";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DebaunceInput from "@/utils/DebaunceInput";
import CommonCard from "@/components/CommonCard";
import { useRouter } from "next/navigation";
import { deleteOrder, fetchAllOrder } from "@/api";
import { toast } from "react-toastify";
import NextImage from "next/image";
import { getStatusOptions, isAdminOptions } from "@/utils/constant";
import CommonFilter from "@/components/CommonFilter";
import AddIcon from "@mui/icons-material/Add";
import CommonTable from "@/components/CommonTable";
import DeleteDialog from "@/components/CommonDeleteDialog";

// Styled components for status chips
export const StatusChip = styled(Chip)(({ status }) => {
  let backgroundColor = "#f1f5f9";
  let color = "#64748b";

  if (status === "processing") {
    backgroundColor = "#e6eefa";
    color = "#3b82f6";
  } else if (status === "delivered") {
    backgroundColor = "#fef7e6";
    color = "#eab308";
  } else if (status === "shipped") {
    backgroundColor = "#e0f2fe";
    color = "#0369a1";
  } else if (status === "cancelled") {
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

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const Dropzone = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  border: "2px dashed #bdbdbd",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#fafafa",
  cursor: "pointer",
  height: "120px",
  width: "50%",
  textAlign: "center",
  marginBottom: theme.spacing(3),
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: "#f5f5f5",
  },
}));

const Orders = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    isAdmin: "",
  });

  const tableColumns = [
    {
      id: "id",
      label: "Order Id",
      sortable: true,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
    },
    {
      id: "totalItems",
      label: "Item",
      sortable: false,
    },
    {
      id: "customerName",
      label: "Customer Name",
      sortable: true,
    },
    {
      id: "isAdmin",
      label: "Is Create By Admin ?",
      sortable: false,
    },
  ];

  const tableData =
    orderData?.length > 0 &&
    orderData?.map((item, index) => ({
      id: item?.id,
      status: (
        <StatusChip
          label={
            getStatusOptions.find((option) => option.value === item?.status)
              ?.label || item?.status
          }
          status={item?.status}
          size="small"
        />
      ),
      isAdmin: item?.isAdmin ? "Yes" : "No",
      customerName: item?.customerName,
      totalItems: item?.totalItems,
    }));

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        role: "staff",
        sortBy,
        order,
      };
      filters?.status && (params.status = filters.status);
      filters?.isAdmin && (params.isAdmin = filters.isAdmin);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllOrder({
        params,
      });
      if (res && res?.data) {
        setOrderData(res.data.data.orders);
        setTotal(res?.data?.data?.pagination?.totalOrders);
      } else {
        setOrderData([]);
        console.log("no found");
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch order data", err);
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => router.push(`/orders/${row?.id}`)}
          >
            <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(row?.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  useEffect(() => {
    fetchOrder();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteOrder = async () => {
    setDeleteDialogOpen(false);
    if (!itemToDelete) return;
    try {
      const res = await deleteOrder(itemToDelete);
      const message = res?.data?.message;
      if (res?.data && message) {
        toast.success(message);
        fetchOrder();
      }
    } catch (err) {
      console.error("Failed to delete Order", err);
    }
  };

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
              Orders
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                color="primary"
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
                Orders
              </Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#00ABDC",
              borderRadius: "8px",
              textTransform: "none",
            }}
            onClick={() => router.push("/orders/create")}
          >
            Add Order
          </Button>
        </Box>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <DebaunceInput
            placeholder="Search Order..."
            variant="outlined"
            size="small"
            delay={500}
            sx={{
              width: { xs: "180px", sm: "300px" },
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
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
            optionsMap={{ getStatusOptions, isAdminOptions }}
          />
        </Box>

        {/* Data Table */}
        <CommonTable
          columns={tableColumns}
          data={tableData}
          loading={loading}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(e, value) => setPage(value)}
          onSortChange={(newSortBy, newOrder) => {
            setSortBy(newSortBy);
            setOrder(newOrder);
            setPage(1);
          }}
          sortBy={sortBy}
          order={order}
          actionButtons={actionButtons}
          emptyMessage="No Order Found"
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteOrder}
          title="Are you sure you want to delete this record?"
        />
      </CommonCard>
    </Layout>
  );
};

export default Orders;
