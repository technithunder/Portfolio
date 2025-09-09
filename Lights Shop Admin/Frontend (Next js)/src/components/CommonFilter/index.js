import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  IconButton,
  Chip,
  ButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CommonFilter = ({
  onFilterApply,
  onSortChange,
  currentSortBy,
  currentOrder,
  initialFilters = {},
  optionsMap = {},
  isDate = false,
  nextDate = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    status: initialFilters.status || "",
    type: initialFilters.type || "",
    orderStatus: initialFilters.orderStatus || "",
    isAdmin: initialFilters.isAdmin || "",
    role: initialFilters.role || "",
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    datePreset: initialFilters.datePreset || "", // New field for preset selection
  });

  const [sortBy, setSortBy] = useState(currentSortBy || "firstName");
  const [sortOrder, setSortOrder] = useState(currentOrder || "ASC");
  const [activeFilters, setActiveFilters] = useState([]);
  const [isBtnFilter, setIsBtnFilter] = useState(false);

  // Date preset options
  const datePresets = [
    { label: "Next 3 Days", value: "3days", days: 3 },
    { label: "Next 7 Days", value: "7days", days: 7 },
    { label: "Next 15 Days", value: "15days", days: 15 },
    { label: "Next 30 Days", value: "30days", days: 30 },
  ];

  useEffect(() => {
    const newActiveFilters = [];

    if (filters.type) {
      newActiveFilters.push({
        key: "type",
        label: `Type: ${filters.type}`,
      });
    }

    if (filters.status) {
      newActiveFilters.push({
        key: "status",
        label: `Status: ${filters.status}`,
      });
    }

    if (filters?.orderStatus) {
      newActiveFilters.push({
        key: "status",
        label: `Status: ${filters?.orderStatus}`,
      });
    }

    if (filters?.isAdmin) {
      newActiveFilters.push({
        key: "isAdmin",
        label: `Admin: ${filters?.isAdmin}`,
      });
    }

    if (filters?.categoryId) {
      newActiveFilters.push({
        key: "categoryId",
        label: `Category: ${filters?.categoryId}`,
      });
    }

    if (filters?.role) {
      newActiveFilters.push({
        key: "role",
        label: `Role: ${filters?.role}`,
      });
    }

    // Show date preset or custom date range
    if (filters?.datePreset) {
      const preset = datePresets.find((p) => p.value === filters.datePreset);
      newActiveFilters.push({
        key: "datePreset",
        label: preset?.label || `Date: ${filters.datePreset}`,
      });
    } else {
      if (filters?.startDate) {
        newActiveFilters.push({
          key: "startDate",
          label: `From: ${dayjs(filters.startDate).format("MMM DD, YYYY")}`,
        });
      }

      if (filters?.endDate) {
        newActiveFilters.push({
          key: "endDate",
          label: `To: ${dayjs(filters.endDate).format("MMM DD, YYYY")}`,
        });
      }
    }

    setActiveFilters(newActiveFilters);
  }, [filters]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDatePresetChange = (presetValue) => {
    const preset = datePresets.find((p) => p.value === presetValue);

    if (preset) {
      setFilters((prev) => ({
        ...prev,
        datePreset: presetValue,
      }));
    }
  };

  const handleCustomDateMode = () => {
    setFilters((prev) => ({
      ...prev,
      datePreset: "",
    }));
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;

    setFilters((prev) => ({
      ...prev,
      [field]: formattedDate,
      datePreset: "",
    }));
  };

  const handleApplyFilters = () => {
    const appliedFilters = {};

    if (optionsMap?.statusOptions) {
      appliedFilters.status = filters.status;
    }

    if (optionsMap?.leadTypeOptions) {
      appliedFilters.type = filters.type;
    }

    if (optionsMap?.getStatusOptions) {
      appliedFilters.status = filters.orderStatus;
    }

    if (optionsMap?.isAdminOptions) {
      appliedFilters.isAdmin = filters.isAdmin;
    }

    if (optionsMap?.categoryOptions) {
      appliedFilters.categoryId = filters.categoryId;
    }

    if (optionsMap?.roleOptions) {
      appliedFilters.role = filters.role;
    }

    if (filters.startDate) {
      appliedFilters.startDate = filters.startDate;
    }

    if (filters.endDate) {
      appliedFilters.endDate = filters.endDate;
    }

    // Include the preset information
    if (filters.datePreset) {
      appliedFilters.datePreset = filters.datePreset;
    }

    onFilterApply(appliedFilters);
    setIsBtnFilter(true);
    onSortChange(sortBy, sortOrder);
    handleClose();
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      type: "",
      startDate: "",
      endDate: "",
      datePreset: "",
      orderStatus: "",
      isAdmin: "",
      role: "",
      categoryId: "",
    });
    setIsBtnFilter(false);

    if (optionsMap?.getStatusOptions) {
      setSortBy("customerName");
    } else if (optionsMap?.leadTypeOptions) {
      setSortBy("followUpDate");
    } else {
      setSortBy("id");
    }
    setSortOrder("DESC");

    onFilterApply({
      status: "",
      type: "",
      startDate: "",
      endDate: "",
      datePreset: "",
      orderStatus: "",
      isAdmin: "",
      role: "",
      categoryId: "",
    });

    if (optionsMap?.getStatusOptions) {
      onSortChange("customerName", "ASC");
    } else if (optionsMap?.leadTypeOptions) {
      onSortChange("followUpDate", "ASC");
    } else {
      onSortChange("id", "DESC");
    }
    handleClose();
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  //   const handleRemoveFilter = (filterKey) => {
  //     switch (filterKey) {
  //       case "status":
  //         setStatusFilter("");
  //         break;

  //       default:
  //         break;
  //     }

  //     // Immediately apply the removal
  //     const updatedFilters = {
  //       status: filterKey === "status" ? "" : statusFilter,
  //     };

  //     onFilterApply(updatedFilters);
  //   };

  const open = Boolean(anchorEl);
  const id = open ? "staff-filter-popover" : undefined;

  return (
    <>
      {/* Filter Button and Active Filters */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Active Filter Chips */}
        {/* {activeFilters.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.key)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ 
                  borderRadius: "6px",
                  backgroundColor: "rgba(0, 171, 220, 0.1)",
                  borderColor: "#00ABDC",
                  color: "#00ABDC",
                  "& .MuiChip-deleteIcon": {
                    color: "#00ABDC",
                  }
                }}
              />
            ))}
          </Box>
        )} */}
        <Button
          variant={isBtnFilter ? "contained" : "outlined"}
          color={isBtnFilter ? "primary" : "inherit"}
          startIcon={isBtnFilter ? <FilterAltIcon /> : <TuneIcon />}
          onClick={handleClick}
          sx={{
            borderColor: "#e0e0e0",
            color: isBtnFilter ? "#fff" : "#757575",
            "&:hover": {
              borderColor: "#e0e0e0",
              backgroundColor: isBtnFilter ? "" : "transparent",
            },
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          {isBtnFilter ? `Filters (${activeFilters.length})` : "Filters"}
        </Button>
      </Box>

      {/* Filter Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: "450px",
            p: 3,
            mt: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          },
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
          <Typography variant="h6" fontWeight={500}>
            Filter
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Status Filter */}
          {optionsMap?.statusOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {optionsMap?.statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Type  */}
          {optionsMap?.leadTypeOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  {optionsMap?.leadTypeOptions.map((status) => (
                    <MenuItem key={status.label} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Order Status  */}
          {optionsMap?.getStatusOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.orderStatus}
                  label="Status"
                  onChange={(e) =>
                    handleFilterChange("orderStatus", e.target.value)
                  }
                >
                  {optionsMap?.getStatusOptions.map((status) => (
                    <MenuItem key={status.label} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Is Admin */}
          {optionsMap?.isAdminOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Admin</InputLabel>
                <Select
                  value={filters?.isAdmin}
                  label="Admin"
                  onChange={(e) =>
                    handleFilterChange("isAdmin", e.target.value)
                  }
                >
                  {optionsMap?.isAdminOptions.map((status) => (
                    <MenuItem key={status.label} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Category */}
          {optionsMap?.categoryOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters?.categoryId}
                  label="Category"
                  onChange={(e) =>
                    handleFilterChange("categoryId", e.target.value)
                  }
                >
                  {optionsMap?.categoryOptions?.map((status) => (
                    <MenuItem key={status?.name} value={status?.id}>
                      {status?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* role */}
          {optionsMap?.roleOptions && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters?.role}
                  label="Role"
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                >
                  {optionsMap?.roleOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {nextDate && (
            <>
              <Grid item size={{ xs: 12 }}>
                {/* Quick Date Presets */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Quick Select:
                  </Typography>
                  <ButtonGroup
                    size="small"
                    variant="outlined"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {datePresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={
                          filters.datePreset === preset.value
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleDatePresetChange(preset.value)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "6px",
                          backgroundColor:
                            filters.datePreset === preset.value
                              ? "#00ABDC"
                              : "transparent",
                          borderColor:
                            filters.datePreset === preset.value
                              ? "#00ABDC"
                              : "#e0e0e0",
                          color:
                            filters.datePreset === preset.value
                              ? "#fff"
                              : "#757575",
                          "&:hover": {
                            backgroundColor:
                              filters.datePreset === preset.value
                                ? "#0095c7"
                                : "rgba(0, 171, 220, 0.1)",
                            borderColor: "#00ABDC",
                          },
                          mb: 1,
                        }}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>
              </Grid>
            </>
          )}

          {/* Date Filters */}
          {isDate && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate ? dayjs(filters.startDate) : null}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    maxDate={
                      filters.endDate ? dayjs(filters.endDate) : undefined
                    }
                    disabled={!!filters.datePreset}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate ? dayjs(filters.endDate) : null}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    minDate={
                      filters.startDate ? dayjs(filters.startDate) : undefined
                    }
                    disabled={!!filters.datePreset}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </Grid>
              </LocalizationProvider>
            </>
          )}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClearFilters}
            // startIcon={<ClearAllIcon />}
            sx={{ textTransform: "none" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
            sx={{
              textTransform: "none",
              backgroundColor: "#00ABDC",
              "&:hover": {
                backgroundColor: "#00ABDC",
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default CommonFilter;
