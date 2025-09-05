'use client'

import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { getOrderTotal } from "api";
import { currency, getGuidByCustomerId } from "@utils/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CheckoutSummary() {
  const { guid } = useSelector((state: any) => state.cart);
  const [orderTotal, setOrderTotal] = useState<any>({});
  const { customerDetails } = useSelector((state: any) => state.customer);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);

  const getTotalOrderAmount = async () => {
    try {
      const response = await getOrderTotal(specificGuid?.guid);
      if (response) {
        setOrderTotal(response.data);
      }
    } catch (error) {
      console.error("Error fetching order total:", error);
    }
  };

  useEffect(() => {
    getTotalOrderAmount();
  }, []);

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            ${(orderTotal && orderTotal?.orderTotals_DollarsTotals) || "0"}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Total Items</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {(orderTotal && orderTotal?.orderTotals_TotalQty) || "0"}
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
            ${(orderTotal && orderTotal?.orderTotals_DollarsTotals) || "0"}
          </Typography>
        </FlexBox>
      </FlexBox>
    </Card1>
  );
}
