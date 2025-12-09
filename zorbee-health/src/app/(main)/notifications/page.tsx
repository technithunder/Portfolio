"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonChip from "@/components/CommonChip";
import DeleteModal from "@/components/DeleteModal";
import { getAllNotifications } from "@/services/api/notificationsApi";

const DeleteIconView = styled(Box)(({ theme }) => ({
  height: "60px",
  width: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: theme.palette.common.white,
  cursor: "pointer",
}));

const Notifications: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      const response = await getAllNotifications();
      console.log("welcome==>40", response);
    } catch (e) {
      console.log(e);
    }
  };

  const NotificationStatus = () => {
    return (
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Box>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                color: "common.black",
                fontSize: "0.875rem",
              }}
              divider={<Typography sx={{ mx: 1 }}>|</Typography>}
            >
              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Mark as read
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Forward
              </Typography>

              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Archive
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    );
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Your notifications
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              These are your notifications for the Zorbee admin dashboard.
            </Typography>
          </Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            mt={isMobile ? 2 : 0}
          >
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() =>
                router.push("/notifications/archive-notifications")
              }
            >
              <CommonChip title="View archive" />
            </Box>
            <Box>
              <CommonChip title="Clear all notification" />
            </Box>
          </Stack>
        </Stack>
      </CommonCard>

      <Box mt={2}>
        <Typography variant="h6" fontWeight={500}>
          Today
        </Typography>
        <Box mt={2}>
          <CommonCard sx={{ backgroundColor: "#E2E6EB" }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box width={isMobile ? "100%" : "90%"}>
                <Typography variant="h6" fontWeight={500}>
                  Notification title placeholder
                </Typography>
                <Typography mt={2} variant="caption" fontWeight={400}>
                  Date: 7th Febuary 2025
                </Typography>
                <Typography
                  component={"p"}
                  mt={1}
                  variant="caption"
                  fontWeight={400}
                >
                  Description: Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </Typography>

                <NotificationStatus />
              </Box>
              <Box
                width={isMobile ? "100%" : "10%"}
                display={"flex"}
                justifyContent={isMobile ? "flex-start" : "flex-end"}
                mt={isMobile ? 1 : 0}
              >
                <DeleteIconView onClick={() => setIsOpen(true)}>
                  <Image
                    src={"/assets/svg/setting/delete.svg"}
                    alt="delete"
                    height={24}
                    width={24}
                  />
                </DeleteIconView>
              </Box>
            </Stack>
          </CommonCard>
          <Box mt={3}>
            <CommonCard>
              <Stack
                direction={isMobile ? "column" : "row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box width={isMobile ? "100%" : "90%"}>
                  <Typography variant="h6" fontWeight={500}>
                    Notification title placeholder
                  </Typography>
                  <Typography mt={2} variant="caption" fontWeight={400}>
                    Date: 7th Febuary 2025
                  </Typography>
                  <Typography
                    component={"p"}
                    mt={1}
                    variant="caption"
                    fontWeight={400}
                  >
                    Description: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </Typography>

                  <NotificationStatus />
                </Box>
                <Box
                  width={isMobile ? "100%" : "10%"}
                  display={"flex"}
                  justifyContent={isMobile ? "flex-start" : "flex-end"}
                  mt={isMobile ? 1 : 0}
                >
                  <DeleteIconView onClick={() => setIsOpen(true)}>
                    <Image
                      src={"/assets/svg/setting/delete.svg"}
                      alt="delete"
                      height={24}
                      width={24}
                    />
                  </DeleteIconView>
                </Box>
              </Stack>
            </CommonCard>
          </Box>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography variant="h6" fontWeight={500}>
          Yesterday
        </Typography>
        <Box mt={2}>
          <CommonCard sx={{ backgroundColor: "#E2E6EB" }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box width={isMobile ? "100%" : "90%"}>
                <Typography variant="h6" fontWeight={500}>
                  Notification title placeholder
                </Typography>
                <Typography mt={2} variant="caption" fontWeight={400}>
                  Date: 7th Febuary 2025
                </Typography>
                <Typography
                  component={"p"}
                  mt={1}
                  variant="caption"
                  fontWeight={400}
                >
                  Description: Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </Typography>

                <NotificationStatus />
              </Box>
              <Box
                width={isMobile ? "100%" : "10%"}
                display={"flex"}
                justifyContent={isMobile ? "flex-start" : "flex-end"}
                mt={isMobile ? 1 : 0}
              >
                <DeleteIconView onClick={() => setIsOpen(true)}>
                  <Image
                    src={"/assets/svg/setting/delete.svg"}
                    alt="delete"
                    height={24}
                    width={24}
                  />
                </DeleteIconView>
              </Box>
            </Stack>
          </CommonCard>
          <Box mt={3}>
            <CommonCard>
              <Stack
                direction={isMobile ? "column" : "row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box width={isMobile ? "100%" : "90%"}>
                  <Typography variant="h6" fontWeight={500}>
                    Notification title placeholder
                  </Typography>
                  <Typography mt={2} variant="caption" fontWeight={400}>
                    Date: 7th Febuary 2025
                  </Typography>
                  <Typography
                    component={"p"}
                    mt={1}
                    variant="caption"
                    fontWeight={400}
                  >
                    Description: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </Typography>

                  <NotificationStatus />
                </Box>
                <Box
                  width={isMobile ? "100%" : "10%"}
                  display={"flex"}
                  justifyContent={isMobile ? "flex-start" : "flex-end"}
                  mt={isMobile ? 1 : 0}
                >
                  <DeleteIconView onClick={() => setIsOpen(true)}>
                    <Image
                      src={"/assets/svg/setting/delete.svg"}
                      alt="delete"
                      height={24}
                      width={24}
                    />
                  </DeleteIconView>
                </Box>
              </Stack>
            </CommonCard>
          </Box>
        </Box>
      </Box>

      <DeleteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default Notifications;
