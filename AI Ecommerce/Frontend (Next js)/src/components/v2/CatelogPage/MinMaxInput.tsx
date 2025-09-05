import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import React, { useState } from "react";
import styled from "styled-components";

const StyledInput = styled('input')`
  width: 100%;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 0 10px;
  margin-top: 5px;
`;

const MinMaxInput = ({ min = 0, max = 2500, onChange }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue);
    setMinValue(value);
    if (onChange) onChange({ minValue: value, maxValue });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue);
    setMaxValue(value);
    if (onChange) onChange({ minValue, maxValue: value });
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto">

      {/* Min & Max Input Fields */}
      <FlexBox
        alignItems="center"
        display="flex"
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <div style={{width: '40%', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
          <label className="text-sm text-gray-600">Min</label>
          <StyledInput
            type="number"
            value={minValue}
            onChange={handleMinChange}
            min={min}
            max={maxValue}
            className="p-2 border border-gray-300 roundedtext-center"
          />
        </div>

        <Typography className="flex-1" color="text.muted">to</Typography>

        <div style={{width: '40%', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
          <label className="text-sm text-gray-600">Max</label>
          <StyledInput
            type="number"
            value={maxValue}
            onChange={handleMaxChange}
            min={minValue + 1}
            max={max}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </FlexBox>
    </div>
  );
};

export default MinMaxInput;
