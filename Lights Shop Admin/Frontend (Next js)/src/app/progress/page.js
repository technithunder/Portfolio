"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import { fetchUserProgressDetails } from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import CommonFilter from "@/components/CommonFilter";
import CommonTable from "@/components/CommonTable";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const Progress = () => {
  const { userProgressId } = useSelector((state) => state.userProgress);

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
  const limit = 10;

  const tableColumns = [
    {
      id: "inTime",
      label: "Check In Time",
      sortable: false,
    },
    {
      id: "leadChecked",
      label: "Lead Checked",
      sortable: false,
    },
    {
      id: "leadFollowed",
      label: "Lead Followed",
      sortable: false,
    },
    {
      id: "checkedTomorrowTasks",
      label: "Checked Tomorrow Tasks",
      sortable: false,
    },
    {
      id: "reportingSheetSent",
      label: "Reporting Sheet Sent",
      sortable: false,
    },
    {
      id: "outTime",
      label: "outTime",
      sortable: false,
    },
  ];

  const tableData =
    userData?.length > 0 &&
    userData?.map((item) => ({
      id: item?.id,
      firstName:
        `${item?.firstName || ""} ${item?.lastName || ""}`.trim() || "-",
      inTime: item?.inTime || "-",
      outTime: item?.outTime || "-",
      leadChecked:
        item?.leadChecked === true ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
      leadFollowed:
        item?.leadFollowed === true ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
      checkedTomorrowTasks:
        item?.checkedTomorrowTasks === true ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
      reportingSheetSent:
        item?.reportingSheetSent === true ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
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
      userProgressId && (params.userId = userProgressId);
      filters?.role && (params.role = filters.role);
      filters?.startDate && (params.startDate = filters.startDate);
      filters?.endDate && (params.endDate = filters.endDate);
      searchQuery && (params.search = searchQuery);
      const res = await fetchUserProgressDetails({ params });
      if (res && res?.data) {
        setUserData(res.data.data?.rows);
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

  useEffect(() => {
    fetchDeletedUser();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
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
              Staff Progress
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
                Staff Progress
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
            placeholder="Search staff progress..."
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
            isDate={true}
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
          emptyMessage="No Staff Progress Found"
        />
      </CommonCard>
    </Layout>
  );
};

export default Progress;
