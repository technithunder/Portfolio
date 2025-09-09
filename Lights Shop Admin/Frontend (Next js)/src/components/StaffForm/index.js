import React, { useEffect, useRef, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

// Material UI Icons
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { createUser, fetchUserById, updateUser } from "@/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import staffSchema from "@/schemas/staffSchema";
import CommonButton from "../CommonButton";
import { genderOptions, maritalStatusOptions } from "@/utils/constant";
import { useDealerFormOptions } from "@/hooks/useNationalityAndStatus";
import CommonInput from "../CommonInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StaffForm = ({ mode = "create", staffId = null }) => {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(staffSchema),
    defaultValues: {
      image: null,
      firstName: "",
      lastName: "",
      earning: "",
      mobileNumber: "",
      email: "",
      dob: "",
      maritalStatus: "",
      gender: "",
      nationality: "",
      role: "staff",
      position: "",
      joiningDate: "",
      age: "",
      status: "",
      department: "",
      qualification: [
        {
          degree: "",
          university: "",
          passingYear: "",
          percentage: "",
        },
      ],
      address: [
        {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      ],
    },
  });

  const {
    nationalityOptions,
    statusOptions,
    loading,
    fetchNationality,
    fetchStatusOptions,
  } = useDealerFormOptions();

  // Dynamic field array for qualification
  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualification",
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "address",
  });

  // Fetch staff data if in update mode
  const fetchStaffData = async () => {
    if (mode === "update" && staffId) {
      try {
        const response = await fetchUserById(staffId);
        const staffData = response?.data?.data;

        if (staffData) {
          const qualification =
            staffData.Qualification && staffData.Qualification.length > 0
              ? staffData.Qualification.map((qual) => ({
                  degree: qual.degree || "",
                  university: qual.university || "",
                  passingYear: qual.passingYear || "",
                  percentage: qual.percentage || "",
                }))
              : [
                  {
                    degree: "",
                    university: "",
                    passingYear: "",
                    percentage: "",
                  },
                ];

          const address =
            staffData.Address && staffData.Address.length > 0
              ? staffData.Address.map((addr) => ({
                  id: addr.id || "",
                  street: addr.street || "",
                  city: addr.city || "",
                  state: addr.state || "",
                  country: addr.country || "",
                  zipCode: addr.zipCode || "",
                }))
              : [
                  {
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: "",
                  },
                ];

          reset({
            ...staffData?.BasicInfo,
            ...staffData?.PersonalInfo,
            ...staffData?.ContactInfo,
            ...staffData?.OtherInfo,
            ...staffData?.BankInfo,
            qualification: qualification,
            address: address,
            image: staffData.PersonalInfo?.profilePic || "",
          });

          // Set image preview if available
          if (staffData.PersonalInfo?.profilePic) {
            setImagePreview(staffData.PersonalInfo.profilePic);
          }
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        toast.error("Failed to load staff data");
      }
    }
  };

  // Add new qualification
  const addQualification = () => {
    append({
      degree: "",
      university: "",
      passingYear: "",
      percentage: "",
    });
  };

  // Remove qualification
  const removeQualification = (index) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.warning("At least one qualification is required");
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageBase64 = null;
      if (data.image instanceof File) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(data.image);
        });
      } else if (typeof data.image === "string") {
        imageBase64 = data.image;
      }

      // Prepare payload as plain object
      const payload = {
        ...data,
        image: imageBase64,
      };

      let res;

      if (mode === "update" && staffId) {
        delete payload["profilePic"];
        delete payload["discount"];
        delete payload["empId"];
        delete payload["id"];
        res = await updateUser(staffId, payload);
      } else {
        res = await createUser(payload);
      }

      const message = res?.data?.message;
      if (message) {
        toast.success(
          mode === "update"
            ? "Staff Updated Successfully"
            : "Staff Created Successfully"
        );
        router.push("/staff");
      } else if (
        res?.response?.status === 400 ||
        res?.data?.status === "fail"
      ) {
        toast.error(res?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save staff data");
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Set the file object to form state
      setValue("image", file, { shouldValidate: true });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onError = (errors) => {
    console.log("Form errors:", errors);
  };

  // useEffect(() => {
  //   console.log("Current form values:", watch());
  //   console.log("Current errors:", errors);
  // }, [watch(), errors]);

  useEffect(() => {
    fetchNationality();
    fetchStatusOptions();
    fetchStaffData();
  }, [mode, staffId]);

  return (
    <Layout>
      {/* Page Title and Breadcrumbs */}
      <CommonCard>
        <Box sx={{ paddingX: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "24px", mb: 1 }}>
            Staff
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                href="/dashboard"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/staff"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Staff
              </Link>
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                {mode === "create" ? "Create Staff" : "Update Staff"}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid lightgray", p: 3, borderRadius: "10px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <BusinessCenterOutlinedIcon
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="h6" fontWeight={500}>
              Professional Information
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Image*
            </Typography>
            <Box
              sx={{
                width: 100,
                height: 100,
                border: "1px dashed #ccc",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
              }}
              onClick={handleProfileImageClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <IconButton size="large">
                  <CameraAltIcon />
                </IconButton>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
                id="upload-profile-pic"
                multiple
              />
            </Box>
            {errors.image && (
              <Typography color="error" variant="caption">
                {errors.image.message}
              </Typography>
            )}
          </Box>

          <Typography fontWeight={800} sx={{ mb: 3 }}>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            {/* First Name and Last Name */}
            {["firstName", "lastName"].map((field) => (
              <Grid item size={{ xs: 12, md: 6 }} key={field}>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CommonInput
                      {...controllerField}
                      fullWidth
                      useBuiltInLabel={true}
                      label={
                        field === "firstName" ? "First Name*" : "Last Name*"
                      }
                      variant="outlined"
                      error={!!errors[field]}
                      helperText={errors[field]?.message}
                    />
                  )}
                />
              </Grid>
            ))}

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Position*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    error={!!errors.position}
                    helperText={errors.position?.message}
                  />
                )}
              />
            </Grid>

            {/* Earning */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="earning"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Earning*"
                    variant="outlined"
                    type="number"
                    useBuiltInLabel={true}
                    error={!!errors.earning}
                    helperText={errors.earning?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography fontWeight={800} sx={{ mt: 3 }}>
            Personal Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* age */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Age*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    type="number"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                )}
              />
            </Grid>

            {/* Date of birth */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date Of Birth*"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);

                          const today = dayjs();
                          const age = today.diff(date, "year");

                          setValue("age", age, { shouldValidate: true });
                        } else {
                          field.onChange(null);
                          setValue("age", "", { shouldValidate: true });
                        }
                      }}
                      shouldDisableDate={(date) => {
                        return date.isAfter(dayjs(), "day");
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dob,
                          helperText: errors.dob?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>

            {/* Joining Date and Marital Status */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Controller
                  name="joiningDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Joining Date*"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors?.joiningDate,
                          helperText: errors?.joiningDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Marital Status*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    error={!!errors.maritalStatus}
                    helperText={errors.maritalStatus?.message}
                  >
                    {maritalStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CommonInput>
                )}
              />
            </Grid>

            {/* Gender and Nationality */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Gender*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CommonInput>
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Nationality*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: loading?.status ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                      ) : null,
                    }}
                    disabled={loading?.status}
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  >
                    {loading?.status ? (
                      <MenuItem disabled>Loading nationalities...</MenuItem>
                    ) : nationalityOptions?.length > 0 ? (
                      nationalityOptions?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </CommonInput>
                )}
              />
            </Grid>
          </Grid>

          {/* Dynamic Qualification Information Section */}
          <Box sx={{ mt: 4 }}>
            <Typography fontWeight={800} sx={{ mb: 3 }}>
              Qualification Information
            </Typography>

            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 3,
                  mb: 3,
                  position: "relative",
                  backgroundColor: "#fafafa",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Qualification {index + 1}
                  </Typography>
                  {fields.length > 1 && (
                    <IconButton
                      onClick={() => removeQualification(index)}
                      color="error"
                      size="small"
                      sx={{
                        border: "1px solid #f44336",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#ffebee",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`qualification.${index}.degree`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Degree*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.qualification?.[index]?.degree}
                          helperText={
                            errors.qualification?.[index]?.degree?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`qualification.${index}.university`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="University*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.qualification?.[index]?.university}
                          helperText={
                            errors.qualification?.[index]?.university?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`qualification.${index}.passingYear`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Passing Year*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          type="number"
                          error={!!errors.qualification?.[index]?.passingYear}
                          helperText={
                            errors.qualification?.[index]?.passingYear?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`qualification.${index}.percentage`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Percentage*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          type="number"
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                          error={!!errors.qualification?.[index]?.percentage}
                          helperText={
                            errors.qualification?.[index]?.percentage?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            {/* Add Qualification Button at Bottom */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addQualification}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  borderStyle: "dashed",
                  borderColor: "#00B0FF",
                  color: "#00B0FF",
                  "&:hover": {
                    borderColor: "#0091EA",
                    backgroundColor: "#E3F2FD",
                  },
                }}
              >
                Add Another Qualification
              </Button>
            </Box>
          </Box>

          {/* Dynamic Address Information Section */}
          <Box sx={{ mt: 4 }}>
            <Typography fontWeight={800} sx={{ mb: 3 }}>
              Address Information
            </Typography>

            {addressFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 3,
                  mb: 3,
                  position: "relative",
                  backgroundColor: "#fafafa",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Address {index + 1}
                  </Typography>
                  {addressFields.length > 1 && (
                    <IconButton
                      onClick={() => removeAddress(index)}
                      color="error"
                      size="small"
                      sx={{
                        border: "1px solid #f44336",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#ffebee",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={3}>
                  {/* Street Address */}
                  <Grid item size={{ xs: 12 }}>
                    <Controller
                      name={`address.${index}.street`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Street*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.address?.[index]?.street}
                          helperText={errors.address?.[index]?.street?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* City */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`address.${index}.city`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="City*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.address?.[index]?.city}
                          helperText={errors.address?.[index]?.city?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* State */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`address.${index}.state`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="State*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.address?.[index]?.state}
                          helperText={errors.address?.[index]?.state?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Country */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`address.${index}.country`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Country*"
                          variant="outlined"
                          useBuiltInLabel={true}
                          error={!!errors.address?.[index]?.country}
                          helperText={errors.address?.[index]?.country?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Zip Code */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`address.${index}.zipCode`}
                      control={control}
                      render={({ field }) => (
                        <CommonInput
                          {...field}
                          fullWidth
                          label="Zip Code*"
                          variant="outlined"
                          type="number"
                          useBuiltInLabel={true}
                          error={!!errors.address?.[index]?.zipCode}
                          helperText={errors.address?.[index]?.zipCode?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            {/* Add Address Button at Bottom */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  appendAddress({
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: "",
                  })
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  borderStyle: "dashed",
                  borderColor: "#00B0FF",
                  color: "#00B0FF",
                  "&:hover": {
                    borderColor: "#0091EA",
                    backgroundColor: "#E3F2FD",
                  },
                }}
              >
                Add Another Address
              </Button>
            </Box>
          </Box>

          <Typography fontWeight={800} sx={{ mt: 3 }}>
            Contact Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Mobile Number*/}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mobile Number*"
                    variant="outlined"
                    size="medium"
                    onChange={(e) => {
                      field?.onChange(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                )}
              />
              {/* <FormControl fullWidth error={!!errors.mobileNumber}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      country={"in"}
                      value={field.value}
                      onChange={(phone, countryData) => {
                        field.onChange(phone);
                        setSelectedCountry(countryData?.countryCode);
                      }}
                      containerStyle={phoneInputStyles.container}
                      inputStyle={phoneInputStyles.inputStyle}
                      buttonStyle={phoneInputStyles.buttonStyle}
                      enableSearch={false}
                      searchPlaceholder="Search country..."
                      placeholder="Enter phone number"
                      disableSearchIcon={false}
                      searchNotFound="No country found"
                      autoFormat={true}
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <FormHelperText error>
                    {errors.mobileNumber.message}
                  </FormHelperText>
                )}
              </FormControl> */}
            </Grid>

            {/* Email */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Email Address*"
                    variant="outlined"
                    type="email"
                    useBuiltInLabel={true}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography fontWeight={800} sx={{ mt: 3 }}>
            Bank Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Pan Card */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="panCardNumber"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Pan Card Number"
                    variant="outlined"
                    useBuiltInLabel={true}
                    error={!!errors.panCardNumber}
                    helperText={errors.panCardNumber?.message}
                  />
                )}
              />
            </Grid>
            {/* Bank Name*/}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Bank Name"
                    variant="outlined"
                    useBuiltInLabel={true}
                    error={!!errors.bankName}
                    helperText={errors?.bankName}
                  />
                )}
              />
            </Grid>

            {/* Account Number */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Account Number"
                    variant="outlined"
                    type="number"
                    useBuiltInLabel={true}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Branch Name */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="bankBranchName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Branch Name"
                    variant="outlined"
                    useBuiltInLabel={true}
                    error={!!errors.bankBranchName}
                    helperText={errors.bankBranchName?.message}
                  />
                )}
              />
            </Grid>

            {/* IFSC Code */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="ifscCode"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="IFSC Code"
                    variant="outlined"
                    useBuiltInLabel={true}
                    error={!!errors.ifscCode}
                    helperText={errors.ifscCode?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography fontWeight={800} sx={{ mt: 3 }}>
            Other Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Status*"
                    variant="outlined"
                    size="medium"
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    InputProps={{
                      endAdornment: loading?.status ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                      ) : null,
                    }}
                    disabled={loading?.status}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {loading?.status ? (
                      <MenuItem disabled>Loading Status...</MenuItem>
                    ) : statusOptions?.length > 0 ? (
                      statusOptions?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Department*"
                    variant="outlined"
                    size="medium"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <CommonButton
              text="Cancel"
              variant="outlined"
              sx={{
                px: 4,
                py: 1,
                textTransform: "none",
                fontSize: "16px",
              }}
              onClick={() => router.push("/staff")}
            >
              Cancel
            </CommonButton>
            <CommonButton
              variant="contained"
              color="primary"
              isLoading={isSubmitting}
              sx={{
                px: 4,
                py: 1,
                textTransform: "none",
                fontSize: "16px",
              }}
              onClick={handleSubmit(onSubmit, onError)}
            />
          </Box>
        </Box>
      </CommonCard>
    </Layout>
  );
};

export default StaffForm;
