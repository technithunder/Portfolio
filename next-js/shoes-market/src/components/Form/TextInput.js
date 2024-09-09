import React from "react";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import styles from "@/styles/components/Form.module.scss";

const Input = React.forwardRef(
  (
    {
      id,
      name,
      label,
      subLabel,
      hint,
      placeholder,
      hasError,
      helpText,
      onChange,
      value,
      onClick,
      onBlur,
      endAdornment,
      startAdornment,
      type,
      inputProps = {},
      multiline,
      rows,
      readOnly,
      defaultValue,
      disabled,
      fullWidth,
      ...other
    },
    ref
  ) => {
    return (
      <FormControl variant="standard" margin="normal" error={hasError} sx={{ width: "100%" }} {...other}>
        {label && (
          <FormLabel sx={{ fontSize: 16, fontWeight: 500 }} color="black">
            {label}
          </FormLabel>
        )}
        {subLabel && (
          <FormLabel sx={{ fontSize: 12 }} color="black">
            {subLabel}
          </FormLabel>
        )}
        <InputBase
          type={type}
          className={styles.styledInput}
          id={id}
          name={name}
          defaultValue={defaultValue}
          inputRef={ref}
          placeholder={placeholder}
          fullWidth
          value={value}
          onChange={onChange}
          multiline={multiline}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          onBlur={onBlur}
          error={hasError}
          startAdornment={
            startAdornment && (
              <InputAdornment position="start" sx={{ position: "absolute", left: 8, zIndex: 1 }}>
                {startAdornment}
              </InputAdornment>
            )
          }
          endAdornment={
            endAdornment && (
              <InputAdornment position="end" sx={{ position: "absolute", right: 8 }}>
                {endAdornment}
              </InputAdornment>
            )
          }
          {...inputProps}
        />
        {hint && (
          <Typography variant="caption" color="textSecondary">
            {hint}
          </Typography>
        )}
        {hasError && <FormHelperText>{helpText}</FormHelperText>}
      </FormControl>
    );
  }
);

Input.displayName = "TextInput";

export default Input;
