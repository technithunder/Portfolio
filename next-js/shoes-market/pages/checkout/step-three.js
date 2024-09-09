import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Form from "@/src/components/Form";
import Button from "@/src/components/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import styles from "@/styles/components/Checkout.module.scss";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useRouter } from "next/router";
import { styled } from "@mui/material";
import { fetchCartProduct, orderProduct } from "@/src/api";
import { getUID } from "@/src/utils/helper";
import Layout from "@/src/components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { updateCheckoutDetails } from "@/src/store/slices/checkoutSlice";
import Link from "next/link";

const Alert = styled(Box)`
  margin-top: 20px;
  padding: 10px 30px 10px 30px;
  border-top: 3px solid #9dff20;
  background-color: lightgrey;
`;

const StepTwo = () => {
  let checkoutDetails = useSelector((state) => state.checkout.details);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [toc, setToc] = useState(false);
  const [tocAlert, setTocAlert] = useState(false);
  const router = useRouter();

  const dispatcher = useDispatch();
  let currency = useSelector((state) => state.content.currency);
  let tagline = useSelector((state) => state.content.brand_data?.tagline);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = () => {
    fetchCartProduct({ userId: getUID() })
      .then((res) => {
        setData(res.data.cartProducts), setTotal(res.data.total);
      })
      .catch((e) => console.log(e));
  };

  const onClick = () => {
    let obj = {
      ...checkoutDetails,
      product: JSON.stringify(data),
      total: total,
      userId: getUID(),
      cartId: data.map((i) => i.id),
    };

    if (toc) {
      obj["toc"] = toc;
      setTocAlert(false);
    } else {
      setTocAlert(true);
      window.scroll(0, 0);
      return;
    }

    orderProduct(obj)
      .then((res) => {
        if (res) {
          const id = res.data.id;
          dispatcher(updateCheckoutDetails({}));
          router.replace(`/order/${id}`);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Checkout`}>
      <Container>
        <Typography fontSize={{ lg: 48, md: 48, sm: 48, xs: 45 }} mt={5}>
          Checkout
        </Typography>
        {tocAlert && <Alert mt={4}>Please Accept Terms and Condition</Alert>}
        <Box mt={3}>
          <Typography
            textAlign="center"
            sx={{ fontWeight: 700 }}
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Billing details
          </Typography>
          <Typography
            mt={4}
            sx={{ fontWeight: 700 }}
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Your order
          </Typography>
          <Box>
            {data?.map((item, index) => {
              return (
                <Box key={index}>
                  <Stack
                    display="flex"
                    mt={2}
                    justifyContent="space-between"
                    flexDirection="row"
                    gap={2}
                  >
                    <Box>
                      <Typography>
                        {item.product.title} × {item.quantity}
                      </Typography>
                      <Typography mt={1} fontStyle="italic">
                        Size: {item.size}
                      </Typography>
                      {item.attribute !== "0" && (
                        <Typography mt={1} fontStyle="italic">
                          Color: {item.attribute}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {currency}
                      {Number(item.subTotal).toFixed(2)}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
            <Divider sx={{ marginY: 2 }} />
            <Stack
              display="flex"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Typography>Subtotal</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {currency}
                {Number(total).toFixed(2)}
              </Typography>
            </Stack>
            <Divider sx={{ marginY: 2 }} />
            <Stack
              display="flex"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Typography>Total</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {currency}
                {Number(total).toFixed(2)}
              </Typography>
            </Stack>
            <FormControl sx={{ marginTop: 5 }}>
              <FormControlLabel
                value="end"
                control={<Radio color="black" />}
                checked
                label=" Cash on delivery"
              />
            </FormControl>
            <Typography sx={{ marginLeft: "30px" }}>
              Pay with cash upon delivery.
            </Typography>
            <Typography mt={5}>
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              <Link href="/privacy-policy">
                <span className={styles.link}>privacy policy.</span>
              </Link>
            </Typography>
            <FormControlLabel
              sx={{ marginTop: 3 }}
              value={toc}
              onChange={(e) => setToc(e.target.checked)}
              control={<Checkbox color="black" />}
              label={
                <div>
                  I have read and agree to the website
                  <Link href="/terms-condition">
                    <span className={styles.link}>terms and conditions</span>
                  </Link>
                </div>
              }
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Link href="/checkout/step-two">
              <Button>
                <Typography>Previous</Typography>
              </Button>
            </Link>
            <Button onClick={onClick}>
              <Typography>Place Order</Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Form.create()(StepTwo);
