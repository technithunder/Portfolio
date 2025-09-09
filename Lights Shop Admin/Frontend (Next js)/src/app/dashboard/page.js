"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CardHeader,
  Button,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  AccountBalance,
} from "@mui/icons-material";
import Layout from "@/Layout";
import CommonCard from "@/components/CommonCard";
import CommonTable from "@/components/CommonTable";
import { StatusChip } from "../orders/page";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { manageActiveTab } from "@/redux/slice/activeDashboardTabSlice";
import { fetchDashboardTable } from "@/api";

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  onClick,
  image,
}) => (
  <Card
    sx={{
      overflow: "hidden",
      position: "relative",
      height: "200px",
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.65)", // Adjust opacity as needed
        zIndex: 1,
      }}
    />
    <Box sx={{ position: "relative", zIndex: 2 }}>
      <CardContent sx={{ height: "200px" }}>
        {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}> */}
        {/* <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: `${color}.100`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          {icon}
        </Box> */}
        {/* </Box> */}
        {/* <Button sx={{ textAlign: "" }}>View All</Button>
      <Typography
        sx={{
          background: "red",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        variant="h5"
        color="text.secondary"
      >
        {title}
      </Typography> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
            cursor: "pointer",
          }}
        >
          <Button variant="text" onClick={onClick}>
            View All
          </Button>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "70%",
          }}
        >
          <Typography variant="h5" color="white">
            {title}
          </Typography>
        </Box>

        {/* <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography
        variant="body2"
        color={changeType === "positive" ? "success.main" : "error.main"}
        sx={{ display: "flex", alignItems: "center" }}
      >
        {changeType === "positive" ? (
          <TrendingUp fontSize="small" />
        ) : (
          <TrendingDown fontSize="small" />
        )}
        {change}
      </Typography> */}
      </CardContent>
    </Box>
  </Card>
);

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    orderActiveData: [],
    leadActiveData: [],
    complaintActiveData: [],
    topFourstaff: [],
  });
  const [tables, setTables] = useState([
    {
      id: 1,
      title: "Active Orders Details",
      data: [],
      columns: [
        { id: "status", label: "Status" },
        { id: "staff", label: "Assigned To Staff" },
        { id: "totalAmount", label: "Amount" },
        { id: "expectedDate", label: "Expected Date" },
      ],
      expanded: false,
    },
    {
      id: 2,
      title: "Active Leads Details",
      data: [],
      columns: [
        { id: "followUpDate", label: "Follow Up Date" },
        { id: "staff", label: "Assigned To Staff" },
        { id: "type", label: "Lead Type" },
        { id: "createdAt", label: "Created Date" },
      ],
      expanded: false,
    },
    {
      id: 3,
      title: "Current Complaints Details",
      data: [],
      columns: [
        { id: "order", label: "Order Id" },
        { id: "defactive", label: "Complaint" },
        { id: "assignedTo", label: "Assigned To Staff" },
        { id: "clsoingDate", label: "Closing Date" },
        { id: "status", label: "Status" },
      ],
      expanded: false,
    },
    {
      id: 4,
      title: "Staff Leaderboard",
      data: [],
      columns: [
        { id: "name", label: "Staff Name" },
        { id: "ordersAssigned", label: "Orders Assigned" },
        { id: "ordersDelivered", label: "Orders Delivered" },
        { id: "ordersSuccess", label: "Order Success %" },
        {
          id: "complaintsAssigned ",
          label: "complaints Assigned ",
        },
        {
          id: "complaintsResolved",
          label: "complaints Resolved",
        },
        {
          id: "complaintsSuccess",
          label: "complaints Success",
        },
        { id: "leadsAssigned", label: "Leads Assigned" },
        { id: "leadsConverted", label: "Leads Converted" },
        { id: "leadsSuccess", label: "Lead Success %" },
        { id: "overallPerformance", label: "Overall Performance" },
        { id: "rank", label: "Ranking" },
      ],
      expanded: false,
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardTable();
      if (res && res?.data) {
        setDashboardData({
          orderActiveData: res?.data?.data?.orderActiveData || [],
          leadActiveData: res?.data?.data?.leadActiveData || [],
          complaintActiveData: res?.data?.data?.complaintActiveData || [],
          topFourstaff: res?.data?.data?.topFourstaff || [],
        });

        setTables([
          {
            id: 1,
            title: "Active Orders Details",
            data: res?.data?.data?.orderActiveData || [],
            columns: [
              { id: "orderNumber", label: "Order Id" },
              {
                id: "status",
                label: "Status",
                customRender: (row) => (
                  <StatusChip
                    label={row.status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                    status={row.status}
                    size="small"
                  />
                ),
              },
              {
                id: "staff",
                label: "Assigned To Staff",
                customRender: (row) => (
                  <Box>
                    {row?.OrderStaffs?.map((staff, index, array) => (
                      <Typography key={index} variant="body2">
                        {staff.staff.firstName} {staff.staff.lastName}
                        {index !== array.length - 1 ? ", " : ""}
                      </Typography>
                    ))}
                    {row?.OrderStaffs?.length === 0 && (
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        Unassigned
                      </Typography>
                    )}
                  </Box>
                ),
              },
              {
                id: "totalAmount",
                label: "Amount",
                customRender: (row) => {
                  const amount = Number(row.totalAmount);
                  if (isNaN(amount)) return "₹0.00";
                  return `₹${amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;
                },
              },
              {
                id: "expectedDate",
                label: "Expected Date",
                customRender: (row) => formatDate(row.createdAt),
              },
            ],
            expanded: false,
          },
          {
            id: 2,
            title: "Active Leads Details",
            data: res?.data?.data?.leadActiveData || [],
            columns: [
              {
                id: "followUpDate",
                label: "Follow Up Date",
                customRender: (row) => formatDate(row.followUpDate),
              },
              {
                id: "staff",
                label: "Assigned To Staff",
                customRender: (row) => (
                  <Box>
                    {row?.LeadStaffs?.map((staff, index, array) => (
                      <Typography key={index} variant="body2">
                        {staff.User.firstName} {staff.User.lastName}
                        {index !== array.length - 1 ? ", " : ""}
                      </Typography>
                    ))}
                    {row?.LeadStaffs?.length === 0 && (
                      <Typography variant="body2">Unassigned</Typography>
                    )}
                  </Box>
                ),
              },
              {
                id: "type",
                label: "Lead Type",
                customRender: (row) => (
                  <Chip
                    label={row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                    color={
                      row.type === "hot"
                        ? "error"
                        : row.type === "warm"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                ),
              },
              {
                id: "createdAt",
                label: "Created Date",
                customRender: (row) => formatDate(row.createdAt),
              },
            ],
            expanded: false,
          },
          {
            id: 3,
            title: "Current Complaints Details",
            data: res?.data?.data?.complaintActiveData || [],
            columns: [
              { id: "orderId", label: "Order Id" },
              {
                id: "description",
                label: "Complaint",
              },
              {
                id: "createdAt",
                label: "Assigned To Staff",
                customRender: (row) => (
                  <Box>
                    {row?.complaintStaffs?.length > 0 ? (
                      row.complaintStaffs.map((staff, index, array) => (
                        <Typography key={index} variant="body2">
                          {staff.User.firstName} {staff.User.lastName}
                          {index !== array.length - 1 ? ", " : ""}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        Unassigned
                      </Typography>
                    )}
                  </Box>
                ),
              },
              {
                id: "status",
                label: "Closing Date",
                customRender: (row) => formatDate(row.targetCloseDate),
              },
              {
                id: "status",
                label: "Status",
                customRender: (row) => {
                  const formattedStatus = row.status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());

                  return (
                    <Chip
                      label={formattedStatus}
                      color={row.status === "open" ? "success" : "error"}
                      size="small"
                    />
                  );
                },
              },
            ],
            expanded: false,
          },
          {
            id: 4,
            title: "Staff Leaderboard",
            data: res?.data?.data?.topFourstaff || [],
            columns: [
              {
                id: "id",
                label: "Staff Id",
              },
              {
                id: "name",
                label: "Staff Name",
                customRender: (row) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={row.image}
                      alt={`${row.firstName} ${row.lastName}`}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography>
                      {row.firstName} {row.lastName}
                    </Typography>
                  </Box>
                ),
              },
              {
                id: "ordersAssigned",
                label: "Orders Assigned",
              },
              {
                id: "ordersDelivered",
                label: "Orders Delivered",
              },
              {
                id: "ordersSuccess",
                label: "Order Success %",
                customRender: (row) => `${row.ordersSuccess}%`,
              },
              {
                id: "complaintsAssigned ",
                label: "complaints Assigned ",
              },
              {
                id: "complaintsResolved",
                label: "complaints Resolved",
              },
              {
                id: "complaintsSuccess",
                label: "complaints Success",
              },
              {
                id: "leadsAssigned",
                label: "Leads Assigned",
              },
              {
                id: "leadsConverted",
                label: "Leads Converted",
              },
              {
                id: "leadsSuccess",
                label: "Lead Success %",
                customRender: (row) => `${row.leadsSuccess}%`,
              },
              {
                id: "overallPerformance",
                label: "Overall Performance",
                customRender: (row) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>{row.overallPerformance}%</Typography>
                    {row.overallPerformance >= 50 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                  </Box>
                ),
              },
              {
                id: "rank",
                label: "Ranking",
                customRender: (row) => (
                  <Chip
                    label={`#${row.rank}`}
                    color={
                      row.rank === 1
                        ? "success"
                        : row.rank === 2
                        ? "primary"
                        : row.rank === 3
                        ? "warning"
                        : "default"
                    }
                  />
                ),
              },
            ],
            expanded: false,
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <CommonCard>
        <Box sx={{ py: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label="All Time" variant="outlined" />
              <Chip label="12 Months" variant="outlined" />
              <Chip label="30 Days" variant="outlined" />
              <Chip label="7 Days" variant="outlined" />
              <Chip label="24 Hour" variant="outlined" />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* <Button variant="outlined" startIcon={<CalendarToday />}>
                Select Dates
              </Button> */}
              {/* <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ backgroundColor: "#00ABDC" }}
              >
                Add Product
              </Button> */}
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
              <MetricCard
                title="Today's Dispatches"
                onClick={() => {
                  dispatch(manageActiveTab(4));
                  router.push(`/dashboard/details`);
                }}
                image={"/assets/dashboardBgImage1.jpeg"}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
              <MetricCard
                title="Today's Leads"
                onClick={() => {
                  dispatch(manageActiveTab(5));
                  router.push(`/dashboard/details`);
                }}
                image={"/assets/dashboardBgImage3.jpeg"}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  position: "relative",
                  height: "200px",
                  backgroundImage: `url('/assets/dashboardBgImage5.jpeg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.65)", 
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 2 }}>
                  <CardHeader
                    // title={tables[0].title}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(manageActiveTab(0));
                          router.push(`/dashboard/details`);
                        }}
                      >
                        View All
                      </Button>
                    }
                  />
                  <CardContent>
                    {/* <CommonTable
                    columns={tables[0].columns}
                    data={
                      tables[0].expanded
                        ? tables[0].data
                        : tables[0].data.slice(0, 5)
                    }
                    loading={loading}
                    total={tables[0].data.length}
                    page={1}
                    limit={tables[0].expanded ? 10 : 5}
                    stickyFooter={false}
                  /> */}
                    <Box
                      sx={{
                        height: "80px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" color="white">
                          {tables[0].title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  position: "relative",
                  height: "200px",
                  backgroundImage: `url('/assets/dashboardBgImage2.jpeg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.65)", 
                    zIndex: 1,
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 2 }}>
                  <CardHeader
                    // title={tables[1].title}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(manageActiveTab(1));
                          router.push(`/dashboard/details`);
                        }}
                      >
                        {tables[1].expanded ? "Show Less" : "View All"}
                      </Button>
                    }
                  />
                  <CardContent>
                    {/* <CommonTable
                    columns={tables[1].columns}
                    data={
                      tables[1].expanded
                        ? tables[1].data
                        : tables[1].data.slice(0, 5)
                    }
                    loading={loading}
                    total={tables[1].data.length}
                    page={1}
                    limit={tables[1].expanded ? 10 : 5}
                    stickyFooter={false}
                  /> */}
                    <Box
                      sx={{
                        height: "80px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" color="white">
                          {tables[1].title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  position: "relative",
                  height: "200px",
                  backgroundImage: `url('/assets/dashboardBgImage6.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    zIndex: 1,
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 2 }}>
                  <CardHeader
                    // title={tables[2].title}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(manageActiveTab(2));
                          router.push(`/dashboard/details`);
                        }}
                      >
                        {tables[2].expanded ? "Show Less" : "View All"}
                      </Button>
                    }
                  />
                  <CardContent>
                    {/* <CommonTable
                    columns={tables[2].columns}
                    data={
                      tables[2].expanded
                        ? tables[2].data
                        : tables[2].data.slice(0, 5)
                    }
                    loading={loading}
                    total={tables[2].data.length}
                    page={1}
                    limit={tables[2].expanded ? 10 : 5}
                    stickyFooter={false}
                  /> */}
                    <Box
                      sx={{
                        height: "80px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" color="white">
                          {tables[2].title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  position: "relative",
                  height: "200px",
                  backgroundImage: `url('/assets/dashboardBgImage4.jpeg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.65)", 
                    zIndex: 1,
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 2 }}>
                  <CardHeader
                    // title={tables[3].title}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(manageActiveTab(3));
                          router.push(`/dashboard/details`);
                        }}
                      >
                        {tables[3].expanded ? "Show Less" : "View All"}
                      </Button>
                    }
                  />
                  <CardContent>
                    {/* <CommonTable
                    columns={tables[3].columns}
                    data={
                      tables[3].expanded
                        ? tables[3].data
                        : tables[3].data.slice(0, 5)
                    }
                    loading={loading}
                    total={tables[3].data.length}
                    page={1}
                    limit={tables[3].expanded ? 10 : 5}
                    stickyFooter={false}
                  /> */}
                    <Box
                      sx={{
                        height: "80px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" color="white">
                          {tables[3].title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CommonCard>
    </Layout>
  );
};

export default Dashboard;
