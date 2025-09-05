import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Form from "@/src/components/Form";
import SingleOrder from "@/src/components/singleOrder";
import MultiOrder from "@/src/components/multiOrder";
import { getSettings } from "@/src/api";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";

const Checkout = ({ form }) => {
  const [formType, setFormType] = useState("single-form");

  let tagline = useSelector(state => state.content.brand_data?.tagline);

  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = () => {
    getSettings()
      .then((res) => setFormType(res.data[0].formLayout))
      .catch((e) => console.log(e));
  };

  return (
    <Layout headTitle={`${tagline?.split(".")[0]} | Checkout`}>
      <Container>
        <Typography fontSize={{ lg: 48, md: 48, sm: 48, xs: 45 }} mt={5}>
          Checkout
        </Typography>
        {formType === "single-form" ? (
          <SingleOrder form={form} />
        ) : (
          <MultiOrder form={form} />
        )}
      </Container>
    </Layout>
  );
};

export default Form.create()(Checkout);
