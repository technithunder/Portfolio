import React from "react";
import { Box, Typography } from "@mui/material";
//relative path imports
import CommonCard from "../Cards/Common";
import CommonIconText from "../CommonIconText";

const CommonAttachmentCard = () => {
  return (
    <Box>
      <CommonCard>
        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
          Attachments
        </Typography>
        <CommonIconText
          icon={
            "/assets/svg/carers/profile/Paginate-Filter-Text--Streamline-Ultimate.svg"
          }
          title={"File name placeholder "}
          endIcon={true}
        />
      </CommonCard>
    </Box>
  );
};

export default CommonAttachmentCard;
