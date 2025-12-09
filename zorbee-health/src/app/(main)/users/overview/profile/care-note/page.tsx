"use client";
import React from "react";
import Image from "next/image";
import { Box, Grid2, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//relative path imports
import KeyValueDetails from "@/components/Cards/KeyValueDetails";
import CommonNoteCard from "@/components/CommonNoteCard";
import CommonCard from "@/components/Cards/Common";

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
    label: "Gender",
    value: "Male",
  },
  {
    label: "Address",
    value: "Hertfordshire",
  },
];

const note_details = [
  {
    label: "Carer",
    value: "Reuben Hale",
  },
  {
    label: "Date of visit",
    value: "08 January 2025",
  },
];

const card_data = [
  {
    title: "Tasks Completed",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
  {
    title: "Any issues or challenges",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
  {
    title: "Vital signs",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
  {
    title: "Follow-up actions",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
  {
    title: "Family or guardian updates",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  },
];

const card_datas = [
  {
    title: "Observations",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Health observations",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Diet and hydration",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Updates to care plan",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Special requests or notes from the client",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

const StyledBox = styled(Box)(({}) => ({
  border: "1px solid #E2E6EB",
  padding: "10px 20px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));
const CareNote = () => {
  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          Reuben Hale | Care note 3
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          You are currently previewing a care note. Please find the details
          below.
        </Typography>
      </CommonCard>

      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Client information
              </Typography>

              <Box mt={4}>
                <KeyValueDetails items={client_information} />
              </Box>
            </CommonCard>
          </Box>

          {card_data.map((item, index) => (
            <Box mt={4} key={index}>
              <CommonCard>
                <CommonNoteCard
                  title={item.title}
                  rows={1}
                  value={item.value}
                />
              </CommonCard>
            </Box>
          ))}
        </Grid2>
        <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
          <Box mt={4}>
            <CommonCard>
              <Typography variant="h6" fontWeight={500}>
                Note details
              </Typography>

              <Box mt={4}>
                <KeyValueDetails items={note_details} />
              </Box>
              <Box mt={3}>
                <Typography variant="caption" fontWeight={400}>
                  Carers signature
                </Typography>
                <StyledBox mt={2}>
                  <Image
                    src={"/assets/svg/carers/verifications/signature.svg"}
                    height={40}
                    width={100}
                    alt="signature"
                  />
                </StyledBox>
                <Typography mt={3} variant="caption" fontWeight={400}>
                  Date of signature: 7th January 2025
                </Typography>
              </Box>
            </CommonCard>
          </Box>

          {card_datas.map((item, index) => (
            <Box mt={4} key={index}>
              <CommonCard>
                <CommonNoteCard
                  title={item.title}
                  rows={1}
                  value={item.value}
                />
              </CommonCard>
            </Box>
          ))}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default CareNote;
