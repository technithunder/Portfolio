"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  IconButton,
  Chip,
  styled,
  CircularProgress,
  Tooltip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import {
  deleteAddress,
  deleteStaff,
  fetchAllAddressDetails,
  fetchAllUserDetails,
} from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CommonButton from "@/components/CommonButton";
import CommonFilter from "@/components/CommonFilter";
import { useDealerFormOptions } from "@/hooks/useNationalityAndStatus";

const StyledChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === "Active" ? "#e8f5e9" : "#ffebee",
  color: status === "Active" ? "#2e7d32" : "#c62828",
  borderRadius: "4px",
  fontSize: "12px",
  height: "24px",
}));

const Address = () => {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [AddressData, setAddressData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("firstName");
  const [order, setOrder] = useState("ASC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
  });

  const { statusOptions, fetchStatusOptions } = useDealerFormOptions();
  const fetchAddress = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        // role: "staff",
        // sortBy,
        // order,
      };
      filters?.status && (params.status = filters.status);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllAddressDetails({ params });
      if (res && res?.data) {
        setAddressData(res.data.data?.users);
        setTotal(res.data.data.total);
      } else {
        setAddressData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch staff data", err);
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
    fetchAddress();
    fetchStatusOptions();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(AddressData.map((item) => item?.id));
    } else {
      setSelected([]);
    }
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDeleteAddress = async (id) => {
    try {
      const res = await deleteAddress(id);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchAddress();
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
              Address
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
                Address
              </Typography>
            </Breadcrumbs>
          </Box>

          <CommonButton
            text=" Add Address"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => router.push("/address/create")}
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
            placeholder="Search Address..."
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
          {/* <CommonFilter
            onFilterApply={handleFilterApply}
            onSortChange={handleSortChange}
            currentSortBy={sortBy}
            currentOrder={order}
            initialFilters={filters}
            optionsMap={{ statusOptions }}
          /> */}
        </Box>

        {/* Data Table */}
        <TableContainer
          sx={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
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
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < AddressData.length
                    }
                    checked={
                      AddressData.length > 0 &&
                      selected.length === AddressData.length
                    }
                    onChange={handleSelectAll}
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
                    City
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
                    setSortBy("department");
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
                    Country
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "department" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                        // transition: "transform 0.2s ease",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSortBy("department");
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
                    State
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "department" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                        // transition: "transform 0.2s ease",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSortBy("status");
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
                    Zip Code
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "status" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                        // transition: "transform 0.2s ease",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSortBy("status");
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
                    Street
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "status" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                        // transition: "transform 0.2s ease",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : AddressData.length > 0 ? (
                AddressData.map((address, index) => {
                  const isItemSelected = isSelected(address?.id);

                  return (
                    <TableRow
                      key={`${address?.id}-${index}`}
                      selected={isItemSelected}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={(event) =>
                            handleSelectOne(event, address?.id)
                          }
                        />
                      </TableCell>
                      <TableCell>{address?.city || "-"}</TableCell>
                      <TableCell>{address?.country || "-"}</TableCell>
                      <TableCell>{address?.state || "-"}</TableCell>
                      <TableCell>{address?.zipCode || "-"}</TableCell>
                      <TableCell>{address?.street || "-"}</TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          {/* <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() =>
                                router.push(
                                  `/address/${address?.id}/view`
                                )
                              }
                            >
                              <VisibilityIcon
                                fontSize="small"
                                sx={{ color: "#757575" }}
                              />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                router.push(`/address/${address?.id}`)
                              }
                            >
                              <EditIcon
                                fontSize="small"
                                sx={{ color: "#757575" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAddress(address?.id)}
                            >
                              <DeleteIcon
                                fontSize="small"
                                sx={{ color: "#757575" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
                        No Address Found
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
      </CommonCard>
    </Layout>
  );
};

export default Address;
