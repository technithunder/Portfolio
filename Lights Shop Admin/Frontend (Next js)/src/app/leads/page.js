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
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import { fetchAllLeadDetails } from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import CommonButton from "@/components/CommonButton";
import CommonFilter from "@/components/CommonFilter";
import { leadTypeOptions } from "@/utils/constant";
import CommonTable from "@/components/CommonTable";
import moment from "moment";

const Leads = () => {
  const router = useRouter();
  const [LeadData, setLeadsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
  });

  const tableColumns = [
    {
      id: "customerName",
      label: "Customer Name",
      sortable: true,
    },
    {
      id: "email",
      label: "Email",
      sortable: true,
    },
    {
      id: "type",
      label: "Type",
      sortable: true,
    },
    {
      id: "followUpDate",
      label: "Follow Up Date",
      sortable: false,
    },
  ];

  const tableData =
    LeadData?.length > 0 &&
    LeadData?.map((item) => ({
      id: item?.id,
      customerName: item?.customerName || "-",
      type: item?.type || "-",
      email: item?.email || "-",
      followUpDate: item?.followUpDate
        ? moment(item?.followUpDate).format("DD/MM/YYYY")
        : "-",
    }));

  const fetchLead = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order,
      };
      filters?.status && (params.status = filters.status);
      filters?.type && (params.type = filters.type);
      filters?.datePreset && (params.datePreset = filters.datePreset);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllLeadDetails({ params });
      if (res && res?.data) {
        setLeadsData(res.data.data?.leads);
        setTotal(res.data.data.total);
      } else {
        setLeadsData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch lead data", err);
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
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => router.push(`/leads/${row?.id}?view=true`)}
          >
            <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => router.push(`/leads/${row?.id}`)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  useEffect(() => {
    fetchLead();
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
              Leads
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
                Lead
              </Typography>
            </Breadcrumbs>
          </Box>

          <CommonButton
            text=" Add Leads"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => router.push("/leads/create")}
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
            placeholder="Search Lead..."
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
            optionsMap={{ leadTypeOptions }}
            nextDate={true}
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
          emptyMessage="No Lead Found"
        />
      </CommonCard>
    </Layout>
  );
};

export default Leads;
