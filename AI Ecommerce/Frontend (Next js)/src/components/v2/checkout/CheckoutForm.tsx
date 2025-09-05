"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { Formik } from "formik";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
import { getOrderDetails, setOrderHeader } from "api";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { toast } from "react-toastify";
import { getGuidByCustomerId } from "@utils/utils";
import { useEffect, useState } from "react";
import SaveDeleteActions from "@utils/OrderButtons";
import Spinner from "@component/Spinner";
import FlexBox from "@component/FlexBox";

const StyledDatePicker = styled(DatePicker)({
  width: "100%",
  height: "40px",
  "& .react-date-picker__wrapper": {
    borderRadius: "4px",
    padding: "0 10px",
    height: "40px",
    borderColor: "#ccc",
  },
});

const initialValues = {
  value_oh_delivery_date: "",
  value_oh_delivery_code: "",
  value_oh_po: "",
  value_oh_order_message: "",
};

const checkoutSchema = yup.object().shape({
  value_oh_delivery_date: yup.string(),
  value_oh_delivery_code: yup.string().required("Required"),
  value_oh_po: yup.string(),
  value_oh_order_message: yup.string(),
});

export default function CheckoutForm() {
  const router = useRouter();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [formValues, setFormValues] = useState(initialValues);
  const orderHeader = useSelector((state: any) => state.orderHeader);
  const [loading, setLoading] = useState(false);

  const formatDateToMMDDYY = (date: Date) => {
    if(!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };

  const handleFormSubmit = async (values: any) => {
    const formattedDate =
      values.value_oh_delivery_date && formatDateToMMDDYY(values.value_oh_delivery_date);

    const queryParams = new URLSearchParams({
      value_oh_order_number: specificGuid?.guid || "",
      value_oh_customer_number: customerDetails?.customerID || "",
      value_oh_delivery_date: formattedDate || "",
      value_oh_delivery_code: values.value_oh_delivery_code || "",
      value_oh_po: values.value_oh_po || "",
      value_oh_order_message: values.value_oh_order_message || "",
      pageString: "1",
    });

    try {
      const response = await setOrderHeader(`?${queryParams.toString()}`);
      if (response.data.success) {
        router.push("/payment");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong while submitting the order.");
    }
  };

  useEffect(() => {
    const fetchCustomerDescDetails = async () => {
      setLoading(true);
      try {
        const res = await getOrderDetails(customerDetails?.customerID || "", specificGuid?.guid || "");
        if (res.data) {
          setFormValues({
            value_oh_delivery_date: res.data.pickupDeliveryDate
              ? new Date(res.data.pickupDeliveryDate)as any
              : "",
            value_oh_delivery_code: res.data.pickupDeliveryCode || "",
            value_oh_po: res.data.po_number || "",
            value_oh_order_message: res.data.specialInstructions || "",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };
    fetchCustomerDescDetails();
  }, []);

  return (
    <Formik
      initialValues={orderHeader?.value_oh_delivery_code ? orderHeader : formValues}
      validationSchema={checkoutSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        loading ?
          <FlexBox
            mt={5}
            alignItems="center"
            justifyContent="center"
            width={"100%"}
          > <Spinner />
          </FlexBox> :
          <form onSubmit={handleSubmit}>
            <Card1 mb="2rem">
              <Typography fontWeight="600" mb="1rem">
                Header
              </Typography>

              <Grid container spacing={7}>
                <Grid item sm={12} xs={12}>
                  <div style={{ marginBottom: "1rem" }}>
                    <Typography mb="0.5rem">Request Date</Typography>
                    <StyledDatePicker
                      onChange={(date) => setFieldValue("value_oh_delivery_date", date)}
                      value={values.value_oh_delivery_date}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <Typography mb="0.5rem">Pick Up/ Delivery</Typography>
                    <select
                      name="value_oh_delivery_code"
                      value={values.value_oh_delivery_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: "100%",
                        padding: "0px 5px",
                        borderRadius: "4px",
                        height: "40px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select an option</option>
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                    {touched.value_oh_delivery_code && errors.value_oh_delivery_code && (
                      <Typography color="error">{errors.value_oh_delivery_code}</Typography>
                    )}
                  </div>

                  <TextField
                    fullwidth
                    mb="1rem"
                    label="Purchase Order Number"
                    onBlur={handleBlur}
                    name="value_oh_po"
                    onChange={handleChange}
                    value={values.value_oh_po}
                  />

                  <TextField
                    fullwidth
                    label="Special Instruction"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="value_oh_order_message"
                    value={values.value_oh_order_message}
                    errorText={
                      touched.value_oh_order_message && errors.value_oh_order_message
                    }
                  />
                </Grid>
              </Grid>
            </Card1>

            <Grid container>
              <Grid
                item
                sm={6}
                xs={12}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Link href="/cart">
                  <Button variant="outlined" color="primary" type="button">
                    Back to Cart
                  </Button>
                </Link>
              </Grid>

              <Grid
                item
                sm={6}
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button variant="contained" color="primary" type="submit">
                  Next - Payment
                </Button>
              </Grid>
            </Grid>

            <SaveDeleteActions values={values} />
          </form>
      )}
    </Formik>
  );
}
