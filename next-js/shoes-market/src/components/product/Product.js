import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const View = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-decoration: underline;
  gap: 16px;
  &:hover {
    text-decoration: none;
  }
`;

const Product = ({ data, currency }) => {
  const router = useRouter();
  return (
    <Box>
      <Grid container spacing={4}>
        {data?.map((item, index) => {
          return (
            <Grid
              item
              flexDirection="column"
              gap={2}
              alignItems="center"
              display="flex"
              justifyContent="center"
              xs={12}
              key={index}
            >
              <View component={Link} href={`/product/${item.id}`}>
                <Image
                  src={item.image[0]}
                  alt="img"
                  height={0}
                  width={0}
                  sizes="100vw"
                  style={{ height: "400px", width: "400px" }}
                  priority={false}
                />
                <Typography
                  fontSize={{ lg: 18, md: 18, sm: 18, xs: 16 }}
                  sx={{
                    wordBreak: "break-word",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                  textAlign="center"
                  fontWeight={700}
                >
                  {item.title}
                </Typography>
              </View>
              <Typography
                variant="span"
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                SALE
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  sx={{ textDecorationLine: "line-through" }}
                  fontSize={18}
                >
                  {currency}
                  {Number(item.productPrice).toFixed(2)}
                </Typography>
                <Typography fontSize={18}>
                  {currency}
                  {Number(item.salePrice).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Product;
