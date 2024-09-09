import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Form from "@/src/components/Form";
import TextInput from "@/src/components/Form/TextInput";
import Grid from "@mui/material/Grid";
import Button from "@/src/components/Button";
import Layout from "@/src/components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { updateCheckoutDetails } from "@/src/store/slices/checkoutSlice";
import Link from "next/link";

const { FormItem } = Form;

const StepOne = ({ form }) => {
  let checkoutDetails = useSelector((state) => state.checkout.details);
  const { getFieldDecorator, validateFields } = form;
  const router = useRouter();
  const dispatcher = useDispatch();

  let tagline = useSelector((state) => state.content.brand_data?.tagline);

  const onClick = () => {
    validateFields()
      .then((values) => {
        dispatcher(updateCheckoutDetails({ ...checkoutDetails, ...values }));
        router.push("/checkout/step-two");
      })
      .catch((e) => console.log(e.error));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Checkout`}>
      <Container>
        <Typography fontSize={{ lg: 48, md: 48, sm: 48, xs: 45 }} mt={5}>
          Checkout
        </Typography>
        <Box mt={3}>
          <Typography
            sx={{ fontWeight: 700 }}
            textAlign="center"
            fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
          >
            Billing details
          </Typography>
          <Form>
            <FormItem>
              {getFieldDecorator("streetAddress", {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "Please Enter Street Address",
                  },
                ],
              })(<TextInput label="Street Address *" />)}
            </FormItem>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator("city", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "Please Enter City ",
                      },
                    ],
                  })(<TextInput label="City *" />)}
                </FormItem>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
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
              </Grid>
            </Grid>
          </Form>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Link href="/checkout">
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

export default Form.create()(StepOne);
