import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { getAllProduct } from "@/src/api";
import { getUID, setUID } from "@/src/utils/helper";
import Product from "@/src/components/product/Product";
import CircularProgress from "@mui/material/CircularProgress";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let currency = useSelector(state => state.content.currency);
  let tagline = useSelector(state => state.content.brand_data?.tagline);

  useEffect(() => {
    fetchUID();
    fetchAllProduct();
  }, []);

  const fetchUID = () => {
    if (getUID() === null) {
      setUID();
    }
  };

  const fetchAllProduct = async () => {
    getAllProduct()
      .then((res) => {
        if (res) {
          setIsLoading(false);
          setData(res.data.products);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Premium Shoes Store`}>
      <Typography
        fontWeight="bold"
        fontSize={{ lg: 34, md: 34, sm: 30, xs: 25 }}
        textAlign="center"
        mt={4}
      >
        BEST SELLING PRODUCTS
      </Typography>
      <Box mt={2}>
        {data?.length > 0 ? (
          <Product data={data} currency={currency} />
        ) : (
          <Stack
            spacing={2}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Typography color="grey" fontSize={20}>
              No Product Available!
            </Typography>
            {isLoading && <CircularProgress color="success" />}
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default Dashboard;
