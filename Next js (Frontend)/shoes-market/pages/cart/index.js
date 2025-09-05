import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import TableContainer from "@mui/material/TableContainer";
import Button from "@/src/components/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material";
import { useRouter } from "next/router";
import { deleteProduct, fetchCartProduct, updateProduct } from "@/src/api";
import { defineCustomSlots, getUID } from "@/src/utils/helper";
import { removeSlot } from "@/src/components/AdSlot/lib-dfp-index";
import AdSlot from "@/src/components/AdSlot";
import styles2 from "@/styles/components/Checkout.module.scss";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

const Alert = styled(Box)`
  margin-top: 20px;
  padding: 12px 30px 12px 30px;
  border-top: 3px solid #9dff20;
  background-color: lightgrey;
`;

const cart = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [cartAlert, setCartAlert] = useState(false);

  let adsData = useSelector((state) => state.content.content);
  let currency = useSelector((state) => state.content.currency);
  let tagline = useSelector((state) => state.content.brand_data?.tagline);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (isEmpty(adsData)) {
      const { desktop_ads_6, tablet_ads_6, mobile_ads_6 } = adsData;
      defineCustomSlots(desktop_ads_6);
      defineCustomSlots(tablet_ads_6);
      defineCustomSlots(mobile_ads_6);
    }
    router.events.on("routeChangeComplete", removeSlot);
    return () => {
      router.events.off("routeChangeComplete", removeSlot);
    };
  }, [adsData]);

  const fetchProduct = () => {
    fetchCartProduct({ userId: getUID() })
      .then((res) => {
        setData(res.data.cartProducts), setTotal(res.data.total);
      })
      .catch((e) => console.log(e));
  };

  const onClose = (id) => {
    deleteProduct(id)
      .then((res) => {
        fetchProduct();
      })
      .catch((e) => console.log(e));
  };

  const updateCart = () => {
    let tempArray = [];
    data.forEach((item, index) => {
      tempArray.push({ ...item, subTotal: item.price * item.quantity });
    });
    updateProduct({ product: tempArray })
      .then((res) => {
        if (res) {
          setCartAlert(true);
          fetchProduct();
        }
      })
      .catch((e) => console.log(e));
  };

  const handleChange = (e, i, item) => {
    const { value, name } = e.target;
    const tempArray = [...data];
    tempArray[i] = {
      ...tempArray[i],
      [name]: parseInt(value),
    };
    setData(tempArray);
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Cart`}>
      <Container>
        <Typography mt={5} variant="h3">
          Cart
        </Typography>
        <Box>
          <div className={styles2.desktopAds}>
            {/* desktopAds4 input the code */}
            <AdSlot id={"cart-ad-banner"} />
          </div>
          <div className={styles2.tabletAds}>
            {/* tabletAds4 input the code */}
            <AdSlot id={"cart-ad-banner1"} />
          </div>
          <div className={styles2.mobileAds}>
            {/* mobileAds4 input the code */} 
            <AdSlot id={"cart-ad-banner2"} />
          </div>
        </Box>
        {cartAlert && (
          <Alert mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CheckIcon />
              <Typography>Cart updated</Typography>
            </Stack>
          </Alert>
        )}
        {data?.length > 0 ? (
          <Box>
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width="70%" colSpan={3}>
                      Product
                    </TableCell>
                    <TableCell align="center" width="10%">
                      Price
                    </TableCell>
                    <TableCell align="center" width="10%">
                      Quantity
                    </TableCell>
                    <TableCell align="center" width="10%">
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell width="5%">
                          <IconButton
                            onClick={() => onClose(item?.id)}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center" width="15%">
                          <Image
                            src={item?.product?.image[0]}
                            alt="img"
                            height={100}
                            width={100}
                            priority
                          />
                        </TableCell>
                        <TableCell width="50%">
                          <Link
                            href={`/product/${item?.product?.id}`}
                            style={{ color: "green" }}
                          >
                            <Typography>{item?.product?.title}</Typography>
                          </Link>
                          <Typography mt={1}>Size: {item?.size}</Typography>
                          {item.attribute !== "0" && (
                            <Typography mt={1}>
                              color: {item?.attribute}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center" width="10%">
                          <Typography>
                            {currency}
                            {Number(item?.price).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" width="10%">
                          <input
                            type="number"
                            style={{
                              width: "50px",
                              padding: "12px",
                              fontSize: "16px",
                            }}
                            min={1}
                            name="quantity"
                            value={item?.quantity}
                            onChange={(e) => handleChange(e, index, item)}
                          />
                        </TableCell>
                        <TableCell align="center" width="10%">
                          <Typography>
                            {currency}
                            {Number(item?.subTotal).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container mt={5}>
              <Grid item ml="auto">
                <Button onClick={updateCart}>Update Cart</Button>
              </Grid>
            </Grid>
            <Grid container mt={5} spacing={2} xl={3} lg={3} md={4} sm={5}>
              <Grid item xs={12}>
                <Typography variant="h6">CART TOTALS</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    {currency}
                    {parseFloat(total).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Total:</Typography>
                  <Typography variant="body2">
                    {currency}
                    {parseFloat(total).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Link href="/checkout">
                  <Button>Proceed to checkout</Button>
                </Link>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box mt={2}>
            <Alert>Your Cart is empty</Alert>
            <Link href="/">
              <Button sx={{ mt: 6 }}>
                Return to shop
              </Button>
            </Link>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default cart;
