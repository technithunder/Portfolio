import React, { useEffect, useRef, useState } from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import CommonCard from "@/components/CommonCard";
import {
  convertToUser,
  creatAddress,
  fetchAddressById,
  updateAddress,
} from "@/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CommonButton from "../CommonButton";

import CommonInput from "../CommonInput";
import leadSchema from "@/schemas/LeadSchema";
import { leadTypeOptions } from "@/utils/constant";
import addressSchema from "@/schemas/addressSchema";

const AddressForm = ({
  mode = "create",
  addressId = null,
  isViewMode = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Fetch lead data if in update mode
  const fetchAddressData = async () => {
    if (mode === "update" && addressId) {
      try {
        const response = await fetchAddressById(addressId);
        console.log("response", response?.data?.data);

        const addressData = response?.data?.data;
        reset({
          street: addressData.street || "",
          city: addressData.city || "",
          state: addressData.state || "",
          country: addressData.country || "",
          zipCode: addressData.zipCode || "",
        });
      } catch (error) {
        console.error("Error fetching Address data:", error);
        toast.error("Failed to load Address data");
      }
    }
  };

  const handleCustomer = async () => {
    try {
      setLoading(true);
      const payload = {
        addressId: addressId,
      };
      const response = await convertToUser(payload);
      if (response?.data) {
        toast.success(response?.data?.message);
        router.push("/leads");
      }
    } catch (error) {
      console.log("error"), error;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
      };
      let res;
      if (mode === "update" && addressId) {
        res = await updateAddress(addressId, payload);
      } else {
        res = await creatAddress(payload);
      }
      const message = res?.data?.message;
      if (message) {
        toast.success(message);
        router.push("/address");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save Address data");
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
    fetchAddressData();
  }, [mode, addressId]);

  return (
    <Layout>
      {/* Page Title and Breadcrumbs */}
      <CommonCard sx={{ height: "100vh" }}>
        <Box sx={{ paddingX: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "24px", mb: 1 }}>
            Lead
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
                href="/address"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Address
              </Link>
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                {mode === "create" ? "Create Address" : "Update Address"}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid lightgray", p: 3, borderRadius: "10px" }}>
          <Grid container spacing={3}>
            {/* Street and City*/}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    label="Street"
                    variant="outlined"
                    error={!!errors.street}
                    helperText={errors.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    label="City"
                    variant="outlined"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            {/* State */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="State"
                    variant="outlined"
                    disabled={isViewMode}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Country"
                    variant="outlined"
                    disabled={isViewMode}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    disabled={isViewMode}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            {isViewMode ? (
              <CommonButton
                text="Convert to Customer"
                color="primary"
                variant="contained"
                isLoading={loading}
                sx={{
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontSize: "16px",
                }}
                onClick={handleCustomer}
              />
            ) : (
              <>
                <CommonButton
                  text="Cancel"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                  onClick={() => router.push("/address")}
                />

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
              </>
            )}
          </Box>
        </Box>
      </CommonCard>
    </Layout>
  );
};

export default AddressForm;
