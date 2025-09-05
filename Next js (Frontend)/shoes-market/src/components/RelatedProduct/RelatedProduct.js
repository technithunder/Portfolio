import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image"
import Link from "next/link";

const Button = styled(Box)`
  padding: 20px 30px 20px 30px;
  background-color: #9dff20;
  cursor: pointer;
  margin-top: auto;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const RelatedProduct = ({ data, currency }) => {
  const router = useRouter();
  return (
    <Box>
      <Typography fontWeight={500} fontSize={{ md: 34, sm: 34, xs: 30 }}>
        Related Products
      </Typography>
      <Box mt={4}>
        <Grid container spacing={3}>
          {data?.map((item, index) => {
            return (
              <Grid item md={4} lg={3} sm={6} xs={12} key={index}>
                <Box
                  component={Link}
                  href={`/product/${item.id}`}
                  sx={{
                    p: 2,
                    minHeight: "100%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Badge
                    sx={{ cursor: "pointer", width: '100%' }}
                    badgeContent={
                      <span
                        style={{
                          padding: "20px 12px",
                          backgroundColor: "#f6f6f6",
                          borderRadius: "50%",
                        }}
                      >
                        Sale!
                      </span>
                    }
                  >
                    <Image
                      src={item?.image[0]}
                      alt="product_img"
                      height={0}
                      width={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
					  priority
                    />
                  </Badge>
                  <Typography mt={1} width="auto" textAlign="center">
                    {item?.title}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Typography sx={{ textDecoration: "line-through" }}>
                      {currency}
                      {Number(item?.productPrice).toFixed(2)}
                    </Typography>
                    <Typography>
                      {currency}
                      {Number(item?.salePrice).toFixed(2)}
                    </Typography>
                  </Box>
                  <Button>Select Options</Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default RelatedProduct;
