"use client";

import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { getGuidByCustomerId } from "@utils/utils";
import { getOrderTotal } from "api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currency } from "@utils/utils";

export default function CheckoutSummary() {
  const { guid } = useSelector((state: any) => state.cart);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);
  const totalAmount = useSelector((state: any) => state.cart.totalAmount);

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            ${totalAmount.toFixed(2)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Total Items</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {totalQuantity || "0"}
          </Typography>
        </FlexBox>
      </FlexBox>

      <Divider mb="1rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          Total
        </Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            ${totalAmount.toFixed(2)}
          </Typography>
        </FlexBox>
      </FlexBox>
    </Card1>
  );
}
