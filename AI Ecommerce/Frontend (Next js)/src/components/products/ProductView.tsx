"use client";

import { useState } from "react";

import Box from "@component/Box";
import Shop from "@models/shop.model";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import Product from "@models/product.model";
import ProductReview from "./ProductReview";
import AvailableShops from "./AvailableShops";
import RelatedProducts from "./RelatedProducts";
import FrequentlyBought from "./FrequentlyBought";
import ProductDescription from "./ProductDescription";

// ==============================================================
type Props = {
  shops: Shop[];
  relatedProducts: Product[];
  frequentlyBought: Product[];
};
// ==============================================================

export default function ProductView({ shops, relatedProducts, frequentlyBought }: Props) {
  const [selectedOption, setSelectedOption] = useState("description");
  const handleOptionClick = (opt: any) => () => setSelectedOption(opt);

  return (
    <>
      <FlexBox borderBottom="1px solid" borderColor="gray.400" mt="80px" mb="26px">
        <H5
          mr="25px"
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
          borderBottom={selectedOption === "description" ? "2px solid" : ""}
          color={selectedOption === "description" ? "primary.main" : "text.muted"}>
          Description
        </H5>

        <H5
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" ? "2px solid" : ""}
          color={selectedOption === "review" ? "primary.main" : "text.muted"}>
          Review (3)
        </H5>
      </FlexBox>

      {/* DESCRIPTION AND REVIEW TAB DETAILS */}
      <Box mb="50px">
        {selectedOption === "description" && <ProductDescription />}
        {selectedOption === "review" && <ProductReview />}
      </Box>

      {/* FREQUENTLY BOUGHT TOGETHER PRODUCTS */}
      {frequentlyBought && <FrequentlyBought products={frequentlyBought} />}

      {/* AVAILABLE SHOPS */}
      {shops && <AvailableShops shops={shops} />}

      {/* RELATED PRODUCTS */}
      {relatedProducts && <RelatedProducts products={relatedProducts} />}
    </>
  );
}
