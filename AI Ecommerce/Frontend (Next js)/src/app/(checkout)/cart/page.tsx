"use client";

import Link from "next/link";
import { Fragment, lazy, useEffect, useRef, useState } from "react";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import Typography, { H1, H6 } from "@component/Typography";
import Grid from "@component/grid/Grid";
import Divider from "@component/Divider";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Icon from "@component/icon/Icon";
import { SearchInput, SearchInputWithCategory } from "@component/search-box";
// import ProductCart from "@component/v2/ProductCart/ProductCart";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  changeItemToCart,
  checkItemId,
  getCurrentOrder,
  getOrderTotal,
  getProductDetails,
  handleCancelOrder,
  saveOrderStatus,
} from "api";
import { currency, getGuidByCustomerId } from "@utils/utils";
import Spinner from "@component/Spinner";
import { clearCart, setGuidId, upsertCartItem } from "store/slices/cartSlice";
// import { lazy } from 'react';
import debounce from "lodash/debounce";
import DebouncedNumberInput from "@utils/debaunceInput";
import Modal from "@component/Modal";
import { useRouter } from "next/navigation";
import SaveDeleteActions from "@utils/OrderButtons";
import NextImage from "@component/NextImage";

const ProductCart = lazy(() => import("@component/v2/ProductCart/ProductCart"));

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const [orderTotal, setOrderTotal] = useState<any>({});
  const [orders, setOrders] = useState([]);
  const [quickQty, setQuickQty] = useState(0);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, items } = useSelector((state: any) => state.cart);
  const [qtyChangeTrigger, setQtyChangeTrigger] = useState(false);
  const [cartChangeTrigger, setCartChangeTrigger] = useState(false);
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [searchedProduct, setSearchedProduct] = useState<any>();
  const [searchValue, setSearchValue] = useState("");
  const [qty, setQty] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [quickDetails, setQuickDetails] = useState<any>();

  useEffect(() => {
    getTotalOrderAmount();
  }, [qtyChangeTrigger, cartChangeTrigger]);

  useEffect(() => {
    getOrders();
  }, [cartChangeTrigger]);

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

  const getOrders = async () => {
    setLoading(true);
    const response = await getCurrentOrder(
      customerDetails.customerID,
      specificGuid?.guid
    );
    if (response?.data?.length) {
      setOrders(response.data);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (customerDetails?.customerID && specificGuid?.guid) {
      getOrders();
      getTotalOrderAmount();
    }
  }, [customerDetails, specificGuid]);

  const handleQtyChange = () => {
    getTotalOrderAmount();
    setQtyChangeTrigger((prev) => !prev);
  };

  const handleCartUpdate = () => {
    getOrders();
    setCartChangeTrigger((prev) => !prev);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchedProduct("");
    setQty(0);
    setQuickQty(0);
  };

  const cartItem = useSelector((state: any) =>
    state.cart.items.find(
      (item: any) => String(item.id) === String(searchedProduct?.itemID)
    )
  );

  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    } else {
      setQty(0);
    }
  }, [cartItem]);

  const fetchQuickAddDetails = async () => {
    setIsLoading(true);
    const res = await getProductDetails(
      customerDetails?.customerID || "",
      searchValue
    );
    setQuickDetails(res?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchValue) {
      fetchQuickAddDetails();
    }
  }, [searchValue]);

  useEffect(() => {
    const updatedItem = items.find(
      (item) => item.id === searchedProduct?.itemID
    );
    if (updatedItem) {
      setQty(updatedItem.quantity);
    } else {
      setQty(0);
    }
  }, [items, searchedProduct?.itemID]);

  useEffect(() => {
    if (items.length > 0) {
      getTotalOrderAmount();
    }
  }, [items]);

  const handleQuantityChange = async (newQty: number) => {
    try {
      setLoading(true);

      const isExistingItem = items.some(
        (item) => item.id === searchedProduct?.itemID
      );

      if (!isExistingItem) {
        const checkItemResponse = await checkItemId({
          value_additem_no: searchValue,
          value_order_id: "",
          CustomerID: customerDetails.customerID,
          PageString: "",
        });

        if (checkItemResponse.status === 200) {
          const response = await addItemToCart({
            customerId: customerDetails?.customerID,
            itemNo: searchedProduct?.itemID,
            guid: specificGuid?.guid || "",
            quantity: newQty,
            price: Number(searchedProduct?.price),
            umid: String(checkItemResponse?.data[0]?.umid),
          });

          if (response.status === 200) {
            if (!specificGuid) {
              dispatch(
                setGuidId({
                  customerId: customerDetails?.customerID,
                  guid: response?.data?.guid,
                })
              );
            }

            dispatch(
              upsertCartItem({
                item: {
                  id: searchedProduct?.itemID,
                  name: searchedProduct?.itemDescription,
                  price: Number(searchedProduct?.price),
                  umid: String(checkItemResponse?.data[0]?.umid),
                },
                quantity: newQty,
              })
            );
            handleCartUpdate();
            getTotalOrderAmount();
          }
        }
      } else {
        const response = await changeItemToCart(
          searchedProduct?.itemID,
          specificGuid?.guid,
          newQty
        );

        if (response.status === 200) {
          dispatch(
            upsertCartItem({
              item: {
                id: searchedProduct?.itemID,
                name: searchedProduct?.itemDescription,
                price: Number(searchedProduct?.price),
                umid: String(response?.data?.[0]?.umid),
              },
              quantity: newQty,
            })
          );
          handleCartUpdate();
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (searchedProduct) {
      const item = items.find((item) => item.id === searchedProduct?.itemID);
      setQty(item?.quantity || 0);
    }
  }, [searchedProduct]);

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      try {
        const res = await checkItemId({
          value_additem_no: value,
          value_order_id: "",
          CustomerID: customerDetails.customerID,
          PageString: "",
        });

        if (res.status === 200 && res.data.length > 0) {
          setSearchedProduct(res.data[0]);
        } else {
          setSearchedProduct(null);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setSearchedProduct(null);
      }
    }, 500)
  ).current;

  const handleConfirm = () => {
    setShowModal(false);
    handleDeleteOrder();
    router.push("/store");
  };
  const handleDeleteOrder = async () => {
    try {
      const result = await handleCancelOrder(specificGuid?.guid);
      if (result.status === 200) {
        dispatch(clearCart());
        handleCartUpdate();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };
  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          {loading ? (
            <FlexBox justifyContent="center" alignItems="center" mb={10}>
              <Spinner />
            </FlexBox>
          ) : orders.length === 0 ? (
            <FlexBox
              justifyContent="center"
              mb={10}
              alignItems="center"
              height="47vh"
            >
              <Typography>Your cart is empty.</Typography>
            </FlexBox>
          ) : (
            orders.map((item) => (
              <ProductCart
                key={item?.itemID}
                mb="1.5rem"
                product={item}
                onQtyChange={handleQtyChange}
                onCartUpdate={handleCartUpdate}
              />
            ))
          )}
          <Link href="/checkout">
            <Button variant="contained" color="primary" fullwidth>
              Next-header
            </Button>
          </Link>

          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem"
            }}
          >
            <Button style={{ backgroundColor: "#4E97FD", color: "white" }} onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" color="primary" onClick={() => { setShowModal(true) }}>
              Delete
            </Button>
          </div> */}
          <SaveDeleteActions />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <Box
            style={{
              backgroundColor: "#FFFBFB",
              padding: "18px",
              borderRadius: "10px",
            }}
          >
            <FlexBox justifyContent="space-between" mb="0.5rem">
              <Typography fontSize="14px" color="text.hint">
                Subtotal:
              </Typography>
              <H6 my="0px">${orderTotal?.orderTotals_DollarsTotals || "0"}</H6>
            </FlexBox>

            <FlexBox justifyContent="space-between" mb="0.5rem">
              <Typography fontSize="14px" color="text.hint">
                Total Items:
              </Typography>
              <H6 my="0px">{totalQuantity || "0"}</H6>
            </FlexBox>

            <Divider mb="0.5rem" />

            <FlexBox justifyContent="space-between" mb="1rem">
              <H6 my="0px">Total</H6>
              <H6 my="0px">${orderTotal?.orderTotals_DollarsTotals || "0"}</H6>
            </FlexBox>
          </Box>

          <Divider mb="1.5rem" />

          <Typography fontWeight="600" mb="1rem">
            Quick Add
          </Typography>

          <Box mt="1rem">
            <SearchInput
              placeholder="Product Number"
              style={{ width: "100%" }}
              onChange={(e) => {
                const value = e.target.value;
                setSearchValue(value);
                debouncedSearch(value);
              }}
              value={searchValue}
            />
          </Box>
          {/* <Box mt="1rem" mb="1rem">
            <SearchInputWithCategory placeholder="Select Unit of Measure" options={["DFLT", "UoM"]} />
          </Box> */}

          <FlexBox alignItems="center" mb="1rem">
            <TextField
              placeholder="Extended Price"
              sx={{ flex: 1 }}
              mr="1rem"
              value={searchedProduct ? searchedProduct?.price : ""}
            />

            <Fragment>
              <DebouncedNumberInput
                value={qty}
                onChange={(val) => {
                  setQty(val);
                  handleQuantityChange(val);
                }}
                initialValue={cartItem?.quantity || 0}
                style={{
                  padding: "5px",
                  width: "40px",
                  maxHeight: "40px",
                  textAlign: "center",
                  marginRight: "5px",
                }}
              />
              Quantity
            </Fragment>
          </FlexBox>
          {searchedProduct?.itemID == "0" && (
            <Typography fontSize="14px" color="text.hint">
              No Product Found
            </Typography>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClear}
              mb={3}
            >
              Clear
            </Button>
          </div>
          {quickDetails?.itemID ? isLoading ? (
            <Spinner />
          ) : (
            <div>
              <Typography fontSize={'18px'} fontWeight={'600'}>{quickDetails?.itemID} - {quickDetails?.itemDescription}</Typography>
            </div>
          ) : null}
          {searchValue && quickDetails?.itemID && (
            <NextImage
              width={277}
              src={
                searchValue
                  ? `https://orderoasis.net/Banner_images/${searchValue}.jpg`
                  : `/assets/images/products/ComingSoonImage.png`
              }
              alt={searchValue}
              onError={(e) =>
                (e.currentTarget.src =
                  "/assets/images/products/ComingSoonImage.png")
              }
              height={270}
              style={{marginTop: '5px'}}
            />
          )}
        </Grid>
      </Grid>

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            width="90%"
            maxWidth="500px"
            p="2rem"
            borderRadius="8px"
            backgroundColor="white"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontSize="16px" mb="2rem">
              Are you sure you want to cancel the order? This action cannot be
              undone.
            </Typography>
            <Box display="flex" justifyContent="flex-end" marginLeft="0.5rem">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                ml="0.5rem"
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Fragment>
  );
}
