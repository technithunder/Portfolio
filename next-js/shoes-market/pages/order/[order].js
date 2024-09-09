import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import styles from "@/styles/components/Checkout.module.scss";
import AdSlot from "@/src/components/AdSlot";
import styles2 from "@/styles/components/Checkout.module.scss";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { getOrder } from "@/src/api";
import { defineCustomSlots } from "@/src/utils/helper";
import { removeSlot } from "@/src/components/AdSlot/lib-dfp-index";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

const order = () => {
  const router = useRouter();
  const [data, setData] = useState({
    id: "",
    date: "",
    paymentMethod: "",
    total: 0,
    notes: "",
  });
  const [orderProduct, setOrderProduct] = useState([]);

  let adsData = useSelector(state => state.content.content);
  let currency = useSelector(state => state.content.currency);
  let tagline = useSelector(state => state.content.brand_data?.tagline);

  useEffect(() => {
    fetchOrder();
  }, [router?.query.order]);

  useEffect(() => {
    if (isEmpty(adsData)) {
      const { desktop_ads_1, tablet_ads_1, mobile_ads_1 } = adsData;
      defineCustomSlots(desktop_ads_1);
      defineCustomSlots(tablet_ads_1);
      defineCustomSlots(mobile_ads_1);
    }
    router.events.on("routeChangeComplete", removeSlot);
    return () => {
      router.events.off("routeChangeComplete", removeSlot);
    };
  }, [adsData]);

  const fetchOrder = () => {
    getOrder(router?.query.order)
      .then((res) => {
        if (res) {
          setData({
            id: res?.data.order.id,
            date: moment(res?.data.order?.createdAt).format("DD/MM/YYYY"),
            paymentMethod: res?.data.order.paymentMethod,
            total: res?.data.order.total,
            notes: res?.data.order.notes,
            trackingId: res?.data.order.trackingId,
          });
          setOrderProduct(JSON.parse(res?.data.order.product));
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Thank you`}>
      <Container>
        <Typography
          mt={4}
          textAlign="center"
          fontSize={{ lg: 48, md: 48, sm: 45, xs: 42 }}
        >
          Order received
        </Typography>
        <Typography mt={6} color="grey" variant="h6">
          Thank you. Your order has been received.
        </Typography>

        <Grid item sm={12} xs={12} md="auto">
          <Box className={styles.tracking}>
            <Typography className={styles.trackingText}>
              YOUR TRACKING&nbsp;ID: {data.trackingId}
            </Typography>
            <Typography mt={2} color="red">
              Take ScreenShot Of Your Tracking ID
            </Typography>
          </Box>
        </Grid>
        <Grid justifyContent="space-between" spacing={3} mt={3} container>
          <Grid item sm={12} xs={12} md="auto">
            <Typography color="grey">ORDER NUMBER:</Typography>
            <Typography fontWeight="bold">{data.id}</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md="auto">
            <Typography color="grey">DATE:</Typography>
            <Typography fontWeight="bold">{data.date}</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md="auto">
            <Typography color="grey">TOTAL:</Typography>
            <Typography fontWeight="bold">
              {currency}
              {Number(data.total).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item sm={12} xs={12} md="auto">
            <Typography color="grey">PAYMENT METHOD:</Typography>
            <Typography fontWeight="bold">{data.paymentMethod}</Typography>
          </Grid>
        </Grid>
        <Box>
          <div className={styles2.desktopAds}>
            {/* desktopAds8 input the code */}
            <AdSlot id={"thanks-ad-banner"} />
          </div>
          <div className={styles2.tabletAds}>
            {/* tabletAds8 input the code */}
            <AdSlot id={"thanks-ad-banner1"} />
          </div>
          <div className={styles2.mobileAds}>
            {/* mobileAds8 input the code */}
            <AdSlot id={"thanks-ad-banner2"} />
          </div>
        </Box>
        <Typography color="grey" mt={4}>
          Pay with cash upon delivery.
        </Typography>
        <Typography
          textAlign="center"
          fontSize={{ lg: 48, md: 48, sm: 45, xs: 42 }}
          mt={4}
        >
          Order details
        </Typography>
        <Grid mt={5} container xs={12} md={12} border={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PRODUCT</TableCell>
                <TableCell align="right">TOTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProduct?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Stack spacing={2}>
                        <Typography>
                          <span>{item.product.title}</span>×{item.quantity}
                        </Typography>
                      </Stack>
                      <Box ml={2} mt={2}>
                        <Typography fontWeight="bold">
                          Size: {item.size}
                        </Typography>
                      </Box>
                      {item.attribute !== "0" && (
                        <Box ml={2} mt={1}>
                          <Typography fontWeight="bold">
                            Color: {item.attribute}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {currency}
                      {Number(item.subTotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell>Subtotal:</TableCell>
                <TableCell align="right">
                  {currency}
                  {Number(data.total).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment method:</TableCell>
                <TableCell align="right">{data.paymentMethod}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total:</TableCell>
                <TableCell align="right">
                  {currency}
                  {Number(data.total).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Note: </TableCell>
                <TableCell width="30%" align="right">
                  <Typography
                    maxWidth="100%"
                    width={{ xs: "100px", sm: "200px" }}
                    sx={{
                      wordWrap: "break-word",
                    }}
                  >
                    {data.notes}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Container>
    </Layout>
  );
};

export default order;
