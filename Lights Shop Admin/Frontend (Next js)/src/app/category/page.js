"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Button,
  DialogContentText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { toast } from "react-toastify";
import CommonButton from "@/components/CommonButton";
import CommonDialog from "@/components/CommonDialog";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "@/components/CommonInput";
import categorySchema from "@/schemas/categorySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createCategory,
  deleteCategory,
  fetchAllCategory,
  fetchCategoryById,
  updateCategory,
} from "@/api";
import CommonTable from "@/components/CommonTable";
import DeleteDialog from "@/components/CommonDeleteDialog";

const Category = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialogBox, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const tableColumns = [
    {
      id: "name",
      label: "Category Name",
      sortable: true,
      disableAvatar: true,
    },
  ];

  const tableData =
    categoryData?.length > 0 &&
    categoryData?.map((category) => ({
      id: category?.id,
      name: category?.name || "-",
    }));

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order,
      };
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllCategory({ params });

      if (res && res?.data) {
        setCategoryData(res.data.data?.categories);
        setTotal(res.data.data.total);
      } else {
        setCategoryData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch Category data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedCategoryId(null);
    reset();
  };

  const handleAddCategory = () => {
    setEditMode(false);
    setSelectedCategoryId(null);
    reset();
    setOpenDialog(true);
  };

  const handleEditCategory = async (categoryId) => {
    try {
      setEditMode(true);
      setSelectedCategoryId(categoryId);

      const res = await fetchCategoryById(categoryId);

      if (res && res?.data) {
        setValue("name", res?.data?.data?.name, { shouldValidate: true });
      }

      setOpenDialog(true);
    } catch (err) {
      console.error("Failed to fetch category for edit", err);
      toast.error("Failed to load category data");
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    setDeleteDialogOpen(false);
    if (!itemToDelete) return;
    try {
      const res = await deleteCategory(itemToDelete);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchCategoryData();
      }
    } catch (err) {
      console.error("Failed to delete category", err);
      toast.error("Failed to delete category");
    }
  };

  const onSubmit = async (data) => {
    try {
      let res;

      if (editMode) {
        res = await updateCategory(selectedCategoryId, data);
      } else {
        res = await createCategory(data);
      }

      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        handleClose();
        fetchCategoryData();
      }
    } catch (err) {
      console.error(
        `Failed to ${editMode ? "update" : "create"} category`,
        err
      );
      toast.error(`Failed to ${editMode ? "update" : "create"} category`);
    }
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleEditCategory(row?.id)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(row?.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  useEffect(() => {
    fetchCategoryData();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  return (
    <Layout>
      <CommonCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 500, marginBottom: "8px", fontSize: "24px" }}
            >
              Category
            </Typography>
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
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                Category
              </Typography>
            </Breadcrumbs>
          </Box>

          <CommonButton
            text=" Add Category"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={handleAddCategory}
          />
        </Box>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <DebaunceInput
            placeholder="Search Category..."
            variant="outlined"
            size="small"
            delay={500}
            sx={{
              width: { xs: "180px", sm: "300px" },
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "0",
              },
            }}
            value={searchQuery}
            onChange={handleDebouncedChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NextImage
                    src={"/assets/search.svg"}
                    alt="Search Icon"
                    width={24}
                    height={24}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Data Table */}
        <CommonTable
          columns={tableColumns}
          data={tableData}
          loading={loading}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(e, value) => setPage(value)}
          onSortChange={(newSortBy, newOrder) => {
            setSortBy(newSortBy);
            setOrder(newOrder);
            setPage(1);
          }}
          sortBy={sortBy}
          order={order}
          actionButtons={actionButtons}
          emptyMessage="No Category Found"
        />

        <CommonDialog
          heading={<span>{editMode ? "Edit Category" : "Add Category"}</span>}
          open={openDialogBox}
          handleClose={handleClose}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleSubmit(onSubmit)}>
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
              <Grid container spacing={3} sx={{ p: 1 }}>
                <Grid item size={{ xs: 12 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <CommonInput
                        {...field}
                        fullWidth
                        useBuiltInLabel={true}
                        label="Category Name*"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                spacing={2}
                sx={{
                  p: 3,
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      borderRadius: 2,
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      bgcolor: "#00ABDC",
                      "&:hover": { bgcolor: "#00ABDC" },
                      minWidth: 120,
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : editMode ? (
                      "Update"
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </CommonDialog>

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteCategory}
          title="Are you sure you want to delete this record?"
        />
      </CommonCard>
    </Layout>
  );
};

export default Category;
