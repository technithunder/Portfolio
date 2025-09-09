"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  styled,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

import Image from "next/image";
import LOGO from "../../public/assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slice/authSlice";
import { fetchAllNotifications, fetchNotificationById } from "@/api";
import CategoryIcon from "@mui/icons-material/Category";

// Styled Components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: "210px",
  backgroundColor: "#ffffff",
  height: "100vh",
  borderRight: "1px solid #e0e0e0",
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  left: 0,
  top: 0,
  zIndex: 1200,
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#a8a8a8",
    },
  },
  // Firefox scrollbar
  scrollbarWidth: "thin",
  scrollbarColor: "#c1c1c1 #f1f1f1",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const LogoContainer = styled(Box)({
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Logo = styled(Box)({
  width: "100px",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ContentContainer = styled(Box)(({ theme, open }) => ({
  marginLeft: open ? "210px" : 0,
  width: open ? "calc(100% - 210px)" : "100%",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    width: "100%",
  },
}));

const NavItem = styled(ListItem)(({ active }) => ({
  backgroundColor: active ? "#00ABDC" : "transparent",
  borderLeft: active ? "4px solid #00ABDC" : "none",
  borderRadius: "8px",
  paddingLeft: active ? "12px" : "16px",
  cursor: "pointer",
  alignItems: "center",
  gap: "8px",
  "&:hover": {
    backgroundColor: "#00ABDC",
  },
}));

const Header = styled(AppBar)({
  backgroundColor: "#ffffff",
  color: "#333333",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
});

const UserAvatar = styled(Avatar)({
  width: "36px",
  height: "36px",
  marginRight: "8px",
});

const OnlineIndicator = styled(Box)({
  position: "absolute",
  width: "10px",
  height: "10px",
  backgroundColor: "#4CAF50",
  borderRadius: "50%",
  bottom: "0",
  right: "0",
  border: "2px solid white",
});

const StyledList = styled(List)({
  position: "relative",
  paddingRight: "20px",
  paddingLeft: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const NotificationHeader = styled(Box)({
  padding: "16px",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const NotificationItem = styled(Box)(({ unread }) => ({
  padding: "12px 16px",
  borderBottom: "1px solid #f5f5f5",
  backgroundColor: unread ? "#f8f9fa" : "#ffffff",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const NotificationFooter = styled(Box)({
  padding: "12px",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0",
});

// Navigation Items Configuration
const navigationItems = [
  {
    text: "Dashboard",
    icon: (
      <Image
        src={"/assets/dashboardGrid.svg"}
        alt="Dashboard"
        width={24}
        height={24}
      />
    ),
    path: "/dashboard",
  },
  {
    text: "Products",
    icon: (
      <Image
        src={"/assets/shopingBag.svg"}
        alt="Product"
        width={24}
        height={24}
      />
    ),
    path: "/product",
  },
  {
    text: "Orders",
    icon: (
      <Image src={"/assets/cart.svg"} alt="Orders" width={24} height={24} />
    ),
    path: "/orders" /* badge: 2  */,
  },
  {
    text: "Customer",
    icon: (
      <Image src={"/assets/users.svg"} alt="Customer" width={24} height={24} />
    ),
    path: "/customer",
  },
  {
    text: "Dealers",
    icon: (
      <Image src={"/assets/store.svg"} alt="Dealers" width={24} height={24} />
    ),
    path: "/dealers",
  },
  {
    text: "Staff",
    icon: (
      <Image src={"/assets/store.svg"} alt="Staff" width={24} height={24} />
    ),
    path: "/staff",
  },
  {
    text: "Leads",
    icon: (
      <Image
        src={"/assets/lineChartUp.svg"}
        alt="Leads"
        width={24}
        height={24}
      />
    ),
    path: "/leads",
  },
  {
    text: "Category",
    icon: <CategoryIcon />,
    path: "/category",
  },
  {
    text: "Deleted Users",
    icon: <RestoreFromTrashIcon />,
    path: "/deleted-users",
  },
];

const bottomNavigationItems = [
  { text: "Support", icon: <HeadsetMicIcon />, path: "/support" },
  { text: "Setting", icon: <SettingsIcon />, path: "/setting" },
];

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  const renderNavItems = (items) => {
    return items.map((item) => (
      <NavItem
        button
        key={item.text}
        active={isActive(item.path)}
        onClick={() => {
          router.push(item.path);
          if (isMobile) setMobileOpen(false);
        }}
      >
        <ListItemIcon sx={{ minWidth: 0 }}>
          {React.cloneElement(item.icon, {
            style: {
              ...(item.icon.props.style || {}),
              filter: isActive(item.path) ? "brightness(0) invert(1)" : "none",
            },
          })}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            color: isActive(item.path) ? "#FFFFFF" : "initial",
          }}
        />
        {item?.badge && (
          <Chip
            label={item.badge}
            size="small"
            sx={{
              backgroundColor: "#e53935",
              color: "white",
              fontSize: "10px",
              height: "20px",
              minWidth: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
      </NavItem>
    ));
  };

  const fetchNotificationData = async () => {
    try {
      const params = {
        page: 1,
        limit: 5,
      };
      const res = await fetchAllNotifications({ params });

      if (res && res?.data) {
        setNotifications(res?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch notification data", err);
    }
  };

  const markAsRead = async (data) => {
    const params = {};
    if (data?.id) params.id = data.id;
    if (data?.type) params.type = data.type;

    try {
      const response = await fetchNotificationById({ params });

      if (response) {
        fetchNotificationData();
      }
    } catch (error) {
      console.log("error", "Error in notification by id api");
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const sidebar = (
    <>
      <Box>
        <LogoContainer>
          <Logo>
            <Image
              src={LOGO}
              alt="Company Logo"
              width={50}
              height={50}
              style={{
                objectFit: "contain",
                width: "50%",
                height: "50%",
              }}
            />
          </Logo>
        </LogoContainer>

        <StyledList component="nav" aria-label="sidebar navigation">
          {renderNavItems(navigationItems)}
        </StyledList>
      </Box>
      <StyledList component="nav" aria-label="sidebar navigation">
        {renderNavItems(bottomNavigationItems)}
      </StyledList>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Fixed Sidebar - Desktop */}
      <SidebarContainer>{sidebar}</SidebarContainer>

      {/* Drawer Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {sidebar}
      </Drawer>

      {/* Main Content */}
      <ContentContainer open={!isMobile}>
        {/* Header */}
        <Header position="sticky">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {/* {navigationItems.find(item => isActive(item.path))?.text || 'Dashboard'} */}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SearchIcon sx={{ color: "#757575", marginRight: "16px" }} />

              {/* Notification Icon */}
              <Box sx={{ position: "relative", marginRight: "16px" }}>
                <IconButton onClick={handleNotificationClick}>
                  <NotificationsIcon sx={{ color: "#757575" }} />
                  {notifications?.unreadCount > 0 && (
                    <Chip
                      label={notifications?.unreadCount}
                      size="small"
                      sx={{
                        backgroundColor: "#e53935",
                        color: "white",
                        fontSize: "10px",
                        height: "16px",
                        minWidth: "16px",
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                      }}
                    />
                  )}
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  },
                  padding: "4px 8px",
                }}
                onClick={handleMenuClick}
              >
                <Box sx={{ position: "relative" }}>
                  <UserAvatar
                    src="/avatar-placeholder.png"
                    alt={
                      userInfo?.userData?.role?.[0]?.toUpperCase() +
                      userInfo?.userData?.role?.slice(1)
                    }
                  />
                  <OnlineIndicator />
                </Box>
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    marginLeft: "8px",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {userInfo?.userData?.role?.[0]?.toUpperCase() +
                      userInfo?.userData?.role?.slice(1)}
                  </Typography>
                  {/* <Typography variant="caption" sx={{ color: "#757575" }}>
                    Admin
                  </Typography> */}
                </Box>
                <ArrowDropDownIcon sx={{ color: "#757575" }} />
              </Box>
            </Box>
          </Toolbar>
        </Header>
        {/* Notification Dropdown */}
        {notifications?.total > 0 && (
          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationOpen}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                width: "360px",
                maxHeight: "600px",
                overflow: "hidden",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: 0,
              },
            }}
          >
            <Box>
              <NotificationHeader>
                <Typography variant="subtitle1" fontWeight="bold">
                  Notifications
                </Typography>
                {notifications?.unreadCount > 0 && (
                  <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => markAsRead({ type: "all" })}
                    sx={{ cursor: "pointer" }}
                  >
                    Mark all as read
                  </Typography>
                )}
              </NotificationHeader>

              <Box
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#bdbdbd",
                    borderRadius: "3px",
                  },
                }}
              >
                {notifications?.data?.length > 0 &&
                  notifications?.data.map((notification) => (
                    <NotificationItem
                      key={notification?.id}
                      unread={!notification?.isRead}
                      onClick={() => markAsRead({ id: notification?.id })}
                    >
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        onClick={() =>
                          router.push(notification?.webRedirectUrl)
                        }
                      >
                        {notification?.avatar && (
                          <Avatar
                            src={notification?.avatar}
                            sx={{ width: 40, height: 40 }}
                          />
                        )}
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {notification?.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification?.body}
                          </Typography>
                        </Box>
                        {!notification?.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              marginTop: 1,
                            }}
                          />
                        )}
                      </Box>
                    </NotificationItem>
                  ))}
              </Box>

              <NotificationFooter>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push("/notifications")}
                >
                  View all notifications
                </Typography>
              </NotificationFooter>
            </Box>
          </Menu>
        )}
        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
        {/* Page Content */}
        <Box>{children}</Box>
      </ContentContainer>
    </Box>
  );
};

export default Layout;
