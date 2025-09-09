import React, { useEffect, useState } from "react";
import Layout from "@/Layout";
import {
  Typography,
  Box,
  InputAdornment,
  Breadcrumbs,
  Link,
  Grid,
  TextField,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Alert,
  Button,
  Skeleton,
} from "@mui/material";
import { useForm, Controller, set } from "react-hook-form";
import { toast } from "react-toastify";
import { Add, Remove, Delete, ShoppingCart } from "@mui/icons-material";

import CommonCard from "@/components/CommonCard";
import {
  createOrders,
  fetchAddressById,
  fetchAllProductDetails,
  fetchAllUser,
} from "@/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import CommonButton from "../CommonButton";
import CommonInput from "../CommonInput";
import orderSchema from "@/schemas/orderSchema";
import NextImage from "next/image";
import DebaunceInput from "@/utils/DebaunceInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const OrderForm = ({ mode = "create" }) => {
  const router = useRouter();
  const [loading, setLoading] = useState({
    user: false,
    product: false,
  });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [productData, setProductData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [userData, setUserData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [productConfigurations, setProductConfigurations] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      userId: "",
      totalAmount: 0,
      totalItems: 0,
      shippingAddress: "",
    },
  });

  const watchedUserId = watch("userId");

  const handleDebouncedChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Fetch user data
  const fetchAllUserData = async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      const res = await fetchAllUser({ params: { role: "both" } });
      if (res && res?.data) {
        setUserData(res?.data?.data?.users);
      }
    } catch (err) {
      console.error("Failed to fetch product data", err);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading((prev) => ({ ...prev, product: true }));
      const params = {};
      watchedUserId && (params.userId = watchedUserId);
      searchQuery && (params.search = searchQuery);
      const res = await fetchAllProductDetails({ params });

      if (res && res?.data) {
        setProductData(res.data.data);
        setTotal(res.data.data.total);

        // Initialize configurations for each product
        const initialConfigs = {};
        res.data.data.forEach((product) => {
          initialConfigs[product.id] = {
            ledcolors: product.ledColors?.[0]?.color || "",
            bodycolors: product.bodyColors?.[0]?.color || "",
            watts: product.watts?.[0]?.value?.toString() || "",
            reflectors: product.reflectors?.[0]?.value?.toString() || "",
          };
        });
        setProductConfigurations(initialConfigs);
      } else {
        setProductData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch product data", err);
    } finally {
      setLoading((prev) => ({ ...prev, product: false }));
    }
  };

  // Fetch shipping address
  const fetchAddressData = async () => {
    try {
      const params = {};
      watchedUserId && (params.userId = watchedUserId);
      const res = await fetchAddressById({ params });
      if (res && res?.data) {
        setAddressData(res?.data?.data?.address);
      }
    } catch (error) {}
  };

  // Update product configuration
  const updateProductConfiguration = (productId, attribute, value) => {
    setProductConfigurations((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [attribute]: value,
      },
    }));
  };

  // Calculate price based on configuration
  const calculateConfiguredPrice = (product, config) => {
    const ledColorDiscount =
      product.ledColors?.find((opt) => opt.color === config.ledcolors)
        ?.discount || 0;

    const bodyColorDiscount =
      product.bodyColors?.find((opt) => opt.color === config.bodycolors)
        ?.discount || 0;

    const wattDiscount =
      product.watts?.find((opt) => opt.value?.toString() === config.watts)
        ?.discount || 0;

    const reflectorDiscount =
      product.reflectors?.find(
        (opt) => opt.value?.toString() === config.reflectors
      )?.discount || 0;

    const totalDiscountPercent =
      ledColorDiscount + bodyColorDiscount + wattDiscount + reflectorDiscount;
    const discountedPrice =
      product.afterDiscountPrice * (1 - totalDiscountPercent / 100);

    return parseFloat(discountedPrice?.toFixed(2));
  };

  const generateProductKey = (productId, config) => {
    return `${productId}_${config.ledcolors}_${config.bodycolors}_${config.watts}_${config.reflectors}`;
  };

  const addProductToOrder = (product) => {
    const currentConfig = productConfigurations[product.id];
    const productKey = generateProductKey(product.id, currentConfig);

    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.productKey === productKey
    );

    if (existingProductIndex >= 0) {
      updateProductQuantity(
        existingProductIndex,
        selectedProducts[existingProductIndex].quantity + 1
      );
    } else {
      const configuredPrice = calculateConfiguredPrice(product, currentConfig);

      const newProduct = {
        productKey: productKey,
        productId: product.id,
        productName: product.productName,
        quantity: 1,
        unitPrice: parseFloat(configuredPrice?.toFixed(2)),
        totalPrice: parseFloat(configuredPrice?.toFixed(2)),
        ledcolors: currentConfig.ledcolors,
        bodycolors: currentConfig.bodycolors,
        watts: currentConfig.watts,
        reflectors: currentConfig.reflectors,
        image: product.image?.[0] || "",
        remainingStock: product.remainingStock,
        basePrice: product.afterDiscountPrice,
        ledColorOptions: product.ledColors || [],
        bodyColorOptions: product.bodyColors || [],
        wattOptions: product.watts || [],
        reflectorOptions: product.reflectors || [],
      };

      setSelectedProducts([...selectedProducts, newProduct]);
    }
  };

  const calculateDiscountedPrice = (selectedProduct) => {
    const ledColorDiscount =
      selectedProduct.ledColorOptions?.find(
        (opt) => opt.color === selectedProduct.ledcolors
      )?.discount || 0;

    const bodyColorDiscount =
      selectedProduct.bodyColorOptions?.find(
        (opt) => opt.color === selectedProduct.bodycolors
      )?.discount || 0;

    const wattDiscount =
      selectedProduct.wattOptions?.find(
        (opt) => opt.value?.toString() === selectedProduct.watts
      )?.discount || 0;

    const reflectorDiscount =
      selectedProduct.reflectorOptions?.find(
        (opt) => opt.value?.toString() === selectedProduct.reflectors
      )?.discount || 0;

    const totalDiscountPercent =
      ledColorDiscount + bodyColorDiscount + wattDiscount + reflectorDiscount;
    const discountedUnitPrice = parseFloat(
      (selectedProduct.basePrice * (1 - totalDiscountPercent / 100)).toFixed(2)
    );

    return {
      unitPrice: discountedUnitPrice,
      totalPrice: parseFloat(
        (discountedUnitPrice * selectedProduct.quantity)?.toFixed(2)
      ),
    };
  };

  const updateProductQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeProductFromOrder(index);
      return;
    }

    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;

    const newPrices = calculateDiscountedPrice(updatedProducts[index]);
    updatedProducts[index].unitPrice = parseFloat(newPrices.unitPrice);
    updatedProducts[index].totalPrice = parseFloat(newPrices.totalPrice);

    setSelectedProducts(updatedProducts);
  };

  // Remove product from order
  const removeProductFromOrder = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedProducts.length === 0) {
        toast.error("Please add at least one product to the order");
        return;
      }

      const payload = {
        ...data,
        isAdmin: true,
        orderItems: selectedProducts.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          ledcolors: item.ledcolors,
          bodycolors: item.bodycolors,
          watts: item.watts,
          reflectors: item.reflectors,
        })),
      };
      const res = await createOrders(payload);
      const message = res?.data?.message;
      if (message) {
        toast.success(message);
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save Order data");
    }
  };

  const onError = (errors) => {
    console.log("Form errors:", errors);
  };

  // Calculate totals
  useEffect(() => {
    const newTotalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const newTotalItems = selectedProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setTotalAmount(newTotalAmount);
    setTotalItems(newTotalItems);
    setValue("totalAmount", newTotalAmount);
    setValue("totalItems", newTotalItems);
  }, [selectedProducts, setValue]);

  useEffect(() => {
    fetchProduct();
    fetchAllUserData();
    fetchAddressData();
  }, [mode, watchedUserId, searchQuery]);

  return (
    <Layout>
      <CommonCard>
        <Box sx={{ paddingX: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "24px", mb: 1 }}>
            Orders
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
                href="/orders"
                sx={{
                  textDecoration: "none",
                  color: "#00ABDC",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Orders
              </Link>
              <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                {mode === "create" ? "Create Order" : "Update Order"}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        {/* Customer Information */}
        <Box
          sx={{
            border: "1px solid lightgray",
            p: 3,
            borderRadius: "10px",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Customer Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Customer Name"
                    variant="outlined"
                    useBuiltInLabel={true}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      },
                    }}
                    error={!!errors.userId}
                    helperText={errors.userId?.message}
                  >
                    {userData?.length > 0 &&
                      userData?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.firstName}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="shippingAddress"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Shipping Address"
                    variant="outlined"
                    useBuiltInLabel={true}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    error={!!errors.shippingAddress}
                    helperText={errors.shippingAddress?.message}
                  >
                    {addressData?.length > 0 &&
                      addressData?.map((address) => (
                        <MenuItem
                          key={address.id}
                          value={`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`}
                        >
                          {`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Controller
                  name="expectedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Expected Date"
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
                          error: !!errors.expectedDate,
                          helperText: errors.expectedDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider> */}
          </Grid>
        </Box>
        {/* Product Selection */}
        <Box
          sx={{
            border: "1px solid lightgray",
            p: 3,
            borderRadius: "10px",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Product Information
            </Typography>

            {/* Search and Filter Bar */}
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
          </Box>
          <Box
            sx={{
              maxHeight: "800px",
              overflowY: "auto",
              pr: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            {loading?.product ? (
              <Grid container spacing={2}>
                {[...Array(4)].map((_, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="80%" height={30} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Box sx={{ mt: 2 }}>
                          <Skeleton
                            variant="rectangular"
                            height={40}
                            sx={{ mb: 1 }}
                          />
                          <Skeleton
                            variant="rectangular"
                            height={40}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                          }}
                        >
                          <Skeleton variant="text" width="40%" height={30} />
                          <Skeleton variant="text" width="30%" height={30} />
                        </Box>
                        <Skeleton
                          variant="rectangular"
                          height={36}
                          sx={{ mt: 2 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : productData.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  gap: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No Products Found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {productData.map((product) => {
                  const currentConfig = productConfigurations[product.id] || {};
                  const configuredPrice = calculateConfiguredPrice(
                    product,
                    currentConfig
                  );

                  return (
                    <Grid item size={{ xs: 12, md: 3 }} key={product.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.image?.[0] || "/placeholder-image.jpg"}
                          alt={product.productName}
                          sx={{
                            objectFit: "contain",
                            width: "100%",
                            maxHeight: "200px",
                            backgroundColor: "#f5f5f5",
                            padding: "5px",
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ mb: 1, fontSize: "16px" }}
                          >
                            {product.productName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {product?.productDescription?.length > 50
                              ? `${product.productDescription.substring(
                                  0,
                                  50
                                )}...`
                              : product?.productDescription}
                          </Typography>

                          {/* Configuration Options */}
                          <Box sx={{ mb: 2 }}>
                            <Grid container spacing={1}>
                              {/* LED Color */}
                              <Grid item size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>LED Color</InputLabel>
                                  <Select
                                    value={currentConfig.ledcolors || ""}
                                    onChange={(e) =>
                                      updateProductConfiguration(
                                        product.id,
                                        "ledcolors",
                                        e.target.value
                                      )
                                    }
                                    label="LED Color"
                                  >
                                    {product.ledColors?.map((color, i) => (
                                      <MenuItem key={i} value={color.color}>
                                        {color.color}
                                        {color.discount !== 0 && (
                                          <span
                                            style={{
                                              color:
                                                color.discount > 0
                                                  ? "#4caf50"
                                                  : "#f44336",
                                              fontSize: "0.8em",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            ({color.discount > 0 ? "+" : ""}
                                            {color.discount}%)
                                          </span>
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              {/* Body Color */}
                              <Grid item size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Body Color</InputLabel>
                                  <Select
                                    value={currentConfig.bodycolors || ""}
                                    onChange={(e) =>
                                      updateProductConfiguration(
                                        product.id,
                                        "bodycolors",
                                        e.target.value
                                      )
                                    }
                                    label="Body Color"
                                  >
                                    {product.bodyColors?.map((color, i) => (
                                      <MenuItem key={i} value={color.color}>
                                        {color.color}
                                        {color.discount !== 0 && (
                                          <span
                                            style={{
                                              color:
                                                color.discount > 0
                                                  ? "#4caf50"
                                                  : "#f44336",
                                              fontSize: "0.8em",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            ({color.discount > 0 ? "+" : ""}
                                            {color.discount}%)
                                          </span>
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              {/* Watts */}
                              <Grid item size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Watts</InputLabel>
                                  <Select
                                    value={currentConfig.watts || ""}
                                    onChange={(e) =>
                                      updateProductConfiguration(
                                        product.id,
                                        "watts",
                                        e.target.value
                                      )
                                    }
                                    label="Watts"
                                  >
                                    {product.watts?.map((watt, i) => (
                                      <MenuItem
                                        key={i}
                                        value={watt.value?.toString()}
                                      >
                                        {watt.value}W
                                        {watt.discount !== 0 && (
                                          <span
                                            style={{
                                              color:
                                                watt.discount > 0
                                                  ? "#4caf50"
                                                  : "#f44336",
                                              fontSize: "0.8em",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            ({watt.discount > 0 ? "+" : ""}
                                            {watt.discount}%)
                                          </span>
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              {/* Reflectors */}
                              <Grid item size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Reflectors</InputLabel>
                                  <Select
                                    value={currentConfig.reflectors || ""}
                                    onChange={(e) =>
                                      updateProductConfiguration(
                                        product.id,
                                        "reflectors",
                                        e.target.value
                                      )
                                    }
                                    label="Reflectors"
                                  >
                                    {product.reflectors?.map((reflector, i) => (
                                      <MenuItem
                                        key={i}
                                        value={reflector.value?.toString()}
                                      >
                                        {reflector.value}
                                        {reflector.discount !== 0 && (
                                          <span
                                            style={{
                                              color:
                                                reflector.discount > 0
                                                  ? "#4caf50"
                                                  : "#f44336",
                                              fontSize: "0.8em",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            ({reflector.discount > 0 ? "+" : ""}
                                            {reflector.discount}%)
                                          </span>
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Price Display */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {product?.afterDiscountPrice &&
                              product?.afterDiscountPrice !== product?.price ? (
                                <>
                                  <Typography component="span" color="primary">
                                    ₹{product.afterDiscountPrice}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "text.secondary",
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    ₹{product.price}
                                  </Typography>
                                  {product.afterDiscountPrice && (
                                    <Typography
                                      component="span"
                                      sx={{
                                        color: "success.main",
                                        fontSize: "0.8em",
                                      }}
                                    >
                                      (
                                      {Math.round(
                                        ((product?.price -
                                          product?.afterDiscountPrice) /
                                          product?.price) *
                                          100
                                      )}
                                      % OFF)
                                    </Typography>
                                  )}
                                </>
                              ) : (
                                <Typography component="span" color="primary">
                                  ₹{product.price}
                                </Typography>
                              )}
                            </Typography>
                            <Chip
                              label={`Stock: ${product.remainingStock}`}
                              size="small"
                              color={
                                product.remainingStock > 10
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Box>

                          <CommonButton
                            text="Add to Order"
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<Add />}
                            onClick={() => addProductToOrder(product)}
                            disabled={product.remainingStock === 0}
                            sx={{ textTransform: "none" }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Box>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <Box
            sx={{
              border: "1px solid lightgray",
              p: 3,
              borderRadius: "10px",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Items ({selectedProducts.length})
            </Typography>
            {selectedProducts.map((item, index) => (
              <Card key={item.productKey} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item size={{ xs: 12, sm: 3 }}>
                    <Avatar
                      src={item.image}
                      alt={item.productName}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.productName}
                    </Typography>
                    {[
                      {
                        label: "Unit Price",
                        value: item?.unitPrice,
                      },
                      { label: "LED Color", value: item.ledcolors },
                      { label: "Body Color", value: item.bodycolors },
                      { label: "Watts", value: `${item.watts}W` },
                      { label: "Reflectors", value: item.reflectors },
                    ].map((detail, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        color="text.secondary"
                      >
                        {detail.label}: {detail.value}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateProductQuantity(index, item.quantity - 1)
                        }
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductQuantity(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                        size="small"
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, max: item.remainingStock }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateProductQuantity(index, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.remainingStock}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => removeProductFromOrder(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total: ₹
                    {typeof item.totalPrice === "number"
                      ? item.totalPrice.toFixed(2)
                      : parseFloat(item.totalPrice || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Card>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Order Summary */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
              <Typography variant="h6">
                Total Items:{" "}
                <span style={{ color: "#00ABDC" }}>{totalItems}</span>
              </Typography>
              <Typography variant="h6">
                Total Amount:{" "}
                <span style={{ color: "#00ABDC" }}>
                  ₹{totalAmount?.toFixed(2)}
                </span>
              </Typography>
            </Box>
          </Box>
        )}

        {selectedProducts.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCart />
              No products selected. Please add products to create an order.
            </Box>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
        >
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
              onClick={() => router.push("/orders")}
            />
            <CommonButton
              text={mode === "create" ? "Create Order" : "Update Order"}
              variant="contained"
              color="primary"
              isLoading={isSubmitting}
              disabled={selectedProducts.length === 0}
              sx={{
                px: 4,
                py: 1,
                textTransform: "none",
                fontSize: "16px",
              }}
              onClick={handleSubmit(onSubmit, onError)}
            />
          </>
        </Box>
      </CommonCard>
    </Layout>
  );
};

export default OrderForm;
