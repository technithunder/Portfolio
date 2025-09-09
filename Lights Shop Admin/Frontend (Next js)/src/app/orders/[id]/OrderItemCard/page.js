import { Box, Grid, Paper, Typography, Divider, Rating } from "@mui/material";

const OrderItemDetail = ({ label, value }) => (
  <Typography
    sx={{
      color: "#9D9D9D",
      fontSize: "16px",
      fontWeight: 500,
    }}
  >
    {`${label} : ${value}`}
  </Typography>
);

const OrderItemCard = ({ item, isLast, productImages }) => {
  const details = [
    { label: "Led Color", value: item?.ledcolors || "N/A" },
    { label: "Body Color", value: item?.bodycolors || "N/A" },
    { label: "Reflectors", value: item?.reflectors || "N/A" },
    { label: "Watts", value: item?.watts || "N/A" },
    { label: "Quantity", value: item?.quantity || "N/A" },
    {
      label: "Unit Price",
      value:
        item?.unitPrice != null
          ? `₹ ${item.unitPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "N/A",
    },
    {
      label: "Total Price",
      value:
        item?.totalPrice != null
          ? `₹ ${item.totalPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "N/A",
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item size={{ xs: 12, sm: 4, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              overflow: "hidden",
              aspectRatio: "1/1",
              position: "relative",
              backgroundColor: "#fafafa",
              maxWidth: 200,
            }}
          >
            <Box
              component="img"
              src={item?.image?.[0] || productImages?.default}
              alt={item.productName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, sm: 8, md: 9 }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{
                color: "#333843",
                fontSize: "20px",
                mb: 1.5,
              }}
            >
              {item.productName}
            </Typography>

            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {details.slice(0, 4).map((detail, idx) => (
                    <OrderItemDetail
                      key={idx}
                      label={detail.label}
                      value={detail.value}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {details.slice(4).map((detail, idx) => (
                    <OrderItemDetail
                      key={idx + 4}
                      label={detail.label}
                      value={detail.value}
                    />
                  ))}
                  <Typography
                    sx={{
                      color: "#9D9D9D",
                      fontSize: "16px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    Rating :
                    <Rating
                      value={item?.rating || 0}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#ffc107",
                        },
                      }}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {!isLast && <Divider sx={{ mt: 3, width: "100%" }} />}
    </Box>
  );
};

export default OrderItemCard;
