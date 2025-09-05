import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { fetchPageContents } from "@/src/api";
import Layout from "@/src/components/Layout";

const TermsCondition = () => {
  const [pageContent, setPageContent] = useState("");
  useEffect(() => {
    fetchPageContents()
      .then((res) => {
        const htmlContent = res.data[0]?.terms_and_conditions.replace(
          /\\n/g,
          "<br />"
        );
        setPageContent(htmlContent);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout headTitle={"Terms And Condition"}>
      <Container sx={{ width: 650, maxWidth: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      </Container>
    </Layout>
  );
};

export default TermsCondition;
