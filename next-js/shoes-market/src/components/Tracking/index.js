import React, { useMemo } from "react";
import moment from "moment";
import { STATUSES } from "./statuses";
import take from "lodash/take";
import { Step, StepLabel, Stepper } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const Tracking = ({ time }) => {
  const trackingData = useMemo(() => {
    const now = moment.utc();
    const duration = now.diff(time, "hour");
    const statusData = JSON.parse(JSON.stringify(STATUSES));
    if (duration > 12) {
      return take(statusData, Math.floor(duration / 12));
    } else {
      return take(statusData, 1);
    }
  }, [time]);

  return (
    <div>
      <Stepper orientation="vertical" activeStep={trackingData?.length - 2}>
        {trackingData?.map((item, index) => {
          return (
            <Step key={index}>
              <StepLabel
                icon={
                  index === trackingData?.length - 1 ? (
                    <RadioButtonUncheckedIcon />
                  ) : (
                    <RadioButtonCheckedIcon />
                  )
                }
              >
                {item}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

export default Tracking;
