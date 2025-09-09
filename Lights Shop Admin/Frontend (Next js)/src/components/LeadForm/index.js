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
  Button,
  Paper,
  DialogContentText,
  InputAdornment,
  TablePagination,
  TableCell,
  TableRow,
  Checkbox,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import CommonCard from "@/components/CommonCard";
import {
  convertToUser,
  createLead,
  createLeadAssignToStaff,
  fetchAllUserDetails,
  fetchLeadById,
  fetchLeadStaff,
  removeLeadStaff,
  updateLead,
} from "@/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import CommonButton from "../CommonButton";
import AddIcon from "@mui/icons-material/Add";
import CommonInput from "../CommonInput";
import leadSchema from "@/schemas/LeadSchema";
import { leadTypeOptions } from "@/utils/constant";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CommonDialog from "../CommonDialog";
import SearchIcon from "@mui/icons-material/Search";
import AssignedStaffTable from "@/app/orders/[id]/AssignedStaffTable/page";
import DeleteIcon from "@mui/icons-material/Delete";

const LeadForm = ({ mode = "create", LeadId = null, isViewMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      customerName: "",
      email: "",
      mobileNumber: "",
      followUpDate: "",
      type: "",
      requirement: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [openDialogBox, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("firstName");
  const [totalStaffCount, setTotalStaffCount] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [orderStaffDetails, setOrderStaffDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const staffColumns = [
    { field: "firstName", headerName: "Staff Name", flex: 1 },

    {
      field: "email",
      headerName: "Staff Email",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Remove">
          <IconButton
            color="error"
            onClick={() => handleRemoveLeadStaff(params?.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleRemoveLeadStaff = async (staffId) => {
    try {
      const payload = {
        leadId: LeadId,
        staffId: staffId,
      };
      const response = await removeLeadStaff(payload);
      const message = response?.data?.message;

      if (response?.data && message) {
        toast.success(message);
        fetchLeadStaffDetails();
      }
    } catch (error) {
      console.error("Error removing Lead staff member:", error);
      toast.error("Failed to remove Lead staff member");
    }
  };

  const fetchStaffDetails = async () => {
    try {
      const params = {
        page: page + 1,
        limit,
        role: "staff",
        sortBy,
        order,
      };
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllUserDetails({ params });
      if (res && res?.data) {
        setStaffData(res.data.data?.users);
        setFilteredStaffData(res.data.data?.users);
        setTotalStaffCount(
          res.data.data?.totalCount || res.data.data?.total || 0
        );
      } else {
        setStaffData([]);
        setTotalStaffCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    }
  };

  const fetchLeadStaffDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchLeadStaff(LeadId);
      setOrderStaffDetails(response?.data?.data?.data?.assignedStaff);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const closeCreateNewDialog = () => {
    setOpenDialog(false);
    setSearchQuery("");
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredStaffData.map((n) => n.BasicInfo?.id);
      setSelectedStaff(newSelecteds);
      return;
    }
    setSelectedStaff([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedStaff.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStaff, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStaff.slice(1));
    } else if (selectedIndex === selectedStaff.length - 1) {
      newSelected = newSelected.concat(selectedStaff.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStaff.slice(0, selectedIndex),
        selectedStaff.slice(selectedIndex + 1)
      );
    }

    setSelectedStaff(newSelected);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedStaff.indexOf(id) !== -1;

  const handleAssignToStaff = async () => {
    try {
      setIsLoading(true);
      const payload = {
        staffIds: selectedStaff?.map((id) => Number(id)),
        leadId: Number(LeadId),
      };
      const response = await createLeadAssignToStaff(payload);
      const staffData = response?.data?.data;
      if (staffData) {
        toast.success(response?.data?.message);
        fetchLeadStaffDetails();
        closeCreateNewDialog();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load staff data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lead data if in update mode
  const fetchLeadData = async () => {
    if (mode === "update" && LeadId) {
      try {
        const response = await fetchLeadById(LeadId);
        const leadData = response?.data?.data;
        reset({
          customerName: leadData?.customerName || "",
          email: leadData?.email || "",
          mobileNumber: leadData?.mobileNumber || "",
          followUpDate: leadData?.followUpDate || "",
          requirement: leadData?.requirement || "",
          type: leadData?.type || "",
        });
      } catch (error) {
        console.error("Error fetching lead data:", error);
        toast.error("Failed to load lead data");
      }
    }
  };

  const handleCustomer = async () => {
    try {
      setLoading(true);
      const payload = {
        leadId: LeadId,
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

      if (mode === "update" && LeadId) {
        res = await updateLead(LeadId, payload);
      } else {
        res = await createLead(payload);
      }

      const message = res?.data?.message;
      if (message) {
        toast.success(message);
        router.push("/leads");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save Leads data");
    }
  };

  const onError = (errors) => {
    console.log("Form errors:", errors);
  };

  useEffect(() => {
    fetchLeadData();
    if (LeadId) fetchLeadStaffDetails();
  }, [mode, LeadId]);

  useEffect(() => {
    if (openDialogBox) {
      fetchStaffDetails();
    }
  }, [searchQuery, page, limit, sortBy, order, openDialogBox]);

  return (
    <Layout>
      {/* Page Title and Breadcrumbs */}
      <CommonCard>
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
                href="/leads"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Leads
              </Link>
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                {mode === "create" ? "Create Leads" : "Update Leads"}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid lightgray", p: 3, borderRadius: "10px" }}>
          <Grid container spacing={3}>
            {/* Name and Email*/}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    label="Name*"
                    variant="outlined"
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    label="Email*"
                    type="email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            {/* Mobile Number and Type */}
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
                    type="number"
                    disabled={isViewMode}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Type*"
                    variant="outlined"
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {leadTypeOptions.map((option) => (
                      <MenuItem key={option.label} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CommonInput>
                )}
              />
            </Grid>

            {/* followUpDate */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Controller
                  name="followUpDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Follow Up Date*"
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
                          error: !!errors.followUpDate,
                          helperText: errors.followUpDate?.message,
                          disabled: isViewMode,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>

            <Grid item size={{ xs: 12 }}>
              <Controller
                name="requirement"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Requirement"
                    variant="outlined"
                    useBuiltInLabel={true}
                    disable={isViewMode}
                    error={!!errors.requirement}
                    helperText={errors.requirement?.message}
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
                  onClick={() => router.push("/leads")}
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

        {isViewMode && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 2,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                Assign to staff members
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#00ABDC",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#00ABDC",
                    boxShadow: "none",
                  },
                }}
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Manage Staff members
              </Button>
            </Box>

            {/* Assigned Staff Table with Scrollbar */}
            <Box
              sx={{
                maxHeight: orderStaffDetails.length > 5 ? "300px" : "auto",
                overflow: orderStaffDetails.length > 5 ? "auto" : "visible",
                border:
                  orderStaffDetails.length > 5 ? "1px solid #e0e0e0" : "none",
                borderRadius: orderStaffDetails.length > 5 ? 1 : 0,
              }}
            >
              <AssignedStaffTable
                loading={loading}
                data={orderStaffDetails}
                columns={staffColumns}
              />
            </Box>
          </Paper>
        )}

        <CommonDialog
          heading={<span>Staff Members Details</span>}
          open={openDialogBox}
          handleClose={closeCreateNewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogContentText
            sx={{
              width: "100%",
              minWidth: "600px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" sx={{ color: "#000" }}>
              {"Manage Staff Members"}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="caption">Select staff members</Typography>

              <TextField
                placeholder="Search staff members..."
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  minWidth: "250px",
                  mt: -4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#757575" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  flex: 1,
                  maxHeight: "350px",
                  overflow: "auto",
                }}
              >
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="staff members table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={
                            selectedStaff.length > 0 &&
                            selectedStaff.length < filteredStaffData.length
                          }
                          checked={
                            filteredStaffData.length > 0 &&
                            selectedStaff.length === filteredStaffData.length
                          }
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSortBy("firstName");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Staff Name
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: "18px",
                              ml: 0.5,
                              transform:
                                sortBy === "firstName" && order === "DESC"
                                  ? "rotate(180deg)"
                                  : "none",
                              // transition: "transform 0.2s ease",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSortBy("email");
                          setOrder(order === "ASC" ? "DESC" : "ASC");
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Staff Email
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: "18px",
                              ml: 0.5,
                              transform:
                                sortBy === "email" && order === "DESC"
                                  ? "rotate(180deg)"
                                  : "none",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffData.map((staff) => {
                      const isItemSelected = isSelected(staff.BasicInfo?.id);
                      const labelId = `enhanced-table-checkbox-${staff.BasicInfo?.id}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            handleClick(event, staff.BasicInfo?.id)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={staff.BasicInfo?.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {staff?.BasicInfo?.firstName}{" "}
                            {staff?.BasicInfo?.lastName || ""}
                          </TableCell>
                          <TableCell>{staff?.ContactInfo?.email}</TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredStaffData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            No staff members found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalStaffCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Rows per page:"
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  "& .MuiTablePagination-toolbar": {
                    justifyContent: "space-between",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    order: -1,
                  },
                  "& .MuiTablePagination-select": {
                    order: -1,
                  },
                }}
              />
            </Box>

            {selectedStaff.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 1 }}>
                <Typography variant="body2" color="primary">
                  {selectedStaff.length} staff member
                  {selectedStaff.length > 1 ? "s" : ""} selected
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={closeCreateNewDialog}
                sx={{ borderColor: "#e0e0e0", color: "#666", borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  bgcolor: "#00ABDC",
                  "&:hover": { bgcolor: "#00ABDC" },
                }}
                onClick={handleAssignToStaff}
                disabled={selectedStaff.length === 0 /* || isLoading */}
              >
                Assign Selected ({selectedStaff.length})
              </Button>
            </Box>
          </DialogContentText>
        </CommonDialog>
      </CommonCard>
    </Layout>
  );
};

export default LeadForm;
