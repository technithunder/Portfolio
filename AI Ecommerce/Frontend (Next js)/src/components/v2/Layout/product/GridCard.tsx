"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import { Chip } from "@component/Chip";
import FlexBox from "@component/FlexBox";
import NextImage from "@component/NextImage";
import Card from "@component/Card";
import { H3, SemiSpan } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { getGuidByCustomerId, getTheme } from "@utils/utils";
import { deviceSize } from "@utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "store/slices/productSlice";
import { addItemToCart, changeItemToCart, checkItemId } from "api";
import {
  setCurrentOrderId,
  setGuidId,
  updateUmid,
  upsertCartItem,
} from "store/slices/cartSlice";
import Spinner from "@component/Spinner";
import DebouncedNumberInput from "@utils/debaunceInput";
import { CART_QUEUE, CURRENT_ORDER_ID } from "@hook/useSharedState";

// STYLED COMPONENT
const Wrapper = styled(Card)`
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;

  &:hover {
    .details {
      .add-cart {
        display: flex;
      }
    }
    .image-holder {
      .extra-icons {
        display: flex;
      }
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: inline-block;
    height: 100%;

    .extra-icons {
      z-index: 2;
      top: 0.75rem;
      display: none;
      right: 0.75rem;
      cursor: pointer;
      position: absolute;
      flex-direction: column;
      gap: 0.25rem;
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      display: block;
    }
  }

  .details {
    padding: 1rem;

    .title,
    .categories {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon-holder {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
    }

    .favorite-icon {
      cursor: pointer;
    }
    .outlined-icon {
      svg path {
        fill: ${getTheme("colors.text.hint")};
      }
    }
    .add-cart {
      display: none;
      margin-top: auto;
      align-items: center;
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 768px) {
    .details {
      .add-cart {
        display: flex;
      }
    }
  }
`;

export default function GridCard({
  id,
  off,
  slug,
  title,
  price,
  imgUrl,
  images,
  rating = 4,
  size,
  pack,
  productInfo,
  newQty = 0,
  ...props
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(newQty);

  const [imgSrc, setImgSrc] = useState('')
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, items, currentOrderId } = useSelector(
    (state: any) => state.cart
  );
  const [isLoading, setIsLoading] = useState(false);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [productsQueue, setProductsQueue] = CART_QUEUE.useSharedState();

  console.log("141 ===>", productsQueue, currentOrderId);

  const cartItem = useSelector((state: any) =>
    state.cart.items.find(
      (item: any) => String(item.id) === String(productInfo?.itemID)
    )
  );
  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    } else {
      setQty(0);
    }
  }, [cartItem]);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const orderStatusList = [
    { label: "DFLT", value: "dft" },
    { label: "UoM", value: "UoM" },
    { label: "UoM", value: "UoM" },
  ];

  const isExistingItem = items.some((item) => item.id === productInfo?.itemID);

  const addItemInStore = (newQty) => {
    if (!isExistingItem) {
      dispatch(
        upsertCartItem({
          item: {
            id: productInfo?.itemID,
            name: productInfo?.itemDescription,
            price: Number(productInfo?.regular),
          },
          quantity: newQty,
        })
      );
    } else {
      dispatch(
        upsertCartItem({
          item: {
            id: productInfo?.itemID,
            name: productInfo?.itemDescription,
            price: Number(productInfo?.regular),
          },
          quantity: newQty,
        })
      );
    }
  };

  const addItemInOrder = async (productInfo, newQty) => {
    if (!isExistingItem) {
      const checkItemResponse = await checkItemId({
        value_additem_no: productInfo?.itemID,
        value_order_id: "",
        CustomerID: customerDetails.customerID,
        PageString: "",
      });

      if (checkItemResponse.status === 200) {
        const response = await addItemToCart({
          customerId: customerDetails?.customerID,
          itemNo: productInfo?.itemID,
          guid: currentOrderId || "",
          quantity: newQty,
          price: Number(productInfo?.regular),
          umid: String(checkItemResponse?.data[0]?.umid),
        });

        if (response.status === 200) {
          const newGuid = response?.data?.guid;

          if (!specificGuid) {
            dispatch(setCurrentOrderId(response?.data?.guid));
            dispatch(
              setGuidId({
                customerId: customerDetails?.customerID,
                guid: newGuid,
              })
            );
          }

          dispatch(
            updateUmid({
              id: productInfo?.itemID,
              umid: String(checkItemResponse?.data[0]?.umid),
            })
          );
        }
        setIsLoading(false);
      }
    } 
    else {
      const response = await changeItemToCart(
        productInfo?.itemID,
        specificGuid?.guid || currentOrderId,
        newQty
      );

      if (response.status === 200) {
        // update umid in store
      }
    }
  };

  const addItemInQueue = (newQty) => {
    console.log("235 ===>");
    setProductsQueue((prev) => [
      ...productsQueue,
      {
        ...productInfo,
        newQty: newQty,
      },
    ]);
  };

  const handleQuantityChange = async (newQty: number) => {
    console.log("245 ===>", items, currentOrderId);
    try {
      addItemInStore(newQty);
      if (items.length < 1 && !currentOrderId) {
        addItemInOrder(productInfo, newQty);
      } else if (currentOrderId) {
        addItemInOrder(productInfo, newQty);
      } else {
        addItemInQueue(newQty);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Wrapper borderRadius={8} {...props}>
        <div className="image-holder">
          {!!off && (
            <Chip
              top="10px"
              left="10px"
              p="5px 10px"
              fontSize="10px"
              fontWeight="600"
              bg="primary.main"
              position="absolute"
              color="primary.text"
              zIndex={1}
            >
              {off}% off
            </Chip>
          )}
          {customerDetails ? (
          <Link
            tabIndex={-1}
            href={`/product/${productInfo?.itemID}`}
            onClick={() => {
              dispatch(setProductDetails(productInfo));
            }}
          >
            <NextImage
              alt={title}
              width={277}
              src={ imgSrc ? imgSrc : productInfo.stocked
                ? `https://orderoasis.net/Banner_images/${productInfo.stocked}`
                : productInfo.itemID
                ? `https://orderoasis.net/Banner_images/${productInfo.itemID}.jpg`
                : imgSrc}
              height={270}
              onError={() =>
                setImgSrc("/assets/images/products/ComingSoonImage.png")
              }
            />
          </Link>
          ) : (
            <Link
            tabIndex={-1}
            href={`/product/${productInfo?.itemID}`}
            onClick={() => {
              dispatch(setProductDetails(productInfo));
            }}
          >
            <NextImage
              alt={title}
              width={277}
              src={ productInfo.stocked
                ? `https://orderoasis.net/Banner_images/${productInfo.stocked}`
                : productInfo.itemID
                ? `https://orderoasis.net/Banner_images/${productInfo.itemID}.jpg`
                : imgSrc}              
                height={270}
              onError={() =>
                setImgSrc("/assets/images/products/ComingSoonImage.png")
              }
            />
          </Link>
          )}
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <div style={{ width: "100%", height: "52px" }}>
                  <H3
                    mb="10px"
                    title={title}
                    fontSize="14px"
                    textAlign="left"
                    fontWeight="600"
                    className="title"
                    color="text.secondary"
                    style={{ textWrap: "wrap" }}
                  >
                    {productInfo.itemID} - {title}
                  </H3>
                </div>
              </div>

              <div style={{ gap: "10px", display: "flex" }}>
                <SemiSpan>size: {size}</SemiSpan>
                <SemiSpan>pack: {pack}</SemiSpan>
              </div>
              <FlexBox
                alignItems="center"
                mt="6px"
                justifyContent="space-between"
              >
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {customerDetails?.customerID ? `$${price}` : "$0.00"}
                </SemiSpan>
                <FlexBox
                  alignItems="center"
                  flexDirection="row"
                  style={{ gap: "5px" }}
                >
                  {/* <Select
                    placeholder="DFLT"
                    options={orderStatusList}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        height: "28px !important",
                        minHeight: "unset !important",
                      }),
                      indicatorsContainer: (provided: any) => ({
                        ...provided,
                        padding: "0px !important",
                      }),
                      dropdownIndicator: (provided: any) => ({
                        ...provided,
                        padding: "0px",
                      }),
                      valueContainer: (provided: any) => ({
                        ...provided,
                        padding: "0px",
                      }),
                    }}
                  /> */}
                  <div>
                    {/* <Button
                      size="none"
                      padding="3px"
                      color="primary"
                      variant="outlined"
                      borderColor="primary.light"
                      disabled={!customerDetails || qty === 0}
                      onClick={() => {
                        const newQty = Math.max(0, qty - 1);
                        setQty(newQty);
                        handleQuantityChange(newQty);
                      }}
                    >
                      <Icon variant="small">minus</Icon>
                    </Button> */}
                  </div>

                  <Fragment>
                    Quantity:
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <DebouncedNumberInput
                        value={qty}
                        delay={500}
                        onChange={(val) => {
                          setQty(val);
                          handleQuantityChange(val);
                        }}
                        disabled={!customerDetails}
                        initialValue={cartItem?.quantity || 0}
                        style={{
                          padding: "3px",
                          width: "50px",
                          maxHeight: "30px",
                          textAlign: "center",
                        }}
                      />
                    )}
                    {/* <Button
                      size="none"
                      padding="3px"
                      color="primary"
                      variant="outlined"
                      borderColor="primary.light"
                      disabled={!customerDetails}
                      onClick={() => {
                        const newQty = qty + 1;
                        setQty(newQty);
                        handleQuantityChange(newQty);
                      }}
                    >
                      <Icon variant="small">plus</Icon>
                    </Button> */}
                  </Fragment>
                </FlexBox>
              </FlexBox>
            </Box>
          </FlexBox>
        </div>
      </Wrapper>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ images, title, price, id: id as number | string, slug }}
      />
    </>
  );
}
