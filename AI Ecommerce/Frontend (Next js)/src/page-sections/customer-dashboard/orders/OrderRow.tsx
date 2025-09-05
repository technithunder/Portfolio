"use client";

import Link from "next/link";
import Box from "@component/Box";
import { Chip } from "@component/Chip";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import TableRow from "@component/TableRow";
import { IconButton } from "@component/buttons";
import Typography, { H5, Small } from "@component/Typography";
import { currency, getGuidByCustomerId } from "@utils/utils";
import Order from "@models/order.model";
import moment from "moment";
import NavLink from "@component/nav-link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentOrder } from "api";
import { setGuidId, upsertCartItem } from "store/slices/cartSlice";

// =================================================
type OrderRowProps = { order: Order };
// =================================================

export default function OrderRow({ order }: any) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const [currentOrder, setCurrentOrder] = useState([]);

  const [orderItems, setOrderItems] = useState([]);

  const getOrders = async () => {
    setLoading(true);
    const response = await getCurrentOrder(
      customerDetails.customerID,
      order.orderIDAlt
    );
    setLoading(false);

    return response?.data || [];
  };

  const getColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "secondary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "";
    }
  };

  return (
    <Fragment>
      <TableRow my="1rem" padding="6px 18px" style={{overflowX: 'auto'}}>
        <H5 m="6px" textAlign="center">
          #{order.orderIDAlt}
        </H5>

        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(order.status)}.light`}>
            <Small color={`${getColor(order.status)}.main`}>{order.status}</Small>
          </Chip>
        </Box>

        <Typography className="flex-grow pre" m="6px" textAlign="center">
          {order.last_modified ? moment(order.last_modified).format('MM/DD/YYYY') : "-"}
        </Typography>

        <Typography className="flex-grow pre" m="6px" textAlign="center">
          {order.casesOrdered}
        </Typography>

        <Typography
          className="flex-grow pre"
          m="6px"
          textAlign="center"
          style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
        {order.specialInstructions || "This product is non-returnable"}
        </Typography>
        <Typography m="6px" textAlign="center">
          {order.noOfLines || '-'}
        </Typography>
        <Typography m="6px" textAlign="center">
          {currency(order.estimatedTotal)}
        </Typography>

        <Hidden flex="0 0 0 !important" down={769}>
          <Typography textAlign="center" color="text.muted">
            <IconButton onClick={() => { router.push('/order/' + order.orderIDAlt + '?status=' + order.status) }}>
              <Icon variant="small" defaultcolor="currentColor">
                eye-alt
              </Icon>
            </IconButton>
          </Typography>
        </Hidden>
      </TableRow>
    </Fragment>
  );
}
