"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  Avatar,
  Chip,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import Layout from "@/Layout";
import CommonTable from "@/components/CommonTable";
import { useSelector } from "react-redux";
import {
  addMessage,
  addMessageLead,
  addMessageOrder,
  fetchChatMessage,
  fetchChatMessageLead,
  fetchChatMessageOrder,
  fetchDashboardList,
} from "@/api";
import { StatusChip } from "@/app/orders/page";
import NextImage from "next/image";
import DebaunceInput from "@/utils/DebaunceInput";
import ChatIcon from "@mui/icons-material/Chat";
import moment from "moment";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import ChatDialog from "@/components/CommonChatDialog";
import { useRouter } from "next/navigation";

const DashboardDetails = () => {
  const adminId = useSelector((state) => state.auth?.userInfo.userData.id);
  const { activeTabKey } = useSelector((state) => state.dashboardTab);
  const [activeTab, setActiveTab] = useState(activeTabKey || 0);
  const router = useRouter();
  const hasSetSort = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatPage, setChatPage] = useState(1);
  const [chatLimit, setChatLimit] = useState(10);
  const [chatTotal, setChatTotal] = useState(0);
  const [data, setData] = useState({
    orders: [],
    leads: [],

    leaderboard: [],
    pagination: {},
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenChat = async (id) => {
    const { fetchMessagesFn } = getChatAPIs();
    setSelectedComplaint(id);
    setChatOpen(true);
    setChatPage(1);

    try {
      setIsLoading(true);
      const res = await fetchMessagesFn(id, 1);
      const leads = res?.data?.leads || res?.data?.orders || [];

      const mapped = leads.map((msg) => ({
        sender: msg.userId === adminId ? "me" : "staff",
        text: msg.note,
        createdAt: msg.createdAt,
      }));

      setMessages(mapped);
      setChatTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const ADMIN_ID = adminId;

  const fetchMessages = async (Id, page) => {
    try {
      setIsLoading(true);
      const res = await fetchMessagesFn(Id, page, chatLimit);
      if (res?.data) {
        const leads = res?.data?.leads || res?.data?.orders || [];

        const mappedMessages = leads.map((msg) => ({
          sender: msg.userId === ADMIN_ID ? "me" : "staff",
          text: msg.note,
          createdAt: msg.createdAt,
        }));

        setMessages(mappedMessages); // overwrite
        setChatTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };
  // const handleChatPageChange = (newPage) => {
  //   setChatPage(newPage);
  //   fetchMessages(selectedComplaint, newPage);
  // };
  const handleChatPageChange = async (newPage) => {
    if (newPage <= 0) return;
    const totalPages = Math.ceil(chatTotal / chatLimit);
    if (newPage > totalPages) return;

    try {
      setIsLoading(true);
      const res = await fetchMessagesFn(selectedComplaint, newPage, chatLimit);
      const leads = res?.data?.leads || res?.data?.orders || [];

      const newMessages = leads.map((msg) => ({
        sender: msg.userId === adminId ? "me" : "staff",
        text: msg.note,
        createdAt: msg.createdAt,
      }));

      setMessages((prev) => [...prev, ...newMessages]); // Append older messages
      setChatPage(newPage);
    } catch (err) {
      console.error("Error loading older messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatAPIs = () => {
    switch (activeTab) {
      case 0:
        return {
          fetchMessagesFn: fetchChatMessageOrder,
          sendMessageFn: addMessageOrder,
          recordIdKey: "orderId",
        };
      case 1:
        return {
          fetchMessagesFn: fetchChatMessageLead,
          sendMessageFn: addMessageLead,
          recordIdKey: "leadId",
        };
      case 2:
      default:
        return {
          fetchMessagesFn: fetchChatMessage,
          sendMessageFn: addMessage,
          recordIdKey: "complaintId",
        };
    }
  };

  const { fetchMessagesFn, sendMessageFn, recordIdKey } = getChatAPIs();

  const getListType = () => {
    switch (activeTab) {
      case 0:
        return "active_order";
      case 1:
        return "active_lead";
      case 2:
        return "active_complaints";
      case 3:
        return "active_staff";
      case 4:
        return "active_order";
      case 5:
        return "active_lead";
      default:
        return "active_order";
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        listType: getListType(),
        page,
        limit,
        sortBy,
        order,
      };
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (activeTab === 4) {
        params.expectedDate = moment().format("YYYY-MM-DD");
      }
      if (activeTab === 5) {
        params.followUpDate = moment().format("YYYY-MM-DD");
      }
      const res = await fetchDashboardList({ params });
      if (res && res?.data) {
        const responseData = res.data.data;
        if (activeTab === 0) {
          setData((prev) => ({
            ...prev,
            orders: responseData?.orders || [],
          }));
        } else if (activeTab === 1) {
          setData((prev) => ({
            ...prev,
            leads: responseData?.leads || [],
          }));
        } else if (activeTab === 2) {
          setData((prev) => ({
            ...prev,
            complaints: responseData?.leads || [],
          }));
        } else if (activeTab === 3) {
          setData((prev) => ({
            ...prev,
            leaderboard: responseData?.leaderboard || [],
          }));
        } else if (activeTab === 4) {
          setData((prev) => ({
            ...prev,
            orders: responseData?.orders || [], 
          }));
          console.log("response=====>", responseData);
        } else if (activeTab === 5) {
          setData((prev) => ({
            ...prev,
            leads: responseData?.leads || [], 
          }));
        }
        setTotal(
          responseData?.pagination?.totalStaff ||
            responseData?.total ||
            responseData?.pagination?.totalOrders ||
            0
        );
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page, limit, sortBy, order, searchQuery]);

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
    setSearchQuery("");

    if (newValue !== 3) {
      setSortBy("id");
      setOrder("DESC");
    }
  };

  const tabData = [
    {
      label: "Active Orders Details",
      columns: [
        {
          id: "orderNumber",
          label: "Order ID",
          sortable: true,
        },
        {
          id: "customer",
          label: "Customer",
          customRender: (row) => (
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {row.user?.firstName} {row.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {row.user?.email}
              </Typography>
            </Box>
          ),
        },
        {
          id: "items",
          label: "Items",
          customRender: (row) => (
            <Box>
              {row.orderItems?.map((item) => {
                const formatPrice = (price) => {
                  const num = Number(price);
                  return isNaN(num)
                    ? "0.00"
                    : num.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                };

                return (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.productName} (Qty: {item.quantity})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{formatPrice(item.unitPrice)} × {item.quantity} = ₹
                      {formatPrice(item.totalPrice)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ),
        },
        {
          id: "staff",
          label: "Assigned Staff",
          customRender: (row) => (
            <Box>
              {row.assignedStaff?.map((staff, index) => (
                <Box
                  key={staff.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Avatar
                    src={staff.image}
                    alt={`${staff.firstName} ${staff.lastName}`}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">
                    {staff.firstName} {staff.lastName}
                  </Typography>
                </Box>
              ))}
              {(!row.assignedStaff || row.assignedStaff.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  Unassigned
                </Typography>
              )}
            </Box>
          ),
        },
        {
          id: "status",
          label: "Status",
          sortable: true,
          customRender: (row) => (
            <StatusChip
              label={row.status
                ?.replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              status={row.status}
              size="small"
            />
          ),
        },
        {
          id: "totalAmount",
          label: "Total Amount",
          sortable: true,
          customRender: (row) => {
            const amount = Number(row.totalAmount);
            const formattedAmount = isNaN(amount)
              ? "0.00"
              : amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

            return (
              <Typography variant="body2" fontWeight="bold">
                ₹{formattedAmount}
              </Typography>
            );
          },
        },
        {
          id: "Notes",
          label: "Notes",
          customRender: (row) => (
            <Box>
              <ChatIcon
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleOpenChat(row.id);
                }}
              />
            </Box>
          ),
        },
        // {
        //   id: "dates",
        //   label: "Dates",
        //   customRender: (row) => (
        //     <Box>
        //       <Typography variant="body2">
        //         Created: {formatDate(row.createdAt)}
        //       </Typography>
        //       <Typography variant="body2">
        //         Expected: {formatDate(row.expectedDate)}
        //       </Typography>
        //     </Box>
        //   ),
        // },
      ],
      data: data.orders,
    },
    {
      label: "Active Leads Details",
      columns: [
        {
          id: "email",
          label: "Email",
        },
        {
          id: "customerName",
          label: "Customer Name",
        },
        {
          id: "mobileNumber",
          label: "Mobile Number",
        },
        {
          id: "status",
          label: "Status",
          sortable: true,
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
          id: "followUpDate",
          label: "Date",
          sortable: true,
          customRender: (row) => (
            <Typography variant="body2">
              {moment(row?.followUpDate).format("DD/MM/YYYY")}
            </Typography>
          ),
        },
        {
          id: "Notes",
          label: "Notes",
          customRender: (row) => (
            <Box>
              <ChatIcon
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleOpenChat(row.id);
                }}
              />
            </Box>
          ),
        },
      ],
      data: data.leads,
    },
    {
      label: "Current Complaints Details",
      columns: [
        {
          id: "orderNumber",
          label: "Order Id",
          sortable: true,
          customRender: (row) => (
            <Box>
              <Typography variant="body2">{row.order.orderNumber}</Typography>
            </Box>
          ),
        },
        {
          id: "description",
          label: "Complaint text",
        },
        {
          id: "creator",
          label: "Complaint Creator",
          customRender: (row) => (
            <Box>
              <Typography variant="body2">
                {row.creator.firstName} {row.creator.lastName}
              </Typography>
            </Box>
          ),
        },
        {
          id: "assignedStaff",
          label: "Complaint Assigned to staff",
          sortable: true,
          customRender: (row) => (
            <Box>
              {row?.assignedStaff?.map((staff, index, array) => (
                <Typography key={index} variant="body2">
                  {staff.firstName} {staff.lastName}
                  {index !== array.length - 1 ? ", " : ""}
                </Typography>
              ))}
              {row?.assignedStaff?.length === 0 && (
                <Typography variant="body2">Unassigned</Typography>
              )}
            </Box>
          ),
        },
        {
          id: "targetCloseDate",
          label: "Target Closing Date",
          customRender: (row) => (
            <Typography variant="body2">
              {moment(row?.targetCloseDate).format("DD/MM/YYYY")}
            </Typography>
          ),
        },
        {
          id: "status",
          label: "Status",
          sortable: true,
          customRender: (row) => (
            <Chip
              label={row.status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              color={row.status === "open" ? "success" : "error"}
              size="small"
            />
          ),
        },
        {
          id: "Notes",
          label: "Notes",
          customRender: (row) => (
            <Box>
              <ChatIcon
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenChat(row.id);
                }}
              />
            </Box>
          ),
        },
      ],
      data: data.complaints,
    },
    {
      label: "Staff Leaderboard",
      columns: [
        {
          id: "empId",
          label: "Staff ID",
          // sortable: true,
        },
        {
          id: "name",
          label: "Staff Name",
          // sortable: true,
          customRender: (row) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={row.profilePic}
                alt={`${row.firstName} ${row.lastName}`}
              />
              <Typography variant="body2" fontWeight="bold">
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
          sortable: true,
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
      data: data.leaderboard,
    },
    {
      label: "Today's dispatches",
      columns: [
        {
          id: "orderNumber",
          label: "Order ID",
          sortable: true,
        },
        {
          id: "customer",
          label: "Customer",
          customRender: (row) => (
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {row.user?.firstName} {row.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {row.user?.email}
              </Typography>
            </Box>
          ),
        },
        {
          id: "items",
          label: "Items",
          customRender: (row) => (
            <Box>
              {row.orderItems?.map((item) => {
                const formatPrice = (price) => {
                  const num = Number(price);
                  return isNaN(num)
                    ? "0.00"
                    : num.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                };

                return (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.productName} (Qty: {item.quantity})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{formatPrice(item.unitPrice)} × {item.quantity} = ₹
                      {formatPrice(item.totalPrice)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ),
        },
        {
          id: "staff",
          label: "Assigned Staff",
          customRender: (row) => (
            <Box>
              {row.assignedStaff?.map((staff, index) => (
                <Box
                  key={staff.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Avatar
                    src={staff.image}
                    alt={`${staff.firstName} ${staff.lastName}`}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">
                    {staff.firstName} {staff.lastName}
                  </Typography>
                </Box>
              ))}
              {(!row.assignedStaff || row.assignedStaff.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  Unassigned
                </Typography>
              )}
            </Box>
          ),
        },
        {
          id: "status",
          label: "Status",
          sortable: true,
          customRender: (row) => (
            <StatusChip
              label={row.status
                ?.replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              status={row.status}
              size="small"
            />
          ),
        },
        {
          id: "totalAmount",
          label: "Total Amount",
          sortable: true,
          customRender: (row) => {
            const amount = Number(row.totalAmount);
            const formattedAmount = isNaN(amount)
              ? "0.00"
              : amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

            return (
              <Typography variant="body2" fontWeight="bold">
                ₹{formattedAmount}
              </Typography>
            );
          },
        },
        {
          id: "expectedDate",
          label: "Expected Date",
          sortable: true,
          customRender: (row) => (
            <Typography variant="body2">
              {moment(row?.expectedDate).format("DD/MM/YYYY")}
            </Typography>
          ),
        },
        {
          id: "Notes",
          label: "Notes",
          customRender: (row) => (
            <Box>
              <ChatIcon
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // prevent row click
                  handleOpenChat(row.id);
                }}
              />
            </Box>
          ),
        },
      ],
      data: data.orders,
    },
    {
      label: "Today's Leads",
      columns: [
        {
          id: "email",
          label: "Email",
        },
        {
          id: "customerName",
          label: "Customer Name",
        },
        {
          id: "mobileNumber",
          label: "Mobile Number",
        },
        {
          id: "status",
          label: "Status",
          sortable: true,
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
          id: "followUpDate",
          label: "Date",
          sortable: true,
          customRender: (row) => (
            <Typography variant="body2">
              {moment(row?.followUpDate).format("DD/MM/YYYY")}
            </Typography>
          ),
        },
        {
          id: "Notes",
          label: "Notes",
          customRender: (row) => (
            <Box>
              <ChatIcon
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleOpenChat(row.id);
                }}
              />
            </Box>
          ),
        },
      ],
      data: data.leads,
    },
  ];

  const handleRowClick = (row) => {
    if (activeTab === 0) {
      router.push(`/orders/${row.id}`);
    } else if (activeTab === 1) {
      router.push(`/leads/${row.id}?view=true`);
    } else if (activeTab === 2) {
      router.push(`/complaint/${row.id}`);
    } else if (activeTab === 3) {
      router.push(`/staff/${row.id}/view`);
    } else if (activeTab === 4) {
      router.push(`/orders/${row.id}`);
    } else if (activeTab === 5) {
      router.push(`/leads/${row.id}?view=true`);
    }
  };

  useEffect(() => {
    if (activeTab === 3 && !hasSetSort.current) {
      setSortBy("overallPerformance");
      setOrder("DESC");
      hasSetSort.current = true;
    }

    if (activeTab !== 3) {
      hasSetSort.current = false;
    }
  }, [activeTab]);
  return (
    <Layout>
      <CommonCard>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Dashboard Details
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabData.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Search and Table Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {tabData[activeTab].label}
            </Typography>
            <DebaunceInput
              placeholder={`Search ${tabData[
                activeTab
              ].label.toLowerCase()}...`}
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
          </Box>

          {/* Table */}
          <CommonTable
            columns={tabData[activeTab].columns}
            data={tabData[activeTab].data}
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
            emptyMessage={`No ${tabData[activeTab].label.toLowerCase()} found`}
            stickyFooter={true}
            onRowClick={(row) => handleRowClick(row)}
          />
        </Box>
      </CommonCard>
      <ChatDialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        complaint={selectedComplaint}
        loading={isLoading}
        messages={messages}
        page={chatPage}
        limit={chatLimit}
        total={chatTotal}
        fetchMessagesFn={fetchMessages}
        sendMessageFn={sendMessageFn}
        recordIdKey={recordIdKey}
        onPageChange={handleChatPageChange}
        chatTitle={
          activeTab === 0
            ? `Order #${selectedComplaint}`
            : activeTab === 1
            ? `Lead #${selectedComplaint}`
            : `Complaint #${selectedComplaint}`
        }
      />
    </Layout>
  );
};

export default DashboardDetails;
