import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import Image from 'next/image';

const steps = [
    { label: 'Photo', icon: <CameraAltOutlinedIcon /> },
    { label: 'Passport', icon: <DocumentScannerOutlinedIcon /> },
    { label: 'Details', icon: <FolderSharedOutlinedIcon /> },
    // { label: 'Checkout', icon: <CheckCircleOutlineIcon /> },
];

const StyledWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: "56px"
})
const StyledWrapper2 = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
    alignItems: 'center',
    transition: 'color 0.3s',
    position: "relative"
})
const StyledWrapper3 = styled(Box)({
    borderLeft: '2px solid',
    borderColor: 'divider',
    height: 80,
    margin: "16px 0px"
})

const Stepper = ({ activeStep = 0 }) => {
    return (
        <StyledWrapper>
            {steps.map((step, index) => {
                const isActive = index === activeStep;
                let color = 'text.disabled';
                if (index < activeStep) color = '#FF0000';
                else if (index === activeStep) color = '#FF0000';

                return (
                    <React.Fragment key={step.label}>
                        <StyledWrapper2>
                            {React.cloneElement(step.icon, {
                                sx: { fontSize: 26, mb: 1, color },
                            })}
                            <Typography variant="body2" sx={{ color }}>
                                {step.label}
                            </Typography>
                            {isActive && (
                                <Image src={"/assets/svg/stepper_arrow.svg"} height={17} width={17} style={{ position: "absolute", right: "0px", top: "3px" }} alt='arrow' />
                            )}
                        </StyledWrapper2>
                        {index < steps.length - 1 && (
                            <StyledWrapper3 sx={{ borderColor: index < activeStep ? "#FF0000" : "text.disabled", }} />
                        )}
                    </React.Fragment>
                );
            })}

        </StyledWrapper>
    );
};

export default Stepper;
