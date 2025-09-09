"use client";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef, useState } from "react";

const PaymentSummary = ({
  orderData,
  shippingFee = 500,
  formatCurrency,
  onPaymentProofUpload,
}) => {
  const orderTotal = (orderData?.totalAmount || 0) + shippingFee;
  const paymentProofUrl = orderData?.orderPayment;
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "payment-proof.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files[0]) return;
    const file = fileInputRef.current.files[0];

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result.split(",")[1];
        const fileType = file.type;

        try {
          if (onPaymentProofUpload) {
            await onPaymentProofUpload(base64String, fileType);
            setPreviewImage(null);
          }
        } catch (error) {
          console.error("Error uploading payment proof:", error);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Error processing file:", error);
      setIsUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        mb: 1,
      }}
    >
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
        Payment Summary
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Order Subtotal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {formatCurrency(orderData?.totalAmount)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Shipping Fees
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {formatCurrency(shippingFee)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1" color="text.secondary">
          Order Total
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {formatCurrency(orderTotal)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
          Proof Of Payment
        </Typography>
        {/* 
        {paymentProofUrl && (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 300,
                height: 200,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <img
                src={paymentProofUrl}
                alt="Payment proof"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleDownload(paymentProofUrl)}
                color="primary"
                aria-label="download proof"
              >
                <DownloadIcon />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Download
                </Typography>
              </IconButton>

              <IconButton
                onClick={() => handleView(paymentProofUrl)}
                color="primary"
                aria-label="view proof"
              >
                <VisibilityIcon />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  View
                </Typography>
              </IconButton>
            </Box>
          </>
        )}

        {!paymentProofUrl && (
          <Typography variant="body2" color="text.secondary">
            No payment proof uploaded
          </Typography>
        )} */}

        {paymentProofUrl ? (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 300,
                height: 200,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <img
                src={paymentProofUrl}
                alt="Payment proof"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleDownload(paymentProofUrl)}
                color="primary"
                aria-label="download proof"
              >
                <DownloadIcon />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Download
                </Typography>
              </IconButton>

              <IconButton
                onClick={() => handleView(paymentProofUrl)}
                color="primary"
                aria-label="view proof"
              >
                <VisibilityIcon />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  View
                </Typography>
              </IconButton>
            </Box>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-payment-proof"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            {previewImage ? (
              <>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 300,
                    height: 200,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Payment proof preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isUploading}
                    startIcon={<CloudUploadIcon />}
                  >
                    {isUploading ? "Uploading..." : "Confirm Upload"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelPreview}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <label htmlFor="upload-payment-proof">
                  <Button
                    variant="contained"
                    // color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      bgcolor: "#00ABDC",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#00ABDC",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Upload Payment Photo
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  Please upload a clear photo of your payment receipt
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default PaymentSummary;
