"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//relative path imports
import CommonCard from "@/components/Cards/Common";
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonChip from "@/components/CommonChip";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisitLogsCard from "@/components/Cards/VisitLogsCard";
import RequestCard from "@/components/Cards/Request";
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";

const client_information = [
  {
    label: "Title",
    value: "Mr",
  },
  {
    label: "Name",
    value: "Reuben Hale",
  },
  {
    label: "Date of birth",
    value: "9th January 1960",
  },
  {
    label: "Location",
    value: "Heartfordshire",
  },
];
const carer_information = [
  {
    label: "Title",
    value: "Mr",
  },
  {
    label: "Name",
    value: "Lorri Haines",
  },
  {
    label: "Date of birth",
    value: "9th January 1960",
  },
  {
    label: "Location",
    value: "Heartfordshire",
  },
];

const linked_invoice = [
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

interface VisitChipProps {
  bgColor?: string;
}

const StyledBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const StyledNote = styled(Box)(({}) => ({
  display: "flex",
  backgroundColor: "#ECF2FB",
  border: "1px solid #518ADD",
  borderRadius: "10px",
  gap: 10,
  padding: "10px",
  marginTop: "10px",
}));

const VisitChip = styled(Box)<VisitChipProps>(({ bgColor, borderColor }) => ({
  backgroundColor: bgColor,
  border: `1px solid ${borderColor}`,
  padding: "7px 14px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ActiveServiceAgreement = () => {
  const router = useRouter();
  return (
    <Box>
      <CommonCard>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <Box>
            <Typography variant="h6" fontWeight={500}>
              Active service agreement #04
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              You are currently previewing a service agreement. Please find the
              details below.
            </Typography>
          </Box>
          <DownloadDocumentButton title="Download PDF" />
        </Stack>
      </CommonCard>

      <Box>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Client information
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={client_information} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Agreement datails
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  This displays the agreed terms of the service agreement.
                </Typography>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={500}>
                    Service Type
                  </Typography>
                  <Box mt={2}>
                    <CommonChip title="Oncology support" variant="primary" />
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={500}>
                    Specific assistance needed
                  </Typography>
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {[
                      "Catheter care",
                      "Light Houskeeping",
                      "Administering medication",
                      "Catheter care",
                    ].map((ele, index) => {
                      return (
                        <CommonChip title={ele} variant="primary" key={index} />
                      );
                    })}
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={500}>
                    Driving Required
                  </Typography>
                  <Box mt={2}>
                    <CommonChip title="Yes" variant="primary" />
                  </Box>
                </Box>
                <Box mt={3}>
                  <Typography variant="h6" fontWeight={500}>
                    Prescription collection needed?
                  </Typography>
                  <Box mt={2}>
                    <CommonChip title="Yes" variant="primary" />
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={500}>
                    Schedule and duration
                  </Typography>

                  <Box mt={2}>
                    <Typography>Start date</Typography>
                    <StyledBox>
                      <Typography variant="body1" fontWeight={400}>
                        01 January 2025
                      </Typography>
                    </StyledBox>
                  </Box>
                  <Box mt={2}>
                    <Typography>End date</Typography>
                    <StyledBox>
                      <Typography variant="body1" fontWeight={400}>
                        01 January 2025
                      </Typography>
                    </StyledBox>
                  </Box>
                  <Box mt={2}>
                    <Typography>Frequency</Typography>
                    <StyledBox>
                      <Typography variant="body1" fontWeight={400}>
                        Daily
                      </Typography>
                    </StyledBox>
                  </Box>
                  <Box mt={2}>
                    <Typography>Hours per visit</Typography>
                    <StyledBox>
                      <Typography variant="body1" fontWeight={400}>
                        2 Hours
                      </Typography>
                    </StyledBox>
                  </Box>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Linked invoice
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  This displays the invoice associated with this service
                  agreement.
                </Typography>
                <Box mt={2}>
                  <KeyValueDetails items={linked_invoice} />
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Carer information
                </Typography>

                <Box mt={2}>
                  <KeyValueDetails items={carer_information} />
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={500}>
                      Visit logs
                    </Typography>
                    <Typography variant="caption" fontWeight={400}>
                      These are all the visit logs recorded under this service
                      agreement.
                    </Typography>
                  </Box>
                  <CalendarMonthIcon />
                </Stack>
                <Box mt={3}>
                  <Box mt={2}>
                    <VisitChip
                      maxWidth={"160px"}
                      bgcolor={"#C8E4C0"}
                      borderColor={"#6A9F69"}
                    >
                      <Typography variant="caption" fontWeight={400}>
                        Confirmed visit logs
                      </Typography>
                    </VisitChip>

                    <Box mt={2}>
                      <Grid2 container spacing={2}>
                        {[1, 2, 3].map((ele, index) => {
                          return (
                            <Grid2
                              key={index}
                              size={{ md: 12, sm: 12, lg: 12, xl: 12, xs: 12 }}
                            >
                              <VisitLogsCard
                                title="Visit #03"
                                date="15th January 2025"
                                time="10:30 AM"
                                onClick={() =>
                                  router.push(
                                    "/users/overview/profile/visit-log"
                                  )
                                }
                                sx={{ cursor: "pointer" }}
                              />
                            </Grid2>
                          );
                        })}
                      </Grid2>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <VisitChip
                      maxWidth={"160px"}
                      bgcolor={"#F4A6A6"}
                      borderColor={"#9C3C3C"}
                    >
                      <Typography variant="caption" fontWeight={400}>
                        Confirmed visit logs
                      </Typography>
                    </VisitChip>

                    <Box mt={2}>
                      <Grid2 container spacing={2}>
                        {[1, 2, 3].map((ele, index) => {
                          return (
                            <Grid2
                              key={index}
                              size={{ md: 12, sm: 12, lg: 12, xl: 12, xs: 12 }}
                            >
                              <VisitLogsCard
                                title="Visit #03"
                                date="15th January 2025"
                                time="10:30 AM"
                              />
                            </Grid2>
                          );
                        })}
                      </Grid2>
                    </Box>
                  </Box>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Carer note
                </Typography>
                <Typography variant="caption" component={"p"} fontWeight={500}>
                  These are all of the carer notes logged under this service
                  agreement.
                </Typography>

                <Box mt={2}>
                  {[1, 2, 3].map((ele, index) => {
                    return (
                      <Box
                        key={index}
                        mt={2}
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push("/users/overview/profile/care-note")
                        }
                      >
                        <RequestCard
                          path="/assets/svg/carers/verifications/carers_note.svg"
                          title="Care note 3"
                          subtitle="Carer: Reuben Hale"
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CommonCard>
            </Box>

            <Box mt={4}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Sign off status
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  This indicates whether the client has signed off on the
                  service agreement once it has been completed.
                </Typography>

                <Box mt={2}>
                  <Stack
                    mt={3}
                    direction={"row"}
                    alignItems={"center"}
                    spacing={3}
                  >
                    <CommonChip
                      title="N/A"
                      //   textStyle={{ color: "#6A9F69" }}
                      //   style={{ backgroundColor: "#C8E4C0" }}
                    />
                    <Box>
                      <Typography variant="caption" fontWeight={400}>
                        Date verified
                      </Typography>
                      <Typography
                        component={"p"}
                        variant="caption"
                        fontWeight={500}
                      >
                        5th February 2025 | 19.30PM
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </CommonCard>
            </Box>

            <Box mt={2}>
              <CommonCard>
                <Typography variant="h6" fontWeight={500}>
                  Approval of service agreement
                </Typography>
                <Typography variant="caption" fontWeight={400}>
                  This shows the inital approval from both the client and the
                  clinician.
                </Typography>

                <Box mt={2}>
                  <Typography variant="caption" fontWeight={400}>
                    Client signature
                  </Typography>
                  <StyledBox mt={1}>
                    <Image
                      src={"/assets/svg/carers/verifications/signature.svg"}
                      height={30}
                      width={100}
                      alt="signature"
                    />
                  </StyledBox>
                  <Typography mt={2} variant="caption" fontWeight={400}>
                    Date of signature: 7th January 2025
                  </Typography>
                </Box>

                <Box mt={2}>
                  <StyledNote>
                    <Box>
                      <InfoOutlinedIcon sx={{ color: "#518ADD" }} />
                    </Box>
                    <Typography
                      variant="caption"
                      color="#518ADD"
                      fontWeight={400}
                    >
                      The client acknowledged that they electronically signed
                      this document and understand that it serves as a legal
                      representation of their signature.
                    </Typography>
                  </StyledNote>
                </Box>

                <Box mt={2}>
                  <Typography variant="caption" fontWeight={400}>
                    Carers signature
                  </Typography>
                  <StyledBox mt={1}>
                    <Image
                      src={"/assets/svg/carers/verifications/signature.svg"}
                      height={30}
                      width={100}
                      alt="signature"
                    />
                  </StyledBox>
                  <Typography mt={2} variant="caption" fontWeight={400}>
                    Date of signature: 7th January 2025
                  </Typography>
                </Box>
              </CommonCard>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default ActiveServiceAgreement;
