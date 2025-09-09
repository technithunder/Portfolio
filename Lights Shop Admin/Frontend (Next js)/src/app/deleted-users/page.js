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
  Tooltip,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import { fetchAllDeletedUserDetails, restoreDeletedUser } from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { toast } from "react-toastify";
import CommonFilter from "@/components/CommonFilter";
import CommonTable from "@/components/CommonTable";
import RestoreIcon from "@mui/icons-material/Restore";
import { roleOptions } from "@/utils/constant";

const Restore = () => {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
  });
  const limit = 5;

  const tableColumns = [
    {
      id: "firstName",
      label: "User Name",
      sortable: true,
    },
    {
      id: "position",
      label: "Position",
      sortable: true,
    },
    {
      id: "department",
      label: "Department",
      sortable: true,
    },
    {
      id: "role",
      label: "Role",
      sortable: true,
    },
  ];

  const tableData =
    userData?.length > 0 &&
    userData?.map((item) => ({
      id: item?.id,
      firstName:
        `${item?.firstName || ""} ${item?.lastName || ""}`.trim() || "-",
      email: item?.email || "-",
      profilePic: item?.PersonalInfo?.profilePic,
      department: item?.department || "-",
      role: item?.role || "-",
      profilePic: item?.image || "",
      position: item?.position || "-",
    }));

  const fetchDeletedUser = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order,
      };
      filters?.role && (params.role = filters.role);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllDeletedUserDetails({ params });
      if (res && res?.data) {
        setUserData(res.data.data?.users);
        setTotal(res.data.data.total);
      } else {
        setUserData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch deleted user data", err);
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

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="Restore">
          <IconButton
            size="small"
            onClick={() => handleRestoreUser(row?.id)}
            color="primary"
          >
            <RestoreIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  useEffect(() => {
    fetchDeletedUser();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleRestoreUser = async (id) => {
    if (!id) return;
    try {
      const res = await restoreDeletedUser(id);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchDeletedUser();
      }
    } catch (err) {
      console.error("Failed to restore users", err);
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
              Deleted Users
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
                Deleted Users
              </Typography>
            </Breadcrumbs>
          </Box>
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
            placeholder="Search Users..."
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
            optionsMap={{ roleOptions }}
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
          emptyMessage="No Staff Found"
        />
      </CommonCard>
    </Layout>
  );
};

export default Restore;
