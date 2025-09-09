"use client";
import React, { useState } from "react";
import Layout from "@/Layout";
import {
    Typography,
    Box,
    Button,
    Breadcrumbs,
    Link,
    Grid,
    Divider,
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommonCard from "@/components/CommonCard";
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

const AddStaff = () => {
    const staffMember = {
        name: "Linda Blair",
        username: "@linda_blair321",
        userId: "ID-011221",
        email: "lindablair@gmail.com",
        phone: "050 414 8778",
        address: "1833 Bel Meadow Drive, Fontana, California 92335, USA",
        lastTransaction: "12 December 2022",
        totalOrders: 34,
        discount: "10 %",
        queries: 3,
    };
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        dateOfBirth: "",
        maritalStatus: "",
        gender: "",
        nationality: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
    });

   const departments = [
  { value: 'hr', label: 'Human Resources' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Customer Support' },
];
    const employeeTypes = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'intern', label: 'Intern' },
]
   const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];
const discountOptions = [
  { value: '0', label: 'No Discount' },
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
  { value: '30', label: '30%' },
];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Layout>
            <CommonCard>
                <Box sx={{ paddingX: 0 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 500, fontSize: "1.5rem", mb: 1 }}
                    >
                        Dealer
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="hover"
                                color="primary"
                                href="/dashboard"
                                sx={{ fontSize: "0.875rem" }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                underline="hover"
                                color="black"
                                href="/dealers"
                                sx={{ fontSize: "0.875rem" }}
                            >
                                Dealer
                            </Link>
                            <Typography color="textPrimary" sx={{ fontSize: "0.875rem" }}>
                                {/* {staffMember.name} */}
                                Add New Dealer
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                </Box>
                <Box sx={{ border: "1px solid lightgray", p: 3, borderRadius: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <PersonOutlinedIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="h6" fontWeight={500}>
                            Personal Information
                        </Typography>
                        <BusinessCenterOutlinedIcon sx={{ mr: 1, color: "#00ABDC", ml:3 }} />
                        <Typography variant="h6" color="#00ABDC" fontWeight={500}>
                            Professional Information
                        </Typography>
                    </Box>

                    <Divider />

                    <Grid container spacing={3} mt={3}>
                        {/* First Name and Last Name */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="employeeID"
                                label="Employee ID"
                                variant="outlined"
                                value={formData.employeeID}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="userName"
                                label="User Name"
                                variant="outlined"
                                value={formData.userName}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                name="selectEmployeeType"
                                label="Select Employee Type"
                                variant="outlined"
                                value={formData.selectEmployeeType}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                                SelectProps={{
                                    IconComponent: KeyboardArrowDownIcon,
                                }}
                            >
                                {employeeTypes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 12 , md:6 }}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email Address"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        {/* Gender and Nationality */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                name="department"
                                label="Select Department"
                                variant="outlined"
                                value={formData.department}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                                SelectProps={{
                                    IconComponent: KeyboardArrowDownIcon,
                                }}
                            >
                                {departments.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                         <Grid item size={{ xs: 12 , md:6 }}>
                            <TextField
                                fullWidth
                                name="designation"
                                label="Enter Designation"
                                variant="outlined"
                                value={formData.designation}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                name="workingDays"
                                label="Select Working Days"
                                variant="outlined"
                                value={formData.workingDays}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                                SelectProps={{
                                    IconComponent: KeyboardArrowDownIcon,
                                }}
                            >
                                {days.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                         <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="selecJoiningDate"
                                label="Select Joining Date"
                                variant="outlined"
                                value={formData.selecJoiningDate}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Address */}
                        <Grid item size={{ xs: 12 }}>
                             <TextField
                                select
                                fullWidth
                                name="discountOptions"
                                label="Select discount"
                                variant="outlined"
                                value={formData.discountOptions}
                                onChange={handleChange}
                                size="medium"
                                sx={{ mb: 2 }}
                                SelectProps={{
                                    IconComponent: KeyboardArrowDownIcon,
                                }}
                            >
                                {discountOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                mr: 2,
                                px: 3,
                                py: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontSize: "0.9rem",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                px: 4,
                                py: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                bgcolor: "#00B0FF",
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </CommonCard>
        </Layout>
    );
};

export default AddStaff;
