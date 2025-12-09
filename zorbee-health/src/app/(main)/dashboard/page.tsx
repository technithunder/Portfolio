"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Grid2";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//relative path imports
import {
  cardConfigs,
  data,
  filterOptions,
  pending_verifications,
  status,
  time_period_data,
} from "@/constants/dashboardData";
import CommonSelect from "@/components/CommonSelect";
import CommonChart from "@/components/CommonChart";

interface ActiveProps {
  isBgColor?: string;
}

interface TimePeriodsProps {
  isSelected: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const StyledCard = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "22px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  backgroundColor: theme.palette.common.white,
}));

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBgColor",
})<ActiveProps>(({ isBgColor }) => ({
  height: "60px",
  width: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: isBgColor,
}));

const StyledVerificationCard = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "22px",
  backgroundColor: theme.palette.common.white,
  minHeight: "220px",
}));

const BorderLinearProgress = styled(LinearProgress)(({}) => ({
  height: "10px",
  borderRadius: "5px",
  marginTop: "5px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#ECF2FB",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}));

const StyledTimePeriodBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<TimePeriodsProps>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.common.white,
  height: "50px",
  minWidth: "80px",
  padding: "0 10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    minWidth: "70px",
    height: "45px",
    margin: "10px !important",
  },
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | number | null>
  >({});

  console.log(selectedFilters);

  const handleFilterChange = (title: string, value: string | number | null) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const ChartLegend: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    return (
      <Box sx={{ mt: isSmallDevice ? 0 : 2 }}>
        <Grid2 container spacing={1}>
          {data.map((entry, index) => (
            <Grid2 size={{ md: 6 }} key={`legend-${index}`}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: entry.color,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant={"body2"}
                    component="span"
                    color="common.black"
                  >
                    {entry.name}:
                  </Typography>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    {entry.value}%
                  </Typography>
                </Stack>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    );
  };

  return (
    <Box>
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, sm: 8 }}>
          <Typography
            sx={{ fontSize: { xs: "20px", sm: "24px", md: "30px" } }}
            fontWeight={500}
            color="common.black"
          >
            Welcome back, Kat!
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            You have{" "}
            <Typography
              sx={{ cursor: "pointer" }}
              variant="caption"
              fontWeight={500}
              color="#518ADD"
            >
              102
            </Typography>{" "}
            pending carer verifications to review today.
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 4 }}
          sx={{
            textAlign: {
              sm: "right",
              md: "right",
              lg: "right",
              xl: "right",
              xs: "left",
            },
          }}
        >
          <Typography
            component="p"
            variant="caption"
            fontWeight={400}
            color="common.black"
          >
            Last login
          </Typography>
          <Typography
            component="p"
            variant="caption"
            fontWeight={500}
            color="common.black"
          >
            Today at 9:42 AM
          </Typography>
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <Grid2 container spacing={isSmallDevice ? 2 : 6}>
          {data.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <StyledCard>
                  <StyledBox isBgColor={"#F9D835"}>
                    <Image
                      src={`/assets/svg/dashboard/${ele.icon}.svg`}
                      alt={ele.icon}
                      height={30}
                      width={30}
                    />
                  </StyledBox>
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      {ele.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                      {ele.desc}
                    </Typography>
                  </Box>
                </StyledCard>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      <Box mt={4}>
        <Grid2 container spacing={isSmallDevice ? 2 : 6}>
          {status.map((ele, index) => {
            return (
              <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
                <StyledCard justifyContent={"space-between"}>
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      {ele.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                      {ele.count}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#6A9F69"
                      fontWeight={400}
                    >
                      {ele.days}
                    </Typography>
                  </Box>
                  <StyledBox isBgColor={"#E2E6EB"}>
                    <Image
                      src={`/assets/svg/dashboard/${ele.icon}.svg`}
                      alt={ele.icon}
                      height={30}
                      width={30}
                    />
                  </StyledBox>
                </StyledCard>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" fontWeight={500}>
          Pending verifications
        </Typography>

        <Box mt={4}>
          <Grid2 container columnSpacing={isTablet ? 7 : 14} rowSpacing={4}>
            {pending_verifications.map((ele, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <StyledVerificationCard>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {ele.title}
                        </Typography>
                        <Typography variant="caption" fontWeight={400}>
                          {ele.review_status} review
                        </Typography>
                      </Box>
                      <StyledBox isBgColor={"#E2E6EB"}>
                        <Image
                          src={`/assets/svg/dashboard/${ele.icon}.svg`}
                          alt={ele.icon}
                          height={30}
                          width={30}
                        />
                      </StyledBox>
                    </Stack>
                    <Box mt={2}>
                      {ele.total_pending && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total pending
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_pending}
                          </Typography>
                        </Stack>
                      )}
                      {ele.urgent_review && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Stack direction={"row"} spacing={1}>
                            <InfoOutlinedIcon
                              sx={{
                                fontSize: "16px",
                                color: "#9C3C3C",
                              }}
                            />
                            <Typography
                              variant="caption"
                              fontWeight={400}
                              color="#9C3C3C"
                            >
                              Urgent review
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            fontWeight={500}
                            color="#9C3C3C"
                          >
                            {ele.urgent_review}
                          </Typography>
                        </Stack>
                      )}
                      {ele.total_verified && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total verfied
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_verified}
                          </Typography>
                        </Stack>
                      )}
                      {ele.total_failed && (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Typography variant="caption" fontWeight={400}>
                            Total failed
                          </Typography>
                          <Typography variant="h6" fontWeight={500}>
                            {ele.total_failed}
                          </Typography>
                        </Stack>
                      )}
                      {ele.process_rate && (
                        <Box mt={1}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            width={"100%"}
                          >
                            <Typography variant="caption" fontWeight={400}>
                              Processing rate
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                              {ele.process_rate} %
                            </Typography>
                          </Stack>
                          <BorderLinearProgress
                            variant="determinate"
                            value={ele.process_rate}
                          />
                        </Box>
                      )}
                    </Box>
                  </StyledVerificationCard>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </Box>

      <Box mt={4}>
        <Stack
          direction={isSmallDevice ? "column" : "row"}
          alignItems="center"
          spacing={isSmallDevice ? 0 : 4}
          flexWrap="wrap"
        >
          <Typography variant="h6" fontWeight={500}>
            Time period
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent={isSmallDevice ? "center" : "flex-start"}
          >
            {time_period_data.map((ele, index) => (
              <StyledTimePeriodBox
                key={index}
                onClick={() => setSelectedTimePeriod(index)}
                isSelected={selectedTimePeriod === index}
              >
                <Typography
                  variant="body2"
                  fontWeight={selectedTimePeriod === index ? 500 : 400}
                >
                  {ele}
                </Typography>
              </StyledTimePeriodBox>
            ))}
          </Stack>
        </Stack>

        <Box mt={4}>
          <Grid2 container columnSpacing={2} rowSpacing={4}>
            {cardConfigs.map((config, index) => {
              const options = filterOptions[config.filter] || [];
              return (
                <Grid2
                  key={index}
                  size={{ md: 6, sm: 6, xs: 12, lg: 4, xl: 4 }}
                >
                  <StyledVerificationCard>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography variant="h6" fontWeight={500}>
                        {config.title}
                      </Typography>
                      <CommonSelect
                        placeholder={config.filter}
                        value={selectedFilters[config.title] || ""}
                        onChange={(value) =>
                          handleFilterChange(config.title, value)
                        }
                        options={options}
                        sx={{
                          width: config.filter === "Booking Status" ? 140 : 120,
                          height: "30px",
                        }}
                      />
                    </Stack>

                    <CommonChart
                      data={config.data}
                      title={config.chartTitle}
                      subtitle={config.chartSubtitle}
                    />

                    <ChartLegend data={config.data} />
                  </StyledVerificationCard>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
