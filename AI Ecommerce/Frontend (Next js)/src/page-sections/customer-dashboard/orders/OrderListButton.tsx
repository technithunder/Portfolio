"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@component/buttons";
import { clearCart, upsertCartItem } from "store/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { setGuidId } from "store/slices/cartSlice";
import { getCurrentOrder, getOrderTotal } from "api";
import { useEffect, useState } from "react";

export default function OrderListButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState()
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const getOrders = async () => {
    setLoading(true);
    const response = await getCurrentOrder(
      customerDetails.customerID,
      orderId
    );
    setLoading(false);

    return response?.data || [];
  };

  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentOrderTotal()
  }, [orderId])

  const handleCartLoad = async () => {
        router.push('/store')

    const fetchedItems = await getOrders();

    if (!fetchedItems.length) {
      console.warn("No order items to load into cart.");
      return;
    }
    dispatch(clearCart());

    dispatch(
      setGuidId({
        customerId: customerDetails?.customerID,
        guid: orderId,
      })
    );

    fetchedItems.forEach((item) => {
      const price = parseFloat(item.regular || "0");

      dispatch(
        upsertCartItem({
          item: {
            id: item.itemID,
            name: item.itemDescription,
            image: item.stocked,
            price,
            size: item.size,
            category: item.category,
            pack: item.pack,
            umid: String(item.uM_ID),
          },
          quantity: item.qty,
        })
      );
    });

  };
  
  const getCurrentOrderTotal = async () => {
    const response = await getOrderTotal(orderId);
    setTotal(response.data.orderTotals_DollarsTotals || 0);
    return response?.data || 0;
  };
  return (
    (status == "SAVED FOR LATER") && 
      <Button px="2rem" color="primary" bg="primary.light" style={{ cursor: "pointer" }} onClick={() => handleCartLoad()}>
        Continue Order
      </Button>
  );
}
