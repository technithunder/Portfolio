"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonCard from "@/components/Cards/Common";
import ApprovalListItem from "@/components/carers/profile/ApprovalListItem";

const data = [
  {
    icon: "/assets/svg/carers/verifications/hourglass.svg",
    title: "Total awaiting",
    count: "10",
  },
  {
    icon: "/assets/svg/carers/verifications/singleneutral.svg",
    title: "Processing rate",
    count: "65%",
  },
  {
    icon: "/assets/svg/carers/verifications/clock.svg",
    title: "Average wait time",
    count: "24 hours",
  },
  {
    icon: "/assets/svg/carers/verifications/approval.svg",
    title: "Total approved",
    count: "52",
  },
];

const Verifications: React.FC = () => {
  const router = useRouter();
  return (
    <Box>
      <Grid2 container spacing={2}>
        {data.map((ele, index) => {
          return (
            <Grid2 key={index} size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
              <OverviewCard
                path={ele.icon}
                alt={ele.icon}
                title={ele.title}
                count={ele.count}
              />
            </Grid2>
          );
        })}
      </Grid2>

      <Box mt={4}>
        <CommonCard>
          <Typography variant="h6" fontWeight={500}>
            Awaiting verification
          </Typography>
          <Typography variant="caption" fontWeight={400}>
            These are the providers pending verification. You can check their
            verification status, as another admin may have already started the
            process.
          </Typography>
          <Box mt={1}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => {
              return (
                <Box key={index} mt={3}>
                  <ApprovalListItem
                    profilePic={"/assets/images/Rectangle.jpg"}
                    profileName={"Guernsey Cheshire Home"}
                    dateTitle={"Date joined"}
                    date={"5th February 2025"}
                    approvalTitle={"Awaiting verification"}
                    approvalVariant={"default"}
                    onClickMenuBtn={() =>
                      router.push("/providers/verifications/profile")
                    }
                  />
                  <Divider sx={{ mt: 3 }} />
                </Box>
              );
            })}
          </Box>
        </CommonCard>
      </Box>
    </Box>
  );
};

export default Verifications;
