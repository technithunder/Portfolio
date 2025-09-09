import React, { useEffect, useRef, useState } from "react";
import Layout from "@/Layout";
import CommonCard from "@/components/CommonCard";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Stack,
  IconButton,
  FormHelperText,
  MenuItem,
  CircularProgress,
  Dialog,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  createProduct,
  fetchAllCategory,
  fetchProductById,
  fetchProductReview,
  updateProduct,
} from "@/api";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import productSchema from "@/schemas/productSchema";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import CommonButton from "@/components/CommonButton";
import CommonInput from "@/components/CommonInput";
import { fileToBase64 } from "@/utils/helper";

const HiddenInput = styled("input")({
  display: "none",
});

const ColorPalette = ({ onSelectColor, selectedColors = [] }) => {
  const colors = [
    { name: "red", value: "#ff0000" },
    { name: "green", value: "#00ff00" },
    { name: "blue", value: "#0000ff" },
    { name: "brown", value: "#a52a2a" },
    { name: "orange", value: "#ffa500" },
  ];

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      {colors.map((color) => {
        const isSelected = selectedColors.includes(color.value);
        return (
          <Box
            key={color.name}
            onClick={() => !isSelected && onSelectColor(color.value)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: color.value,
              cursor: isSelected ? "not-allowed" : "pointer",
              border: isSelected
                ? "3px solid #1976d2"
                : "2px solid transparent",
              opacity: isSelected ? 0.7 : 1,
              position: "relative",
              "&:hover": !isSelected && {
                transform: "scale(1.1)",
              },
            }}
            title={`${color.name}${isSelected ? " (selected)" : ""}`}
          >
            {isSelected && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                ✓
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const DynamicFieldSection = ({
  fields,
  fieldName,
  fieldKey,
  label1,
  label2,
  placeholder1,
  placeholder2,
  type1 = "text",
  type2 = "number",
  onAdd,
  onRemove,
  errors,
  showColorPalette = false,
  control,
  isViewMode,
}) => {
  const selectedColors = fields
    .map((field) => field[fieldKey])
    .filter(
      (color) => color && typeof color === "string" && color.startsWith("#")
    );

  const handleColorSelect = (color) => {
    const newField = { [fieldKey]: color, discount: "" };
    onAdd(newField);
  };
  useEffect(() => {
    if (
      fieldName === "watts" && 
      !isViewMode &&
      fields.length === 0 &&
      typeof onAdd === "function"
    ) {
      onAdd({ [fieldKey]: "", discount: "" });
    }
  }, [fieldName, fields, isViewMode, onAdd, fieldKey]);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: "1px solid #e9ecef",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {showColorPalette && !isViewMode && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
            Select Colors
          </Typography>
          <ColorPalette
            onSelectColor={handleColorSelect}
            selectedColors={selectedColors}
          />
        </Box>
      )}

      {fields.length === 0 && isViewMode && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#f8f9fa",
            border: "1px dashed #ced4da",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No {label1.toLowerCase()} available.
          </Typography>
        </Box>
      )}

      {fields.map((field, index) => {
        if (!showColorPalette || field[fieldKey]) {
          return (
            <Box
              key={field.id}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "white",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item size={{ xs: 5 }}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {label1}
                  </Typography>

                  {showColorPalette && (
                    <Controller
                      name={`${fieldName}.${index}.${fieldKey}`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          fullWidth
                          value={value || ""}
                          onChange={(e) => onChange(e.target.value)}
                          placeholder={placeholder1}
                          variant="outlined"
                          error={Boolean(
                            errors[fieldName]?.[index]?.[fieldKey]
                          )}
                          helperText={
                            errors[fieldName]?.[index]?.[fieldKey]?.message
                          }
                          disabled={isViewMode}
                        />
                      )}
                    />
                  )}

                  {!showColorPalette && (
                    <Controller
                      name={`${fieldName}.${index}.${fieldKey}`}
                      control={control}
                      render={({ field: controllerField }) => (
                        <TextField
                          {...controllerField}
                          fullWidth
                          type={type1}
                          placeholder={placeholder1}
                          variant="outlined"
                          error={Boolean(
                            errors[fieldName]?.[index]?.[fieldKey]
                          )}
                          helperText={
                            errors[fieldName]?.[index]?.[fieldKey]?.message
                          }
                          disabled={isViewMode}
                        />
                      )}
                    />
                  )}
                </Grid>

                <Grid item size={{ xs: 5 }}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {label2}
                  </Typography>
                  <Controller
                    name={`${fieldName}.${index}.discount`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        fullWidth
                        type={type2}
                        placeholder={placeholder2}
                        variant="outlined"
                        onChange={(e) => {
                          const { value } = e.target;
                          controllerField.onChange(
                            value === "" ? "" : Number(value)
                          );
                        }}
                        error={Boolean(errors[fieldName]?.[index]?.discount)}
                        helperText={
                          errors[fieldName]?.[index]?.discount?.message
                        }
                        disabled={isViewMode}
                      />
                    )}
                  />
                </Grid>

                {!isViewMode && (
                  <Grid
                    item
                    size={{ xs: 2 }}
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {index === fields.length - 1 && !showColorPalette && (
                      <IconButton
                        color="primary"
                        onClick={() => onAdd({ [fieldKey]: "", discount: "" })}
                        sx={{
                          backgroundColor: "#e3f2fd",
                          "&:hover": { backgroundColor: "#bbdefb" },
                          width: 36,
                          height: 36,
                        }}
                      >
                        <AddIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}

                    <IconButton
                      color="error"
                      onClick={() => onRemove(index)}
                      sx={{
                        backgroundColor: "#ffebee",
                        "&:hover": { backgroundColor: "#ffcdd2" },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        }
        return null;
      })}
    </Paper>
  );
};

const ProductForm = ({
  mode = "create",
  productId = null,
  isViewMode = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      productName: "",
      categoryId: "",
      productPrice: "",
      discount: "",
      discountPrice: "",
      productDescription: "",
      image: [],
      openingStock: "",
      remainingStock: "",
      addedStock: "",
      // expiryDate: "",
      ledColors: [{ color: "", discount: "" }],
      bodyColors: [{ color: "", discount: "" }],
      watts: [{ value: "", discount: "" }],
      reflectors: [{ color: "", discount: "" }],
      rating: 0,
    },
  });
  const router = useRouter();

  // Field arrays for dynamic fields
  const {
    fields: ledColorFields,
    append: appendLedColor,
    remove: removeLedColor,
  } = useFieldArray({
    control,
    name: "ledColors",
  });

  const {
    fields: bodyColorFields,
    append: appendBodyColor,
    remove: removeBodyColor,
  } = useFieldArray({
    control,
    name: "bodyColors",
  });

  const {
    fields: wattsFields,
    append: appendWatts,
    remove: removeWatts,
  } = useFieldArray({
    control,
    name: "watts",
  });

  const {
    fields: reflectorFields,
    append: appendReflector,
    remove: removeReflector,
  } = useFieldArray({
    control,
    name: "reflectors",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState({
    category: false,
    status: false,
    form: false,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [rating, setRating] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [reviewPagination, setReviewPagination] = useState({
    page: 1,
    pageSize: 5,
    total: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  console.log("previewImage ", previewImage);
  console.log("previewOpen ", previewOpen);

  const handleImageClick = (image) => {
    setPreviewImage(image.preview);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setImageError("Please select only image files (JPEG, JPG, PNG)");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      setImageError("Each image must be less than 5MB");
      return;
    }

    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      setImageError("Maximum 5 image allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isNew: true,
    }));

    const updatedImages = [...selectedImages, ...newImages];
    setSelectedImages(updatedImages);
    setValue("image", updatedImages);

    setImageError("");
    clearErrors("image");
    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setValue("image", updatedImages);
    URL.revokeObjectURL(selectedImages[index].preview);

    if (updatedImages.length === 0) {
      setError("image", { message: "At least one product image is required" });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;

    if (isNearBottom && hasMoreReviews && !loadingReviews) {
      fetchProductReviewData(true);
    }
  };

  const fetchProductData = async () => {
    if (mode === "update" && productId) {
      try {
        const res = await fetchProductById(productId);
        const product = res.data.data;

        if (product) {
          setRating(product?.averageRating);
        }

        reset({
          productName: product.productName || "",
          categoryId: product.categoryId || "",
          productPrice: product.productPrice || "",
          discount: product.discount || "",
          discountPrice: product.discountPrice || "",
          productDescription: product.productDescription || "",
          image: Array.isArray(product.image)
            ? product.image.map((img) => ({
                file: null,
                preview: typeof img === "string" ? img : img.url,
                name: typeof img === "string" ? img.split("/").pop() : img.name,
                isNew: false,
              }))
            : [],
          openingStock: product.openingStock || "",
          remainingStock: product.remainingStock || "",
          addedStock: product.addedStock || "",
          // expiryDate:
          //   new Date(product.expiryDate)?.toISOString()?.split("T")[0] || "",
          ledColors: product.ledColors || [{ color: "", discount: "" }],
          bodyColors: product.bodyColors || [{ color: "", discount: "" }],
          watts: product.watts || [{ value: "", discount: "" }],
          reflectors: product.reflectors || [{ color: "", discount: "" }],
        });

        setSelectedImages(
          Array.isArray(product.image)
            ? product.image.map((img) => ({
                file: null,
                preview: typeof img === "string" ? img : img.url,
                name: typeof img === "string" ? img.split("/").pop() : img.name,
                isNew: false,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoadingMoreReviews(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const existingImages = data.image
        .filter((image) => !image.isNew && typeof image.preview === "string")
        .map((image) => image.preview);

      const newImages = data.image.filter(
        (image) => image.isNew && image.file instanceof File
      );

      const imageBase64Promises = newImages.map((image) =>
        fileToBase64(image.file)
      );
      const imageBase64Array = await Promise.all(imageBase64Promises);

      const payload = {
        ...data,
        images: [...existingImages, ...imageBase64Array],
        ledColors: data.ledColors
          .filter((field) => field.color && field.discount !== "")
          .map((field) => ({
            color: field.color,
            discount: Number(field.discount),
          })),
        bodyColors: data.bodyColors
          .filter((field) => field.color && field.discount !== "")
          .map((field) => ({
            color: field.color,
            discount: Number(field.discount),
          })),
        watts: data.watts
          .filter((field) => field.value && field.discount !== "")
          .map((field) => ({
            value: Number(field.value),
            discount: Number(field.discount),
          })),
        reflectors: data.reflectors
          .filter((field) => field.color && field.discount !== "")
          .map((field) => ({
            color: field.color,
            discount: Number(field.discount),
          })),
        // Convert other numeric fields
        productPrice: Number(data.productPrice),
        discount: data.discount ? Number(data.discount) : 0,
        discountPrice: data.discountPrice ? Number(data.discountPrice) : 0,
        openingStock: Number(data.openingStock),
        remainingStock: Number(data.remainingStock),
        addedStock: Number(data.addedStock),
      };

      delete payload.file;
      delete payload.image;
      console.log("payload", payload);
      // return;

      let res;
      if (mode === "update" && productId) {
        res = await updateProduct(productId, payload);
      } else {
        res = await createProduct(payload);
      }

      const message = res?.data?.message;
      if (message) {
        toast.success(message);
        router.push("/product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit product data"
      );
    }
  };

  const onError = (errors) => {
    console.log("Form errors:", errors);
  };

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, category: true }));
      const params = {
        type: "all",
      };
      await fetchAllCategory({ params }).then((res) => {
        setCategoryOptions(res?.data?.data);
      });
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading((prev) => ({ ...prev, category: false }));
    }
  };

  const fetchProductReviewData = async (loadMore = false) => {
    if (loadingReviews || !hasMoreReviews) return;

    try {
      setLoadingReviews(true);
      const params = {
        productId,
        page: loadMore ? reviewPagination.page + 1 : 1,
        limit: reviewPagination.pageSize,
      };

      const response = await fetchProductReview({ params });
      if (response && response?.data) {
        const newReviews = response.data.data.review;
        const totalReviews = response.data.data.total;

        setReviewData((prev) =>
          loadMore ? [...prev, ...newReviews] : newReviews
        );

        setReviewPagination((prev) => ({
          ...prev,
          page: params.page,
          total: totalReviews,
        }));

        setHasMoreReviews(
          loadMore
            ? reviewData.length + newReviews.length < totalReviews
            : newReviews.length < totalReviews
        );
      }
    } catch (error) {
      console.log("Error fetching reviews:", error);
      toast.error("Failed to load more reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [mode, productId]);

  useEffect(() => {
    setReviewData([]);
    setReviewPagination((prev) => ({ ...prev, page: 1 }));
    setHasMoreReviews(true);

    if (productId) {
      fetchProductReviewData();
    }
  }, [productId]);

  return (
    <Layout>
      <CommonCard>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Product
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              href="/dashboard"
              color="primary"
              sx={{ textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <Link
              href="/product"
              color="primary"
              sx={{ textDecoration: "none" }}
            >
              Product
            </Link>
            <Typography color="text.primary">Add Product</Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={3}>
          {/* Product Image and Manage Stock - Stacked Grid */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Grid container direction="column" spacing={3}>
              {/* Product Image Grid */}
              <Grid item>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Product Image*
                  </Typography>
                  {!isViewMode && (
                    <>
                      <HiddenInput
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={(ref) => (fileInputRef.current = ref)}
                      />

                      <Box
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleUploadAreaClick}
                        sx={{
                          border: dragActive
                            ? "2px dashed #3ea8ff"
                            : "2px dashed #e0e0e0",
                          borderRadius: "12px",
                          padding: "40px 20px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: dragActive
                            ? "rgba(62, 168, 255, 0.05)"
                            : "transparent",
                          transition: "all 0.3s ease",
                          mb: 2,
                          "&:hover": {
                            borderColor: "#3ea8ff",
                            backgroundColor: "rgba(62, 168, 255, 0.02)",
                          },
                        }}
                      >
                        <CloudUploadIcon
                          sx={{
                            fontSize: 48,
                            color: dragActive ? "#3ea8ff" : "#bdbdbd",
                            transition: "color 0.3s ease",
                          }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            color: dragActive ? "#3ea8ff" : "text.primary",
                            fontWeight: 500,
                          }}
                        >
                          {dragActive
                            ? "Drop your images here"
                            : "Upload Product Images"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          Drag and drop your images here, or click to browse
                        </Typography>

                        <Typography variant="caption" color="textSecondary">
                          Support: JPG, JPEG, PNG (Max 5 images)
                        </Typography>
                      </Box>
                    </>
                  )}
                  {(imageError || errors.image) && (
                    <FormHelperText error sx={{ mb: 2 }}>
                      {imageError || errors.image?.message}
                    </FormHelperText>
                  )}

                  {selectedImages.length > 0 && (
                    <Box>
                      {!isViewMode && (
                        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                          Selected Images ({selectedImages.length}/5):
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedImages.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              width: 80,
                              height: 80,
                              border: "1px solid #e0e0e0",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              onClick={() => handleImageClick(image)}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                            />
                            {!isViewMode && (
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  },
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  <Dialog
                    open={previewOpen}
                    onClose={handleClosePreview}
                    maxWidth="md"
                    fullWidth
                  >
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        onClick={handleClosePreview}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <img
                        src={previewImage}
                        alt="Large Preview"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          maxHeight: "90vh",
                          objectFit: "contain",
                          margin: "0 auto",
                        }}
                      />
                    </Box>
                  </Dialog>
                </Paper>
              </Grid>

              {/* Manage Stock Grid */}
              <Grid item>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Manage Stock
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 12 }}>
                      <Typography variant="body2" gutterBottom>
                        Opening Stock
                      </Typography>
                      <Controller
                        name="openingStock"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter opening stock"
                            variant="outlined"
                            size="small"
                            error={!!errors.openingStock}
                            helperText={errors.openingStock?.message}
                            disabled={isViewMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 12 }}>
                      <Typography variant="body2" gutterBottom>
                        Remaining stock
                      </Typography>
                      <Controller
                        name="remainingStock"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter remaining stock"
                            variant="outlined"
                            size="small"
                            error={!!errors.remainingStock}
                            helperText={errors.remainingStock?.message}
                            disabled={isViewMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item size={{ xs: 6, md: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Discount
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          (optional)
                        </Typography>
                      </Typography>
                      <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="0"
                            variant="outlined"
                            size="small"
                            error={!!errors.discount}
                            helperText={errors.discount?.message}
                            disabled={isViewMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item size={{ xs: 6, md: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Discount Price
                      </Typography>
                      <Controller
                        name="discountPrice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="0"
                            variant="outlined"
                            size="small"
                            error={!!errors.discountPrice}
                            disabled={isViewMode}
                            helperText={errors.discountPrice?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {isViewMode && (
                <>
                  <Grid item>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Product Rating
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Rating
                          value={rating}
                          precision={0.5}
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} />}
                          sx={{
                            "&.Mui-disabled": {
                              opacity: 1,
                            },
                            "& .MuiRating-iconEmpty": {
                              opacity: 0.55,
                            },
                          }}
                          disabled={isViewMode}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Product Reviews
                      </Typography>

                      {reviewData.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          No reviews yet
                        </Typography>
                      ) : (
                        <>
                          <Box
                            sx={{
                              maxHeight: 860,
                              overflowY: "auto",
                            }}
                            onScroll={handleScroll}
                          >
                            {reviewData?.map((review, index) => (
                              <Box
                                key={review.id}
                                sx={{
                                  mb: 3,
                                  p: 2,
                                  borderBottom:
                                    index < reviewData.length - 1
                                      ? "1px solid #f0f0f0"
                                      : "none",
                                }}
                              >
                                <Box sx={{ display: "flex", gap: 2 }}>
                                  <Box
                                    sx={{
                                      width: 56,
                                      height: 56,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {review?.user?.image ? (
                                      <img
                                        src={review?.user?.image}
                                        alt={review.user?.firstName}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          borderRadius: "50%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <Box
                                        sx={{
                                          width: "100%",
                                          height: "100%",
                                          borderRadius: "50%",
                                          bgcolor: "#e0e0e0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Typography variant="body2">
                                          {review.user?.firstName?.charAt(0)}
                                          {review.user?.lastName?.charAt(0)}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>

                                  <Box sx={{ flex: 1 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={500}
                                      >
                                        {review.user?.firstName}{" "}
                                        {review.user?.lastName}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        {new Date(
                                          review?.createdAt
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Rating
                                        value={review.rating}
                                        precision={0.5}
                                        emptyIcon={
                                          <StarIcon style={{ opacity: 0.55 }} />
                                        }
                                        sx={{
                                          "&.Mui-disabled": {
                                            opacity: 1,
                                          },
                                          "& .MuiRating-iconEmpty": {
                                            opacity: 0.55,
                                          },
                                        }}
                                        disabled={isViewMode}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ ml: 1 }}
                                      >
                                        {review.rating.toFixed(1)}
                                      </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      {review.reviewText}
                                    </Typography>

                                    {review.reviewImage && (
                                      <Box sx={{ mt: 1 }}>
                                        <img
                                          src={review.reviewImage}
                                          alt="Review"
                                          style={{
                                            maxWidth: "100%",
                                            maxHeight: 150,
                                            borderRadius: 4,
                                            objectFit: "cover",
                                          }}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            ))}

                            {loadingReviews && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  py: 2,
                                }}
                              >
                                <CircularProgress size={24} />
                              </Box>
                            )}

                            {!hasMoreReviews && reviewData.length > 0 && (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ textAlign: "center", py: 2 }}
                              >
                                No more reviews to show
                              </Typography>
                            )}
                          </Box>
                        </>
                      )}
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          {/* General Information - Long Grid */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                General Information
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Product name*
                  </Typography>
                  <Controller
                    name="productName"
                    control={control}
                    render={({ field }) => (
                      <CommonInput
                        {...field}
                        fullWidth
                        placeholder="Enter product name"
                        variant="outlined"
                        error={!!errors.productName}
                        helperText={errors.productName?.message}
                        disabled={isViewMode}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Product Category*
                  </Typography>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        placeholder="Enter product category"
                        variant="outlined"
                        size="small"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                        disabled={isViewMode}
                      >
                        {loading?.category ? (
                          <MenuItem disabled>Loading category...</MenuItem>
                        ) : (
                          categoryOptions?.length > 0 &&
                          categoryOptions?.map((category) => (
                            <MenuItem key={category.name} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Product Price*
                  </Typography>
                  <Controller
                    name="productPrice"
                    control={control}
                    render={({ field }) => (
                      <CommonInput
                        {...field}
                        fullWidth
                        type="number"
                        placeholder="Enter product price"
                        variant="outlined"
                        error={!!errors.productPrice}
                        helperText={errors.productPrice?.message}
                        disabled={isViewMode}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Added Stock*
                  </Typography>
                  <Controller
                    name="addedStock"
                    control={control}
                    render={({ field }) => (
                      <CommonInput
                        {...field}
                        fullWidth
                        type="number"
                        placeholder="Enter Added Stock"
                        variant="outlined"
                        error={!!errors.addedStock}
                        helperText={errors.addedStock?.message}
                        disabled={isViewMode}
                      />
                    )}
                  />
                </Box>

                <Typography variant="body2">
                  LED Color & Discount Percentage
                </Typography>
                <DynamicFieldSection
                  fields={ledColorFields}
                  fieldName="ledColors"
                  fieldKey="color"
                  label1="Color"
                  label2="Percentage (%)"
                  placeholder1="Color"
                  placeholder2="0"
                  type1="text"
                  type2="number"
                  // onAdd={() => appendLedColor({ color: "", discount: 0 })}
                  onAdd={(newField) => {
                    appendLedColor(newField);
                    setTimeout(() => {}, 0);
                  }}
                  onRemove={removeLedColor}
                  errors={errors}
                  showColorPalette={true}
                  control={control}
                  isViewMode={isViewMode}
                />

                <Typography variant="body2" gutterBottom>
                  Body color & Discount Percentage
                </Typography>

                <DynamicFieldSection
                  fields={bodyColorFields}
                  fieldName="bodyColors"
                  fieldKey="color"
                  label1="Color"
                  label2="Percentage (%)"
                  placeholder1="Color"
                  placeholder2="0"
                  type1="text"
                  type2="number"
                  // onAdd={() => appendBodyColor({ color: "", discount: 0 })}
                  onAdd={(newField) => {
                    appendBodyColor(newField);
                    setTimeout(() => {}, 0);
                  }}
                  onRemove={removeBodyColor}
                  errors={errors}
                  showColorPalette={true}
                  control={control}
                  isViewMode={isViewMode}
                />

                <Typography variant="body2" gutterBottom>
                  Watts & Discount Percentage
                </Typography>
                <DynamicFieldSection
                  fields={wattsFields}
                  fieldName="watts"
                  fieldKey="value"
                  label1="Watts"
                  label2="Percentage (%)"
                  placeholder1="0"
                  placeholder2="0"
                  type1="number"
                  type2="number"
                  onAdd={() => appendWatts({ value: "", discount: 0 })}
                  onRemove={removeWatts}
                  errors={errors}
                  control={control}
                  isViewMode={isViewMode}
                />

                <Typography variant="body2" gutterBottom>
                  Reflector & Discount Percentage
                </Typography>
                <DynamicFieldSection
                  fields={reflectorFields}
                  fieldName="reflectors"
                  fieldKey="color"
                  label1="Color"
                  label2="Percentage (%)"
                  placeholder1="Color"
                  placeholder2="0"
                  type1="text"
                  type2="number"
                  // onAdd={() => appendReflector({ value: "", discount: 0 })}
                  onAdd={(newField) => {
                    appendReflector(newField);
                    setTimeout(() => {}, 0);
                  }}
                  onRemove={removeReflector}
                  errors={errors}
                  showColorPalette={true}
                  control={control}
                  isViewMode={isViewMode}
                />

                <Box>
                  <Typography mb={1} variant="body2" gutterBottom>
                    Product Description
                  </Typography>
                  <Controller
                    name="productDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                        placeholder="Description"
                        variant="outlined"
                        error={!!errors.productDescription}
                        helperText={errors.productDescription?.message}
                        disabled={isViewMode}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "auto",
                            overflow: "auto",
                            alignItems: "flex-start",
                          },
                          "& .MuiInputBase-inputMultiline": {
                            height: "auto !important",
                            minHeight: "96px",
                            maxHeight: "192px",
                            padding: 0,
                            lineHeight: "1.5",
                            overflow: "auto !important",
                          },
                          "& textarea": {
                            resize: "vertical",
                            overflow: "auto !important",
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            mb: 3,
            borderTop: "1px solid #f0f0f0",
            pt: 2,
          }}
        >
          <CommonButton
            text={isViewMode ? "Back" : "Cancel"}
            variant="outlined"
            onClick={() => router.push("/product")}
            sx={{
              px: 4,
              py: 1,
              mr: 2,
              textTransform: "none",
              fontSize: "16px",
            }}
          />
          {!isViewMode && (
            <CommonButton
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit, onError)}
              sx={{
                px: 4,
                py: 1,
                textTransform: "none",
                fontSize: "16px",
              }}
              isLoading={isSubmitting}
            />
          )}
        </Box>
      </CommonCard>
    </Layout>
  );
};
export default ProductForm;
