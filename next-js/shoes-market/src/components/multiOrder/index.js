import React from "react";
import Form from "@/src/components/Form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextInput from "@/src/components/Form/TextInput";
import Button from "@/src/components/Button";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { updateCheckoutDetails } from "@/src/store/slices/checkoutSlice";

const { FormItem } = Form;

const MultiOrder = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  const router = useRouter();
  const dispatcher = useDispatch()

  const onClick = () => {
    validateFields()
      .then((values) => {
        dispatcher(updateCheckoutDetails(values))
        router.push("/checkout/step-one");
      })
      .catch((e) => console.log(e.error));
  };

  return (
    <>
      <Box>
        <Typography
          textAlign="center"
          sx={{ fontWeight: 700 }}
          fontSize={{ lg: 34, md: 34, sm: 32, xs: 29 }}
        >
          Billing details
        </Typography>
        <Form>
          <Grid container spacing={2} mt={1}>
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
        </Form>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClick}>
            <Typography>Next</Typography>
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MultiOrder;
