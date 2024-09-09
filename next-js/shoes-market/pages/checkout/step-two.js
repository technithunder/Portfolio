import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Form from "@/src/components/Form";
import TextInput from "@/src/components/Form/TextInput";
import Grid from "@mui/material/Grid";
import Button from "@/src/components/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { Autocomplete } from "@mui/material";
import { country_data } from "@/src/utils/country";
import { styled } from "@mui/material";
import Layout from "@/src/components/Layout";
import { updateCheckoutDetails } from "@/src/store/slices/checkoutSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const { FormItem } = Form;

const Alert = styled(Box)`
  margin-top: 20px;
  padding: 10px 30px 10px 30px;
  border-top: 3px solid #9dff20;
  background-color: lightgrey;
`;

const StepTwo = ({ form }) => {
  let checkoutDetails = useSelector((state) => state.checkout.details);
  const { getFieldDecorator, validateFields } = form;
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryAlert, setCountryAlert] = useState(false);
  const router = useRouter();
  let tagline = useSelector((state) => state.content.brand_data?.tagline);

  const dispatcher = useDispatch();

  const onClick = () => {
    validateFields()
      .then((values) => {
        if (!selectedCountry) {
          setCountryAlert(true);
          window.scroll(0, 0);
          return;
        }
        dispatcher(
          updateCheckoutDetails({
            ...checkoutDetails,
            ...values,
            country: selectedCountry,
          })
        );
        router.replace("/checkout/step-three");
      })
      .catch((e) => console.log(e.error));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Checkout`}>
      <Container>
        <Typography fontSize={{ lg: 48, md: 48, sm: 48, xs: 45 }} mt={5}>
          Checkout
        </Typography>
        {countryAlert && <Alert mt={4}>Please Select Your Country</Alert>}
        <Box mt={3}>
          <Typography
            textAlign="center"
            sx={{ fontWeight: 700 }}
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Billing details
          </Typography>
          <Form>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("pincode", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Enter Pincode",
                      },
                    ],
                  })(<TextInput label="Street Pincode *" type="number" />)}
                </FormItem>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
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
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("phoneNumber", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Enter Phone Number ",
                      },
                    ],
                  })(<TextInput label="Phone Number *" />)}
                </FormItem>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("emailAddress", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Email Address",
                      },
                    ],
                  })(<TextInput label="Email Address *" />)}
                </FormItem>
              </Grid>
            </Grid>
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
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Link href="/checkout/step-one">
              <Button>
                <Typography>Previous</Typography>
              </Button>
            </Link>
            <Button onClick={onClick}>
              <Typography>Next</Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Form.create()(StepTwo);
