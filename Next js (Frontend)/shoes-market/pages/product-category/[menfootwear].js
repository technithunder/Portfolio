import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@/src/components/Button";
import { styled } from "@mui/material";
import { useRouter } from "next/router";
import { getProducts } from "@/src/api";
import { select_data } from "@/src/utils/data";
import Image from "next/image";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";
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

const MenFootwear = () => {
  const [data, setData] = useState();
  const [productSorting, setProductSorting] = useState("default");
  const [pageCount, setPageCount] = useState(1);
  const router = useRouter();

  let currency = useSelector((state) => state.content.currency);
  let tagline = useSelector((state) => state.content.brand_data?.tagline);

  useEffect(() => {
    sortProducts();
  }, [pageCount, productSorting, router.query.menfootwear]);

  const sortProducts = () => {
    getProducts(router.query.menfootwear, {
      offset: pageCount,
      limit: 10,
      sort: productSorting,
    })
      .then((res) => setData(res.data))
      .catch((e) => console.log(e));
  };

  const handleChange = (event, value) => {
    setPageCount(value);
    window.scroll(0, 0);
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Category`}>
      <Box>
        <FormControl
          sx={{
            Width: "20%",
            ml: 2,
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Select
            size="small"
            value={productSorting}
            onChange={(e) => setProductSorting(e.target.value)}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
          >
            {select_data?.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2} p={2}>
          <Grid container spacing={4}>
            {data?.products.map((item, index) => {
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
                      priority
                    />
                    <Typography
                      fontSize={18}
                      textAlign="center"
                      fontWeight={700}
                    >
                      {item.title}
                    </Typography>
                  </View>
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
                  <Link href={`/product/${item.id}`}>
                    <Button>Select options</Button>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Pagination
          page={pageCount}
          onChange={handleChange}
          count={data?.pages}
          size="small"
          sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
        />
      </Box>
    </Layout>
  );
};

export default MenFootwear;
