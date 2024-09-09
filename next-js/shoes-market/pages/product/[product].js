import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styles from "@/styles/components/Product.module.scss";
import ProductInfo from "@/src/components/ProductInfo/ProductInfo";
import RelatedProduct from "@/src/components/RelatedProduct/RelatedProduct";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@/src/components/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material";
import { addProduct, fetchProduct, relatedProduct } from "@/src/api";
import { defineCustomSlots, getUID } from "@/src/utils/helper";
import ImageCarouselZoom from "@/src/components/carousel/ImageCarouselZoom";
import { removeSlot } from "@/src/components/AdSlot/lib-dfp-index";
import AdSlot from "@/src/components/AdSlot";
import styles2 from "@/styles/components/Checkout.module.scss";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

const Alert = styled(Box)`
  margin-top: 20px;
  padding: 10px 30px 10px 30px;
  border-top: 3px solid #9dff20;
  background-color: lightgrey;
`;

const Product = () => {
  const [data, setData] = useState();
  const [sizeList, setSizeList] = useState("Choose an option");
  const [itemCount, setItemCount] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectColor, setSelectColor] = useState("Choose an color");
  const router = useRouter();
  const { product } = router.query;
  let adsData = useSelector((state) => state.content.content);
  let currency = useSelector((state) => state.content.currency);

  useEffect(() => {
    fetchOneProduct();
    fetchAllProduct();
  }, [product]);

  useEffect(() => {
    if (isEmpty(adsData)) {
      const {
        desktop_ads_4,
        tablet_ads_4,
        mobile_ads_4,
        desktop_ads_5,
        tablet_ads_5,
        mobile_ads_5,
      } = adsData;
      defineCustomSlots(desktop_ads_4);
      defineCustomSlots(tablet_ads_4);
      defineCustomSlots(mobile_ads_4);

      defineCustomSlots(desktop_ads_5);
      defineCustomSlots(tablet_ads_5);
      defineCustomSlots(mobile_ads_5);
    }
    router.events.on("routeChangeComplete", removeSlot);
    return () => {
      router.events.off("routeChangeComplete", removeSlot);
    };
  }, [adsData]);

  const fetchOneProduct = () => {
    fetchProduct({ id: parseInt(product), popularity: 1 })
      .then((res) => {
        if (res) {
          setData(res.data.product);
          setAttributes(res.data.product.attribute);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchAllProduct = () => {
    relatedProduct()
      .then((res) => setRelatedProductData(res.data.relatedProducts))
      .catch((e) => console.log(e));
  };

  const handleCart = () => {
    let obj = {
      productId: data?.id,
      quantity: parseInt(itemCount),
      size: sizeList,
      price: data?.salePrice,
      userId: getUID(),
      uniqueId: new Date().getTime(),
      attribute: selectColor !== "Choose an color" && selectColor,
    };
    addProduct(obj)
      .then((res) => {
        setShowCartModal(true);
        window.scrollTo(0, 0);
        setSizeList("Choose an option");
        setSelectColor("Choose an color");
      })
      .catch((e) => console.log(e));
  };

  const size = useMemo(() => {
    let string = "Choose an option";
    let newArray = [string].concat(data?.size);
    return newArray;
  }, [data]);

  const color = useMemo(() => {
    let string = "Choose an color";
    let newArray = [string].concat(attributes);
    return newArray;
  }, [attributes]);

  return (
    <Layout headTitle={data?.title}>
      <Container>
        <Box mt={3} mb={3}>
          <Typography>
            <Link href="/">
              <span className={styles.link}>Home</span>
            </Link>
            / <span className={styles.link}>Men Footwear</span> / {data?.title}
          </Typography>
        </Box>
        {showCartModal && (
          <Alert>
            <Grid container spacing={2} alignItems="center">
              <Grid item lg={10} md={9} sm={9} xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckIcon />
                  <Typography>{data?.title}</Typography>
                </Stack>
              </Grid>
              <Grid item lg={2} md={3} sm={3} xs={12}>
                <Box>
                  <Link href="/cart">
                    <Button
                      sx={{
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      View Cart
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Alert>
        )}
        <Box mt={2}>
          <Grid container spacing={4}>
            <Grid item marginX="auto" xs={12} lg={6} md={12} sm={12}>
              <ImageCarouselZoom data={data} />
            </Grid>
            <Grid item xs={12} lg={6} md={12} sm={12}>
              <Typography fontSize={{ md: 36, sm: 32, xs: 23 }}>
                {data?.title}
              </Typography>
              <Box mt={3} gap={2} display="flex" flexWrap="wrap">
                <Typography
                  sx={{ textDecoration: "line-through" }}
                  fontSize={{ md: 34, sm: 30, xs: 21 }}
                >
                  {currency}
                  {Number(data?.productPrice).toFixed(2)}
                </Typography>
                <Typography fontSize={{ md: 34, sm: 30, xs: 21 }}>
                  {currency}
                  {Number(data?.salePrice).toFixed(2)}
                </Typography>
              </Box>
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <Typography fontSize={16} fontWeight={600}>
                  Size
                </Typography>
                <Select
                  value={sizeList}
                  onChange={(e) => setSizeList(e.target.value)}
                  sx={{ width: 200 }}
                >
                  {size?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                {sizeList !== "Choose an option" && (
                  <Typography
                    color="#000"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setSizeList("Choose an option")}
                  >
                    Clear
                  </Typography>
                )}
              </Box>
              {attributes?.length > 0 && (
                <Box
                  mt={3}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Typography fontSize={16} fontWeight={600}>
                    color
                  </Typography>
                  <Select
                    value={selectColor}
                    onChange={(e) => setSelectColor(e.target.value)}
                    sx={{ width: 200 }}
                  >
                    {color.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  {selectColor !== "Choose an color" && (
                    <Link
                      color="#000"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelectColor("Choose an color")}
                    >
                      Clear
                    </Link>
                  )}
                </Box>
              )}
              <Box
                mt={2}
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                gap={2}
              >
                <input
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  type="number"
                  min={1}
                  name="itemCount"
                  style={{
                    width: "100px",
                    padding: "14px",
                    fontSize: "16px",
                  }}
                />
                <Button
                  disabled={
                    sizeList === "Choose an option" ||
                    (attributes.length > 0 && selectColor === "Choose an color")
                  }
                  onClick={handleCart}
                  sx={{ p: 2 }}
                >
                  Add to cart
                </Button>
              </Box>
              <Typography mt={3}>
                SKU: {data?.skuId}&nbsp;Category:
                <Link href={`/product-category/${data?.category}`}>
                  <span className={styles.link}>{data?.category}</span>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <div className={styles2.desktopAds}>
            {/* desktopAds4 input the code */}
            <AdSlot id={"div-gpt-ad-1690176590535-0"} />
          </div>
          <div className={styles2.tabletAds}>
            {/* tabletAds4 input the code */}
            <AdSlot id={"before-desc-ad-banner1"} />
          </div>
          <div className={styles2.mobileAds}>
            {/* mobileAds4 input the code */} 
            <AdSlot id={"before-desc-ad-banner2"} />
          </div>
        </Box>
        <Box mt={5}>
          <ProductInfo data={data} />
        </Box>
        <Box>
          <div className={styles2.desktopAds}>
            {/* desktopAds4 input the code */}
            <AdSlot id={"after-desc-ad-banner"} />
          </div>
          <div className={styles2.tabletAds}>
            {/* tabletAds4 input the code */}
            <AdSlot id={"after-desc-ad-banner1"} />
          </div>
          <div className={styles2.mobileAds}>
            {/* mobileAds4 input the code */} 
            <AdSlot id={"after-desc-ad-banner2"} />
          </div>
        </Box>
        <Box mt={8}>
          <RelatedProduct data={relatedProductData} currency={currency} />
        </Box>
      </Container>
    </Layout>
  );
};

export default Product;
