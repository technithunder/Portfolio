import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { fetchPageContents } from "@/src/api";
import Layout from "@/src/components/Layout";

const ReturnPolicy = () => {
  const [pageContent, setPageContent] = useState("");
  useEffect(() => {
    fetchPageContents()
      .then((res) => {
        const htmlContent =
          res.data[0]?.return_refund_cancellection_shipping_policy.replace(
            /\\n/g,
            "<br />"
          );
        setPageContent(htmlContent);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout headTitle={"Return Refund  Policy"}>
      <Container sx={{ width: 650, maxWidth: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      </Container>
    </Layout>
  );
};

export default ReturnPolicy;
