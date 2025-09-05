"use client"
import React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'


const StyledButton = styled(Button)(({ theme, ownerState }) => {
    const { variant } = ownerState;

    if (variant === 'outlined') {
        return {
            position: 'relative',
            fontWeight: 500,
            fontSize: '1.275rem',
            padding: '10px 24px',
            textTransform: 'none',
            boxShadow: 'none',
            zIndex: 1,
            overflow: 'hidden',
            borderRadius: '10px',

            // Create gradient border using a pseudo-element instead
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            background: 'transparent',

            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 100%)',
                WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
            },
            backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',

            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 95%)',
                color: "white"
            },
        };
    }



    if (variant === 'text') {
        return {
            background: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 500,
            fontSize: '1.275rem',
            padding: '10px 24px',
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#fff5ee',
            },
        };
    }

    return {
        backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 100%)',
        color: '#ffffff',
        fontWeight: 500,
        fontSize: '1.275rem',
        padding: '10px 24px',
        borderRadius: '10px',
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 95%)',
            boxShadow: '0px 4px 10px rgba(255, 0, 0, 0.25)',
        },
        '&:disabled': {
            opacity: 0.6,
        }
    };
});


const CommonButton = ({
    children,
    variant = "contained",
    loading = false,
    type = "button",
    isDisabled,
    sx = {},
    onClick,
    ...props
}) => {
    return (
        <StyledButton
            ownerState={{ variant }}
            disabled={loading || isDisabled  || props.disabled}
            sx={sx}
            type={type}
            {...props}
            fullWidth
            onClick={onClick}
        >
            {loading ? (
                <CircularProgress
                    size={24}
                    color="inherit"
                />
            ) : (
                children || 'Apply Now'
            )}
        </StyledButton>
    )
}

export default CommonButton