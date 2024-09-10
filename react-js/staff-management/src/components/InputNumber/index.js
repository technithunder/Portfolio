import { TextField } from '@mui/material';
import React from 'react';
import InputMask from 'react-input-mask';

const InputNumber = ({
  mask,
  value,
  onBlur,
  onChange,
  helperText,
  error,
  name,
  ...rest
}) => {
  return (
    <InputMask
      mask={mask}
      maskChar=""
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    >
      {() => (
        <TextField
          fullWidth
          name={name}
          helperText={helperText}
          error={error}
          variant="outlined"
          type="tel"
          {...rest}
        />
      )}
    </InputMask>
  );
};

export default InputNumber;
