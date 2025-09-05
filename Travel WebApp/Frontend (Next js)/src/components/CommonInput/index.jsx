'use client'
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const CommonInputField = ({ name, control, sx, height, defaultValue, placeholder, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...rest}
                    fullWidth
                    placeholder={placeholder}
                    sx={{
                        height,
                        '& .MuiInputBase-root': {
                            height: '100%',
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '0px 14px',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000000',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                        },
                        ...sx
                    }}
                    error={!!error}
                // helperText={error?.message}
                />
            )}
        />
    );
};

export default CommonInputField;
