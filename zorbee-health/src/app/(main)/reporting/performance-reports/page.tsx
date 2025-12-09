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
import DownloadDocumentButton from "@/components/DownloadDocumentBtn";

const options = [
  { label: "Data1", value: "Data1" },
  { label: "Data2", value: "Data2" },
  { label: "Data3", value: "Data3" },
];

interface SelectSectionProps {
  value: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  onChange: (value: string | number | null) => void;
  heading: string;
  description: string;
}

const PerformanceReports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const [permission, setPermission] = useState<string | number | null>("");

  const DownloadButtons = () => {
    const stackDirection = isLaptop || isMobile ? "column" : "row";
    const alignItems = isLaptop ? "flex-start" : "center";
    const stackWidth = isLaptop ? "100%" : "auto";
    return (
      <Stack
        direction={stackDirection}
        alignItems={alignItems}
        spacing={2}
        width={stackWidth}
        mt={2}
      >
        <DownloadDocumentButton title="Download PDF" />
        <DownloadDocumentButton title="Download CSV" />
      </Stack>
    );
  };

  const SelectSection = ({
    value,
    options,
    onChange,
    heading,
    description,
  }: SelectSectionProps) => {
    return (
      <CommonCard>
        <Typography variant="h6" fontWeight={500}>
          {heading}
        </Typography>
        <Typography variant="caption" fontWeight={400}>
          {description}
        </Typography>
        <Box mt={3}>
          <CommonSelect
            placeholder="Please Select data point"
            value={value}
            onChange={onChange}
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
        <DownloadButtons />
      </CommonCard>
    );
  };

  return (
    <Box>
      <CommonCard>
        <Stack
          direction={isTablet ? "column" : "row"}
          alignItems={isTablet ? "flex-start" : "center"}
          justifyContent={"space-between"}
        >
          <Box width={isTablet ? "auto" : "700px"}>
            <Typography variant="h6" fontWeight={500}>
              Complete Zorbee report
            </Typography>
            <Typography variant="caption" fontWeight={400}>
              Gain a complete understanding of Zorbee performance by downloading
              the extensive overview report. This report consolidates all
              dashboard data points, offering a thorough and detailed summary of
              vital metrics.
            </Typography>
          </Box>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            mt={isTablet ? 2 : 0}
            width={isMobile ? "100%" : "auto"}
          >
            <DownloadDocumentButton title="Download PDF" />
            <DownloadDocumentButton title="Download CSV" />
          </Stack>
        </Stack>
      </CommonCard>

      <Box mt={4}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box>
              <SelectSection
                heading={"User demographic"}
                description={
                  "Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                }
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
              />
            </Box>
            <Box mt={4}>
              <SelectSection
                heading={"Clinician demographic"}
                description={
                  "Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                }
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
              />
            </Box>
            <Box mt={4}>
              <SelectSection
                heading={"Booking analytics"}
                description={
                  "Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                }
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
              />
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, lg: 6, xl: 6, sm: 12, xs: 12 }}>
            <Box>
              <SelectSection
                heading={"Carer demographic"}
                description={
                  "Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                }
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
              />
            </Box>
            <Box mt={4}>
              <SelectSection
                heading={"Provider analytics"}
                description={
                  "Choose the data points you’d like to capture (or select all) and download them as a PDF or CSV."
                }
                value={permission}
                onChange={(value: string | number | null) =>
                  setPermission(value)
                }
                options={options}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default PerformanceReports;
