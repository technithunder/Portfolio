"use client";

import { useEffect, useState } from "react";
import { currency } from "@utils/utils";
import styled from "styled-components";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Typography, { H5, H6 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { OrderListButton } from "@sections/customer-dashboard/orders";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentOrder, getOrderDetails, getOrderTotal } from "api";
import Container from "@component/Container";
import moment from "moment";
import { getTheme } from "@utils/utils";
import Link from "next/link";
import LazyImage from "@component/LazyImage";
import Spinner from "@component/Spinner";
import { setProductDetails } from "store/slices/productSlice";

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  padding-inline: 20px;
  margin-bottom: 20px;
  background-color: ${getTheme("colors.body.paper")};

  .product-details {
    padding: 20px;
  }

  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
    img {
      height: auto;
      min-width: 100%;
    }
  }
`;

export default function OrderDetailsComponent({ id }) {
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [isCustomerDescLoading, setIsCustomerDescLoading] = useState(true);
  const [orderDetailsData, setOrderDetailsData] = useState<any>([]);
  const [currentOrder, setCurrentOrder] = useState<any>([]);
  const [orderTotal, setOrderTotal] = useState();
  const dispatch = useDispatch();
  const totalAmount = useSelector((state: any) => state.cart.totalAmount);

  const rawDate = orderDetailsData?.pickupDeliveryDate;
  const formattedDate = rawDate ? moment(rawDate).format('MM/DD/YYYY') : '';
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);

  const getOrderList = async () => {
    try {
      setIsOrderLoading(true);
      const response = await getCurrentOrder(customerDetails.customerID, id);
      if (response) {
        setCurrentOrder(response.data);
      }
      setIsOrderLoading(false);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  // @ts-ignore
  const fetchCustomerDescDetails = async () => {
    try {
      setIsCustomerDescLoading(true);
      const res = await getOrderDetails(customerDetails?.customerID || "", id);

      if (res.data) {
        setOrderDetailsData(res.data);
        getOrderList();
      }
      setIsCustomerDescLoading(false);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const getTotalOrderAmount = async () => {
    try {
      const response = await getOrderTotal(id);
      if (response) {
        setOrderTotal(response.data.orderTotals_DollarsTotals);
      }
    } catch (error) {
      console.error("Error fetching order total:", error);
    }
  };

  useEffect(() => {
    fetchCustomerDescDetails();
    getOrderList();
    getTotalOrderAmount();
  }, []);

  const parseMMDDYY = (mmddyy: string): Date => {
    const mm = mmddyy.slice(0, 2);
    const dd = mmddyy.slice(2, 4);
    const yy = mmddyy.slice(4, 6);
    const fullYear = Number(yy) + 2000;
    return new Date(`${fullYear}-${mm}-${dd}`);
  };
  
  const formatDateToMMDDYY = (mmddyy: string): string => {
    if(!mmddyy) return "";
    const date = parseMMDDYY(mmddyy);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };

  return (
    <Container mt={5}>
      <DashboardPageHeader
        title="Order Details"
        iconName="bag_filled"
        button={<OrderListButton orderId={id} />}
      />

      {isCustomerDescLoading ? (
        <FlexBox
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </FlexBox>
      ) : (
        <>
          <Card p="0px" mb="30px" overflow="hidden" borderRadius={8}>
            <Box style={{ display: "flex", gap: "40px" }} p="12px">
              <Typography fontSize="14px" color="text.muted" mr="4px">
                Order ID:{" "}
                <span style={{ color: "black" }}>
                  #{orderDetailsData?.orderId}
                </span>
              </Typography>

              <Typography fontSize="14px" color="text.muted" mr="4px">
                Placed on:{" "}
                <span style={{ color: "black" }}>
                  {moment(orderDetailsData.createdDate).format("MM/DD/YYYY")}
                </span>
              </Typography>

              <Typography fontSize="14px" color="text.muted" mr="4px">
                Delivered on:{" "}
                <span style={{ color: "black" }}>
                  {orderDetailsData?.delivery_date === null
                    ? ""
                    : moment(orderDetailsData?.delivery_date).format(
                        "MM/DD/YYYY"
                      )}
                </span>
              </Typography>
            </Box>

            {isOrderLoading ? (
              <FlexBox
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </FlexBox>
            ) : (
              currentOrder.map((item) => (
                <Wrapper>
                  <LazyImage
                    alt={item?.itemDescription}
                    width={100}
                    height={100}
                    src={item.itemID ? `https://orderoasis.net/Banner_images/${item.itemID}.jpg` : `/assets/images/products/ComingSoonImage.png`}
                  />
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    style={{ width: "100%" }}
                  >
                    <Grid item lg={8} md={8} sm={8} xs={12}>
                      <FlexBox
                        width="100%"
                        minWidth="0px"
                        flexDirection="column"
                        className="product-details"
                        justifyContent="space-between"
                      >
                          <Box
                            className="title"
                            fontWeight="600"
                            display="flex"
                            fontSize="18px"
                            style={{ gap: "1.5rem" }}
                          >
                            <Typography>{item?.itemDescription}</Typography>
                          </Box>

                        <FlexBox
                          justifyContent="space-between"
                          alignItems="flex-end"
                          mt="10px"
                        >
                          <FlexBox flexWrap="wrap" alignItems="center">
                            <Typography color="gray.600" mr="0.5rem">
                              {currency(item.regular)} x {item.qty}
                            </Typography>
                          </FlexBox>
                        </FlexBox>
                      </FlexBox>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={12}>
                      <Link
                        href={`/product/${item.itemID}`}
                        onClick={() => {
                          dispatch(setProductDetails(item));
                        }}
                      >
                        View Info
                      </Link>
                    </Grid>
                  </Grid>
                </Wrapper>
              ))
            )}
          </Card>

          <Grid container spacing={6}>
            <Grid item lg={6} md={6} xs={12}>
              <Card p="20px 30px" borderRadius={8}>
                <H5 mt="0px" mb="14px">
                  Header Information
                </H5>
                
                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="0.5rem"
                >
                  <Typography fontSize="14px" color="text.hint">
                    Purchase Order:
                  </Typography>

                  <H6 my="0px">{orderDetailsData?.po_number}</H6>
                </FlexBox>
                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="0.5rem"
                >
                  <Typography fontSize="14px" color="text.hint">
                    Request Date:
                  </Typography>

                  <H6 my="0px">{formatDateToMMDDYY(orderDetailsData?.pickupDeliveryDate)}</H6>
                </FlexBox>
                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="0.5rem"
                >
                  <Typography fontSize="14px" color="text.hint">
                    Pick Up/ Delivery:
                  </Typography>

                  <H6 my="0px">{orderDetailsData?.pickupDeliveryCode}</H6>
                </FlexBox>

                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="0.5rem"
                >
                  <Typography fontSize="14px" color="text.hint">
                    Special Instruction:
                  </Typography>

                  <H6 my="0px">{orderDetailsData?.specialInstructions}</H6>
                </FlexBox>
              </Card>
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <Card p="20px 30px" borderRadius={8}>
                <H5 mt="0px" mb="14px">
                  Total Summary
                </H5>

                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="0.5rem"
                >
                  <Typography fontSize="14px" color="text.hint">
                    Subtotal:
                  </Typography>
                  <Typography fontSize="14px" color="text.hint">
                    ${orderTotal}
                  </Typography>
                </FlexBox>
                <Divider mb="0.5rem" />

                <FlexBox
                  justifyContent="space-between"
                  alignItems="center"
                  mb="1rem"
                >
                  <H6 my="0px">Total</H6>
                  <H6 my="0px">${orderTotal}</H6>
                </FlexBox>

                <Typography fontSize="14px">
                  Paid by Credit/Debit Card
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
