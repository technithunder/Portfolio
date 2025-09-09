"use client";
import React from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  Button,
  InputAdornment,
  Breadcrumbs,
  Link,
  IconButton,
  styled,
  Tooltip,
  Grid,
  Card,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonCard from "@/components/CommonCard";
import { useEffect, useState } from "react";
import { deleteProduct, fetchAllCategory, fetchAllProduct } from "@/api";
import DebaunceInput from "@/utils/DebaunceInput";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CommonFilter from "@/components/CommonFilter";
import CommonTable from "@/components/CommonTable";
import DeleteDialog from "@/components/CommonDeleteDialog";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  borderRadius: "8px",
}));

const StatTitle = styled(Typography)(({ color }) => ({
  fontSize: "16px",
  fontWeight: 400,
  color: color || "#637381",
  marginBottom: "8px",
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  marginBottom: "4px",
}));

const StatSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#637381",
}));

const Product = () => {
  const router = useRouter();
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("productName");
  const [order, setOrder] = useState("ASC");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filters, setFilters] = useState({});
  const [categoryCount, setCategoryCount] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const tableColumns = [
    {
      id: "productName",
      label: "Product Name",
      sortable: true,
    },
    {
      id: "averageRating",
      label: "Rating",
      sortable: false,
      customRender: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating
            value={Number(row.averageRating) || 0}
            precision={0.5}
            readOnly
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
            sx={{
              "& .MuiRating-iconEmpty": {
                opacity: 0.55,
              },
            }}
          />
          {/* <Typography variant="body2" color="text.secondary">
            ({row?.averageRating?.toFixed(1) || "0.0"})
          </Typography> */}
        </Box>
      ),
    },
    {
      id: "categoryId",
      label: "Category",
      sortable: false,
    },
    {
      id: "price",
      label: "Price",
      sortable: false,
    },
    {
      id: "addedStock",
      label: "Quantity",
      sortable: true,
    },
  ];

  const tableData =
    productData?.length > 0 &&
    productData.map((item) => ({
      id: item.id,
      productName: item.productName,
      averageRating: item.averageRating,
      categoryId:
        (categoryOptions?.length > 0 &&
          categoryOptions.find((cat) => cat.id === item.categoryId)?.name) ||
        "-",
      price: item.price,
      addedStock: item.addedStock,
      profilePic: item?.image?.[0],
    }));

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order,
      };
      searchQuery && (params.search = searchQuery);
      filters?.categoryId && (params.categoryId = filters.categoryId);
      const res = await fetchAllProduct({ params });
      if (res && res?.data) {
        setProductData(res?.data?.data?.products);
        setTotal(res?.data?.data?.total);
        setCategoryCount(res?.data?.data?.categoryCount);
      } else {
        setProductData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch product data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    setDeleteDialogOpen(false);
    if (!itemToDelete) return;
    try {
      const res = await deleteProduct(itemToDelete);
      const message = res?.data?.message;

      if (res?.data && message) {
        toast.success(message);
        fetchProduct();
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const params = {
        type: "all",
      };
      await fetchAllCategory({ params }).then((res) => {
        setCategoryOptions(res?.data?.data);
      });
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  const actionButtons = (row) => {
    return (
      <>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => router.push(`/product/${row?.id}/?view=true`)}
          >
            <VisibilityIcon fontSize="small" sx={{ color: "#757575" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => router.push(`/product/${row?.id}`)}
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [searchQuery, page, limit, sortBy, order, filters]);

  return (
    <Layout>
      <CommonCard
        sx={{
          height: productData?.length < 5 ? "100vh" : "auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              Products
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
                Products
              </Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#00ABDC",
              borderRadius: "8px",
              textTransform: "none",
            }}
            onClick={() => router.push("/product/create")}
          >
            Add Product
          </Button>
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
            placeholder="Search Product..."
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
          <CommonFilter
            onFilterApply={handleFilterApply}
            onSortChange={handleSortChange}
            currentSortBy={sortBy}
            currentOrder={order}
            initialFilters={filters}
            optionsMap={{ categoryOptions }}
          />
        </Box>

        {/* Stats Cards Section */}
        <Box sx={{ width: "100%", marginBottom: "24px" }}>
          <Grid container spacing={2}>
            {/* Categories */}
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatTitle color="#00ABDC">Categories</StatTitle>
                <Box>
                  <StatValue>{categoryCount}</StatValue>
                  <StatSubtitle>Last 7 days</StatSubtitle>
                </Box>
              </StatCard>
            </Grid>

            {/* Total Products */}
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatTitle color="#E19133">Total Products</StatTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <StatValue>{total}</StatValue>
                    <StatSubtitle>Last 7 days</StatSubtitle>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <StatValue>₹25000</StatValue>
                    <StatSubtitle>Revenue</StatSubtitle>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            {/* Top Selling */}
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatTitle color="#845EBC">Top Selling</StatTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <StatValue>5</StatValue>
                    <StatSubtitle>Last 7 days</StatSubtitle>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <StatValue>₹2500</StatValue>
                    <StatSubtitle>Cost</StatSubtitle>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            {/* Low Stocks */}
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatTitle color="#F36960">Low Stocks</StatTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <StatValue>12</StatValue>
                    <StatSubtitle>Ordered</StatSubtitle>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <StatValue>2</StatValue>
                    <StatSubtitle>Not in stock</StatSubtitle>
                  </Box>
                </Box>
              </StatCard>
            </Grid>
          </Grid>
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
          emptyMessage="No Product Found"
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteProduct}
          title="Are you sure you want to delete this record?"
        />
      </CommonCard>
    </Layout>
  );
};

export default Product;
