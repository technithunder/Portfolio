"use client";
import CommonDialog from "@/components/CommonDialog";
import {
  Box,
  Button,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const ProductReview = ({ open, handleClose, productId, orderId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;

    if (uploadedImages.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    const newImages = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} exceeds 5MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
        });

        // When all images are processed, update state
        if (newImages.length === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write your review");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64 strings
      const imagePromises = uploadedImages.map((img) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
          };
          reader.readAsDataURL(img.file);
        });
      });

      const imageBase64Strings = await Promise.all(imagePromises);

      const payload = {
        productId,
        orderId,
        rating,
        comment: reviewText,
        images: imageBase64Strings,
      };

      const response = await createProductReview(payload);

      if (response?.data) {
        toast.success("Review submitted successfully!");
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setUploadedImages([]);
  };

  return (
    <CommonDialog
      heading={<span>How was the item?</span>}
      open={open}
      handleClose={handleClose}
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
        <Box sx={{ p: 3 }}>
          {/* Rating Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              How would you rate this product?
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#ffc107",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#ffc107",
                  },
                }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  {rating > 0
                    ? `${rating} star${rating > 1 ? "s" : ""}`
                    : "No rating"}
                </Typography>
                {/* {rating > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {getRatingLabel(rating)}
                  </Typography>
                )} */}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Review Text Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Write your review
            </Typography>
            <TextField
              multiline
              fullWidth
              // rows={4}
              placeholder="Share your thoughts about this product. What did you like or dislike? How did it meet your expectations?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              inputProps={{
                maxLength: 500,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {reviewText.length}/500 characters
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Photo Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Share photos (optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Help other customers by sharing photos of your purchase
            </Typography>

            {/* Upload Area */}
            <Paper
              elevation={0}
              sx={{
                border: "2px dashed #e0e0e0",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                mb: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#00ABDC",
                  bgcolor: "#f0f8ff",
                },
              }}
              onClick={() => document.getElementById("photo-upload").click()}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: "#00ABDC",
                  mb: 1,
                }}
              />
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Click to upload photos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPG, JPEG, PNG up to 5MB each (max 5 photos)
              </Typography>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </Paper>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploaded Photos ({uploadedImages.length}/5)
                </Typography>
                <Grid container spacing={2}>
                  {uploadedImages.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                      <Paper
                        elevation={1}
                        sx={{
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          aspectRatio: "1/1",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(image.id)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            width: 24,
                            height: 24,
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.9)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ borderColor: "#e0e0e0", color: "#666", borderRadius: 2 }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              bgcolor: "#00ABDC",
              "&:hover": { bgcolor: "#00ABDC" },
              minWidth: 120,
            }}
            onClick={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </DialogContentText>
    </CommonDialog>
  );
};

export default ProductReview;
