"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import { deleteStaff, fetchAllUserDetails, updateStatus } from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CommonButton from "@/components/CommonButton";
import CommonFilter from "@/components/CommonFilter";
import { useDealerFormOptions } from "@/hooks/useNationalityAndStatus";
import DeleteDialog from "@/components/CommonDeleteDialog";
import CommonTable from "@/components/CommonTable";
import { genderOptions } from "@/utils/constant";
import moment from "moment";

export const StatusToggleButton = styled(IconButton)(({ status }) => ({
  padding: "4px",
  borderRadius: "50%",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: status === "Active" ? "#e8f5e9" : "#ffebee",
    transform: "scale(1.1)",
  },
}));

const Staff = () => {
  const router = useRouter();
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
  });

  const { statusOptions, fetchStatusOptions } = useDealerFormOptions();

  const tableColumns = [
    {
      id: "firstName",
      label: "Staff Name",
      sortable: true,
    },
    {
      id: "joiningDate",
      label: "Joining Date",
      sortable: false,
    },
    {
      id: "gender",
      label: "Gender",
      sortable: false,
    },
    {
      id: "age",
      label: "Age",
      sortable: false,
    },
    {
      id: "department",
      label: "Department",
      sortable: true,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
    },
  ];

  const tableData =
    staffData?.length > 0 &&
    staffData?.map((staff) => ({
      id: staff?.BasicInfo?.id,
      name:
        `${staff?.BasicInfo?.firstName || ""} ${
          staff?.BasicInfo?.lastName || ""
        }`.trim() || "-",
      gender:
        genderOptions?.find((opt) => opt.value === staff?.PersonalInfo?.gender)
          ?.label || "-",
      joiningDate: staff?.BasicInfo?.joiningDate
        ? moment(staff.BasicInfo.joiningDate).format("DD/MM/YYYY")
        : "-",
      age: staff?.PersonalInfo?.age || "-",
      email: staff?.ContactInfo?.email || "-",
      profilePic: staff?.PersonalInfo?.profilePic,
      department: staff?.OtherInfo?.department || "-",
      status: staff?.OtherInfo?.status || "-",
    }));

  const fetchStaff = async () => {
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
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllUserDetails({ params });
      if (res && res?.data) {
        setStaffData(res.data.data?.users);
        setTotal(res.data.data.total);
      } else {
        setStaffData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle status toggle
  const handleStatusToggle = async (staffId, currentStatus) => {
    try {
      setStatusLoading((prev) => ({ ...prev, [staffId]: true }));

      const newStatus = currentStatus === "Active" ? "In Active" : "Active";

      const payload = {
        status: newStatus,
      };
      const response = await updateStatus(staffId, payload);
      if (response && response.status) {
        toast.success(response?.data?.data?.message);
        fetchStaff();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update staff status", err);
      toast.error("Failed to update staff status");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [staffId]: false }));
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

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => router.push(`/staff/${row?.id}/view`)}
          >
            <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => router.push(`/staff/${row?.id}`)}
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
    fetchStaff();
    fetchStatusOptions();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStaff = async () => {
    setDeleteDialogOpen(false);
    if (!itemToDelete) return;
    try {
      const res = await deleteStaff(itemToDelete);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchStaff();
      }
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  return (
    <Layout>
      <CommonCard>
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
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                Staff
              </Typography>
            </Breadcrumbs>
          </Box>

          <CommonButton
            text=" Add Staff"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => router.push("/staff/create")}
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
            placeholder="Search Staff..."
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
          onStatusToggle={handleStatusToggle}
          actionButtons={actionButtons}
          statusLoading={statusLoading}
          emptyMessage="No Staff Found"
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteStaff}
          title="Are you sure you want to delete this record?"
        />
      </CommonCard>
    </Layout>
  );
};

export default Staff;
