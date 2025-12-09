"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import CommonSelect from "@/components/CommonSelect";
import CommonButton from "@/components/CommonButton";
import CommonNoteCard from "@/components/CommonNoteCard";

const options = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const NewPushNotification = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [permission, setPermission] = useState<string | number | null>("");

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Add Details
            </Typography>

            <Box mt={3}>
              <CommonNoteCard rows={1} title="Notification title" />
            </Box>
            <Box mt={4}>
              <CommonNoteCard rows={4} title="Notification message" />
            </Box>
          </CommonCard>
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <CommonCard>
            <Typography variant="h6" fontWeight={500}>
              Schedule
            </Typography>
            <Box mt={2}>
              <CommonSelect
                label="User base"
                placeholder="Please Select...."
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
                sx={{
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #EAEAEA",
                }}
              />
            </Box>
            <Box mt={2}>
              <CommonSelect
                label="Single user email"
                placeholder="Please Select...."
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
                sx={{
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #EAEAEA",
                }}
              />
            </Box>
            <Box mt={2}>
              <CommonSelect
                label="Push reminder"
                placeholder="Please Select...."
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
                sx={{
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #EAEAEA",
                }}
              />
            </Box>
            <Box mt={2}>
              <CommonSelect
                label="Push date"
                placeholder="Please Select...."
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
                sx={{
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #EAEAEA",
                }}
              />
            </Box>
          </CommonCard>

          <Box mt={2}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Save details
              </Typography>
              <Typography>
                Save the details of this push notification. You can always
                return and edit it if needed.
              </Typography>

              <Stack justifyContent={"flex-end"} mt={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                  }}
                >
                  <CommonButton
                    buttonText="Cancel"
                    sx={{
                      backgroundColor: "#E2E6EB",
                      maxWidth: isMobile ? "100%" : "max-content",
                    }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                  />
                  <CommonButton
                    buttonText="Submit for approval"
                    sx={{ maxWidth: isMobile ? "100%" : "max-content" }}
                    buttonTextStyle={{ fontSize: "14px !important" }}
                  />
                </Box>
              </Stack>
            </CommonCard>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default NewPushNotification;
