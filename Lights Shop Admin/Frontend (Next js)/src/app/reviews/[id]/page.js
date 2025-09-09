"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,
  Avatar,
  InputAdornment,
  Rating,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import {
  deleteNotification,
  fetchAllNotifications,
  fetchProductReview,
} from "@/api";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import NextImage from "next/image";
import DebaunceInput from "@/utils/DebaunceInput";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Reviews = ({ params }) => {
  const productId = params?.id;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");

  const [reviewData, setReviewData] = useState([]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const params = {
        productId,
        page,
        limit,
        sortBy,
        order,
      };
      searchQuery && (params.search = searchQuery);

      const res = await fetchProductReview({ params });

      if (res && res?.data) {
        setReviewData(res?.data?.data?.review);
        setTotal(res?.data?.data?.total);
      } else {
        setReviewData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch notification data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  useEffect(() => {
    fetchReviewData();
  }, [page, limit, searchQuery, sortBy, order]);

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
              Reviews
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
                Reviews
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
            placeholder="Search Product Review..."
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
                    Name
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "firstName" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
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
                    Email
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
                <TableCell
                  onClick={() => {
                    setSortBy("rating");
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
                    Product Rating
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "rating" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSortBy("reviewText");
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
                    Product Reviews
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === "reviewText" && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
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
              ) : reviewData?.length > 0 ? (
                reviewData?.map((notify, index) => {
                  return (
                    <TableRow key={`${notify?.id}-${index}`} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {notify?.user?.image ? (
                            <NextImage
                              src={notify?.user?.image}
                              alt={notify?.user?.firstName}
                              width={34}
                              height={34}
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                          ) : (
                            <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} />
                          )}

                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {notify?.user?.firstName || "-"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {notify?.user?.email || "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box>
                            <Rating
                              value={notify?.rating}
                              precision={0.5}
                              emptyIcon={<StarIcon style={{ opacity: 0.55 }} />}
                              sx={{
                                "&.Mui-disabled": {
                                  opacity: 1,
                                },
                                "& .MuiRating-iconEmpty": {
                                  opacity: 0.55,
                                },
                              }}
                              disabled={true}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {notify?.reviewText || "-"}
                            </Typography>
                          </Box>
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
                        No Review Found
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

export default Reviews;
