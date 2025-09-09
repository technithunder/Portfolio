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
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { deleteNotification, fetchAllNotifications } from "@/api";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CommonButton from "@/components/CommonButton";

const Notifications = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [notificationData, setNotificationData] = useState([]);

  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };

      const res = await fetchAllNotifications({ params });
      if (res && res?.data) {
        setNotificationData(res?.data?.data?.data);
        setTotal(res?.data?.data?.total);
      } else {
        setNotificationData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch notification data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (data) => {
    try {
      const params = {};
      if (data?.id) params.id = data.id;
      if (data?.type) params.type = data.type;

      const res = await deleteNotification({ params });
      const message = res?.data?.message;
      if (res?.data && message) {
        toast.success(message);
        fetchNotificationData();
      }
    } catch (err) {
      console.error("Failed to delete Notifications", err);
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, [page, limit]);

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
              Notifications
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
                Notifications
              </Typography>
            </Breadcrumbs>
          </Box>

          <CommonButton
            text=" Clear All Notification"
            color="primary"
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => handleDeleteNotification({ type: "all" })}
          />
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
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Notifications
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
              ) : notificationData?.length > 0 ? (
                notificationData?.map((notify, index) => {
                  return (
                    <TableRow key={`${notify?.id}-${index}`} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {notify?.title || "-"}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {notify?.body || "-"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() =>
                                router.push(`${notify?.webRedirectUrl}`)
                              }
                            >
                              <VisibilityIcon
                                fontSize="small"
                                sx={{ color: "#757575" }}
                              />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteNotification({ id: notify?.id })
                              }
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
                        No Notifications Found
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

export default Notifications;
