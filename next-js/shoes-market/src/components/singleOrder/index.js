import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material";
import Form from "@/src/components/Form";
import TextInput from "@/src/components/Form/TextInput";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/router";
import { fetchCartProduct, orderProduct } from "@/src/api";
import { defineCustomSlots, getUID } from "@/src/utils/helper";
import styles from "@/styles/components/Checkout.module.scss";
import { country_data } from "@/src/utils/country";
import Button from "@/src/components/Button";
import { removeSlot } from "../AdSlot/lib-dfp-index";
import styles2 from "@/styles/components/Checkout.module.scss";
import AdSlot from "../AdSlot";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

const { FormItem } = Form;

const Alert = styled(Box)`
  margin-top: 20px;
  padding: 10px 30px 10px 30px;
  border-top: 3px solid #9dff20;
  background-color: lightgrey;
`;

const SingleOrder = ({ form }) => {
  const router = useRouter();
  const { getFieldDecorator, validateFields } = form;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [toc, setToc] = useState(false);
  const [tocAlert, setTocAlert] = useState(false);
  const [stateAlert, setStateAlert] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  let adsData = useSelector((state) => state.content.content);
  let currency = useSelector((state) => state.content.currency);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (isEmpty(adsData)) {
      const { desktop_ads_7, tablet_ads_7, mobile_ads_7 } = adsData;

      defineCustomSlots(desktop_ads_7);
      defineCustomSlots(tablet_ads_7);
      defineCustomSlots(mobile_ads_7);
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

  const onClick = () => {
    validateFields()
      .then((value) => {
        let obj = {
          firstName: value.firstName,
          lastName: value.lastName,
          companyName: value.companyName,
          streetAddress: value.streetAddress,
          city: value.city,
          state: value.state,
          pinCode: value.pinCode,
          phoneNumber: value.phoneNumber,
          emailAddress: value.emailAddress,
          notes: value.notes,
          product: JSON.stringify(data),
          total: total,
          userId: getUID(),
          cartId: data?.map((i) => i.id),
        };

        if (toc) {
          obj["toc"] = toc;
          setTocAlert(false);
        } else {
          setTocAlert(true);
          window.scrollTo(0, 0);
          return;
        }

        if (!selectedCountry) {
          setStateAlert(true);
          window.scrollTo(0, 0);
          return;
        } else {
          obj["country"] = selectedCountry;
          setStateAlert(false);
        }

        orderProduct(obj)
          .then((res) => {
            if (res) {
              const id = res.data.id;
              router.push(`/order/${id}`);
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {tocAlert && <Alert mt={4}>Please Accept Terms and Condition</Alert>}
      {stateAlert && <Alert mt={4}>Please Select Your Country</Alert>}
      <Grid container spacing={2} mt={5}>
        <Grid item md={6} xs={12}>
          <Typography
            sx={{ fontWeight: 700 }}
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Billing details
          </Typography>
          <Form>
            <Grid container spacing={2} mt={3}>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("firstName", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Enter First Name",
                      },
                    ],
                  })(<TextInput label="First Name" />)}
                </FormItem>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("lastName", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Enter Last Name",
                      },
                    ],
                  })(<TextInput label="Last Name" />)}
                </FormItem>
              </Grid>
            </Grid>
            <Typography my={1} fontWeight={500} fontSize={16}>
              Country
            </Typography>
            <Autocomplete
              fullWidth
              value={selectedCountry}
              onChange={(event, value) => setSelectedCountry(value)}
              size="medium"
              options={country_data?.map((i) => i.name)}
              renderInput={(parmas) => (
                <TextField
                  {...parmas}
                  placeholder="Select an option..."
                  size="medium"
                  color="black"
                />
              )}
            />
            <FormItem>
              {getFieldDecorator("streetAddress", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter Address",
                  },
                ],
              })(<TextInput label="Street address *" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("city", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter City",
                  },
                ],
              })(<TextInput label="Town / City *" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("state", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter State",
                  },
                ],
              })(<TextInput label="State *" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("pinCode", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter Pincode",
                  },
                ],
              })(<TextInput label="PIN Code *" type="number" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("phoneNumber", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter Phone Number ",
                  },
                ],
              })(<TextInput label="Phone *" type="number" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("emailAddress", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    type: "email",
                    message: "Please Enter Valid Email Address",
                  },
                ],
              })(<TextInput type="email" label="Email address *" />)}
            </FormItem>
            <Typography sx={{ fontWeight: 700 }} variant="h5" mt={3}>
              Additional information
            </Typography>
            <FormItem>
              {getFieldDecorator("notes", {
                initialValue: "",
              })(
                <TextInput label="Order notes (optional)" multiline rows={4} />
              )}
            </FormItem>
          </Form>
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography
            sx={{ fontWeight: 700 }}
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Your order
          </Typography>
          <Box mt={7}>
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
                    <span
                      className={styles.link}
                    >
                      terms and conditions
                    </span>
                  </Link>
                </div>
              }
            />
            <Button sx={{ marginTop: 5 }} onClick={onClick}>
              PLACE ORDER
            </Button>
          </Box>
          <Box mt={3}>
            <div className={styles2.desktopAds}>
              {/* desktopAds4 input the code */}
              <AdSlot id={"checkout-ad-banner"} />
            </div>
            <div className={styles2.tabletAds}>
              {/* tabletAds4 input the code */}
              <AdSlot id={"checkout-ad-banner1"} />
            </div>
            <div className={styles2.mobileAds}>
              {/* mobileAds4 input the code */} 
              <AdSlot id={"checkout-ad-banner2"} />
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default SingleOrder;
