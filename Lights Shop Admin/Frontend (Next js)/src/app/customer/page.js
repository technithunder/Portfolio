"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
} from "@mui/material";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { deleteStaff, fetchAllUserDetails, updateStatus } from "@/api";
import { toast } from "react-toastify";
import DebaunceInput from "@/utils/DebaunceInput";
import CommonFilter from "@/components/CommonFilter";
import { useDealerFormOptions } from "@/hooks/useNationalityAndStatus";
import CommonButton from "@/components/CommonButton";
import DeleteDialog from "@/components/CommonDeleteDialog";
import CommonTable from "@/components/CommonTable";

const Cusomter = () => {
  const router = useRouter();
  const [dealerData, setDealerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
  });

  const { statusOptions, fetchStatusOptions } = useDealerFormOptions();

  const tableColumns = [
    { id: "firstName", label: "Dealer Name", sortable: true },
    { id: "totalOrders", label: "Total Orders", sortable: false },
    { id: "status", label: "Status", sortable: true },
  ];

  const tableData =
    dealerData?.length > 0 &&
    dealerData.map((dealer) => ({
      id: dealer.BasicInfo.id,
      name:
        `${dealer?.BasicInfo?.firstName || ""} ${
          dealer?.BasicInfo?.lastName || ""
        }`.trim() || "-",
      totalOrders: dealer?.totalOrders || "-",
      profilePic: dealer?.PersonalInfo?.profilePic,
      email: dealer?.ContactInfo?.email || "-",
      status: dealer.OtherInfo.status,
    }));

  const fetchDealer = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        role: "customer",
        sortBy,
        order,
      };
      filters?.status && (params.status = filters.status);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllUserDetails({ params });
      if (res && res?.data) {
        setDealerData(res.data.data.users);
        setTotal(res.data.data.total);
      } else {
        setDealerData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch dealer data", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  // Add this function to handle status toggle
  const handleDealerStatusToggle = async (dealerId, currentStatus) => {
    try {
      setStatusLoading((prev) => ({ ...prev, [dealerId]: true }));

      const newStatus = currentStatus === "Active" ? "In Active" : "Active";

      const payload = {
        status: newStatus,
      };
      const response = await updateStatus(dealerId, payload);
      if (response && response.status) {
        toast.success(response?.data?.data?.message);
        fetchDealer();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update Dealer status", err);
      toast.error("Failed to update Dealer status");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [dealerId]: false }));
    }
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDealer = async () => {
    setDeleteDialogOpen(false);
    if (!itemToDelete) return;
    try {
      const res = await deleteStaff(itemToDelete);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchDealer();
      }
    } catch (err) {
      console.error("Failed to delete dealer", err);
    }
  };

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => router.push(`/customer/${row?.id}`)}
            color="primary"
          >
            <EditIcon fontSize="small" />
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
    fetchStatusOptions();
    fetchDealer();
  }, [searchQuery, page, limit, sortBy, order, filters]);

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
              Customer
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
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                Customer
              </Typography>
            </Breadcrumbs>
          </Box>
          <CommonButton
            text=" Add Customer"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => router.push("/customer/create")}
          />
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
            placeholder="Search Customer..."
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
            optionsMap={{ statusOptions }}
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
          onStatusToggle={handleDealerStatusToggle}
          actionButtons={actionButtons}
          statusLoading={statusLoading}
          emptyMessage="No Customer Found"
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteDealer}
          title="Are you sure you want to delete this record?"
        />
      </CommonCard>
    </Layout>
  );
};

export default Cusomter;
