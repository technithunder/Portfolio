"use client";
import React, { useState } from "react";
import { Box, Grid2, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonAttachmentCard from "@/components/CommonAttachmentCard";
import CommonButton from "@/components/CommonButton";
import CommonGetHelpCard from "@/components/CommonGetHelpCard";
import CommonIconText from "@/components/CommonIconText";

const Issue_overview = [
  {
    label: "Client name",
    value: "Reuben Hale",
  },
  {
    label: "Invoice number",
    value: "#1234456",
  },
  {
    label: "Date finalised",
    value: "01 January 2025",
  },
  {
    label: "Zorbee fee",
    value: "£5.00",
  },
  {
    label: "Status",
    value: "Paid",
  },
];

const data = [
  {
    title: "Reuben Hale",
    description: "Unread email",
    dateAndTime: "06/02/2025 | 10:04",
  },
  {
    title: "Zorbee support",
    description: "Kat Hall",
    dateAndTime: "06/02/2025 | 09:10",
  },
  {
    title: "Zorbee support",
    description: "Auto response",
    dateAndTime: "05/02/2025 | 21:12",
  },
  {
    title: "Reuben Hale",
    description: "Support ticket raised",
    dateAndTime: "05/02/2025 | 21:11",
  },
];

const ClinicalProfile = () => {
  const [message, setMessage] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMail, setSelectedMail] = useState<number>(0);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "end",
          gap: isMobile ? 1 : 3,
        }}
      >
        <Typography
          sx={{
            background: "#ECF2FB",
            color: "#518ADD",
            fontSize: "15px",
            padding: isMobile ? "12px" : "20px",
            borderRadius: "8px",
          }}
        >
          Escalate
        </Typography>
        <Typography
          sx={{
            background: "#ECF2FB",
            color: "#518ADD",
            fontSize: "15px",
            padding: isMobile ? "12px" : "20px",
            borderRadius: "8px",
          }}
        >
          Mark as in-progress
        </Typography>
        <Typography
          sx={{
            background: "#C8E4C0",
            color: "#6A9F69",
            fontSize: "15px",
            padding: isMobile ? "12px" : "20px",
            borderRadius: "8px",
          }}
        >
          Mark as resolved
        </Typography>
      </Box>

      <Box mt={4}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Reuben Hale support ticket
          </Typography>
          <Typography mt={1} fontSize={"12px"}>
            This support ticket was logged by Reuben Hale. Please review the
            details and take necessary action to resolve the issue.
          </Typography>
        </CommonCard>
      </Box>

      <Box mt={3}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Client information
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={Issue_overview} />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12, xs: 12, lg: 6, xl: 6 }}>
            <Box>
              <CommonCard>
                <CommonNoteCard
                  title="Issue description"
                  rows={1}
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
                />
              </CommonCard>
            </Box>
            <Box mt={2}>
              <CommonAttachmentCard />
            </Box>
          </Grid2>
        </Grid2>

        <Box mt={3}>
          <CommonCard>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                Messaging
              </Typography>
              <CommonButton
                sx={{ width: isMobile ? "150px" : "165px" }}
                buttonText="New message"
                type="submit"
                onClick={() => setMessage(!message)}
              />
            </Box>
          </CommonCard>
        </Box>
        <Box mt={3}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ md: 4, lg: 4, xl: 4, sm: 12, xs: 12 }}>
              {data.map((ele, index) => {
                return (
                  <Box key={index} mt={3}>
                    <CommonGetHelpCard
                      title={ele.title}
                      description={ele.description}
                      DateAndTime={ele.dateAndTime}
                      onClick={() => setSelectedMail(index)}
                      selectedMail={index === selectedMail}
                    />
                  </Box>
                );
              })}
            </Grid2>
            <Grid2 size={{ md: 8, lg: 8, xl: 8, sm: 12, xs: 12 }}>
              {message === false ? (
                <Box>
                  <Box>
                    <CommonCard sx={{ padding: "16px 22px", display: "flex" }}>
                      <Typography fontSize={"16px"} fontWeight={500}>
                        SUBJECT:
                      </Typography>
                      <Typography fontSize={"16px"}>
                        Zorbee Support #12345
                      </Typography>
                    </CommonCard>
                  </Box>
                  <Box mt={3}>
                    <CommonCard>
                      <Typography>Hi Reuben,</Typography>
                      <Typography mt={2}>
                        Thanks for reaching out about the login issue. Weve
                        shared the details with our team, and theyre currently
                        working on replicating the problem to identify the
                        cause.
                      </Typography>
                      <Typography mt={2}>
                        Ill keep you updated as soon as we have more insights or
                        a resolution. In the meantime if anything changes on
                        your end or you experience any new issues, please let me
                        know.
                      </Typography>
                      <Typography mt={2}>Best,</Typography>
                      <Typography>Kat</Typography>
                    </CommonCard>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box>
                    <CommonCard sx={{ padding: "16px 22px", display: "flex" }}>
                      <Typography fontSize={"16px"} fontWeight={500}>
                        Recipient:
                      </Typography>
                      <Typography fontSize={"16px"}>
                        Reubenhale@shoorah.io
                      </Typography>
                    </CommonCard>
                  </Box>
                  <Box mt={3}>
                    <CommonCard>
                      <Box sx={{ display: "flex" }} mb={4}>
                        <Typography fontSize={"16px"} fontWeight={500}>
                          SUBJECT:
                        </Typography>
                        <Typography fontSize={"16px"}>
                          Zorbee Support #12345
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <CommonIconText
                        title="File name placeholder "
                        icon="/assets/svg/carers/profile/Attachment.svg"
                        endIcon={true}
                      />
                      <Typography mt={4}>Hi Reuben,</Typography>
                      <Typography mt={2}>
                        Thanks for reaching out about the login issue. Weve
                        shared the details with our team, and theyre currently
                        working on replicating the problem to identify the
                        cause.
                      </Typography>
                      <Typography mt={2}>
                        Ill keep you updated as soon as we have more insights or
                        a resolution. In the meantime if anything changes on
                        your end or you experience any new issues, please let me
                        know.
                      </Typography>
                      <Typography mt={2}>Best,</Typography>
                      <Typography>Kat</Typography>
                    </CommonCard>
                  </Box>
                  <Box mt={2}>
                    <CommonCard
                      sx={{
                        padding: "16px 22px",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Box
                        sx={{
                          padding: "13px",
                          border: "2px solid lightgray",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                        }}
                      >
                        <img
                          src="/assets/svg/carers/profile/Attachment.svg"
                          alt="Attachment"
                        />
                      </Box>
                      <Box
                        sx={{
                          padding: "13px",
                          border: "2px solid lightgray",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                          margin: "0px 19px",
                        }}
                      >
                        <img
                          src="/assets/svg/carers/profile/bin.svg"
                          alt="bin"
                        />
                      </Box>
                      <Box
                        sx={{
                          padding: "13px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                          background: theme.palette.primary.main,
                        }}
                      >
                        <img
                          src="/assets/svg/carers/profile/send.svg"
                          alt="send"
                        />
                      </Box>
                    </CommonCard>
                  </Box>
                </Box>
              )}
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
};

export default ClinicalProfile;
