"use client";

import Link from "next/link";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import NextImage from "@component/NextImage";
import { H3, SemiSpan } from "@component/Typography";
import { Button } from "@component/buttons";
import { deviceSize } from "@utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useCallback, useEffect, useState } from "react";
import { setGuidId, upsertCartItem } from "store/slices/cartSlice";
import { addItemToCart, changeItemToCart, checkItemId, getCurrentOrder } from "api";
import { getGuidByCustomerId } from "@utils/utils";
import Spinner from "@component/Spinner";
import Icon from "@component/icon/Icon";
import TextField from "@component/text-field";

// STYLED COMPONENT
const Wrapper = styled.div`
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;
  background-color: #fff;
  border-radius: 8px;

  &:hover {
    .details .add-cart {
      display: flex;
    }
    .image-holder .extra-icons {
      display: flex;
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 5px;

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

    .cart-actions {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function TopPurchased({
  id,
  price,
  imgUrl,
  description,
  size,
  slug,
  productInfo,
  ...props
}) {
  const dispatch = useDispatch();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid,items } = useSelector((state: any) => state.cart);

  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [isLoading, setIsLoading] = useState(false);
  const [qty, setQty] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const cartItem = useSelector((state: any) => state.cart.items.find((item: any) => item.id === productInfo?.partNumber));

  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    }
  }, [productInfo?.partNumber,cartItem]);

   const handleQuantityChange = async (newQty: number) => {
      try {
        setIsLoading(true);
    
        if (newQty > 0) {
          const isExistingItem = items.some(item => item.id === productInfo?.partNumber);
    
          if (!isExistingItem) {
            const checkItemResponse = await checkItemId({
              value_additem_no: productInfo?.partNumber,
              value_order_id: "",
              CustomerID: customerDetails.customerID,
              PageString: "",
            });
    
            if (checkItemResponse.status === 200) {
              const response = await addItemToCart({
                customerId: customerDetails?.customerID,
                itemNo: productInfo?.partNumber,
                guid: specificGuid?.guid || "",
                quantity: newQty,
                price: Number(productInfo?.productLine),
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
                      id: productInfo?.partNumber,
                      name: productInfo?.description,
                      price: Number(productInfo?.productLine),
                      umid: String(checkItemResponse?.data[0]?.umid),
                    },
                    quantity: newQty,
                  })
                );
              }
            }
          } else {
            const checkItemResponse = await changeItemToCart(
              productInfo?.itemID,
              specificGuid?.guid,
              newQty
            );
    
            if (checkItemResponse.status === 200) {
              dispatch(
                upsertCartItem({
                  item: {
                    id: productInfo?.partNumber,
                    name: productInfo?.description,
                    price: Number(productInfo?.productLine),
                    umid: String(checkItemResponse?.data[0]?.umid),
                  },
                  quantity: newQty,
                })
              );
            }
          }
        } else {
          // If quantity is 0, treat as "remove from cart"
          const response = await changeItemToCart(
            productInfo?.itemID,
            specificGuid?.guid,
            0
          );
    
          if (response.status === 200) {
            dispatch(
              upsertCartItem({
                item: {
                  id: productInfo?.partNumber,
                  name: productInfo?.description,
                  price: Number(productInfo?.productLine),
                },
                quantity: 0,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debouncedHandleQtyChange = useCallback(
      debounce((val: number) => {
        handleQuantityChange(val);
      }, 500),
      [handleQuantityChange]
    );
  return (
    <Wrapper  {...props}>
      <div className="image-holder">
        <Link href={`/product/${id}`}>
        <Box width="127px" height="126px">
          <NextImage
            alt={description}
            width={227}
            src={imgSrc ? imgSrc : id ? `https://orderoasis.net/Banner_images/${id}.jpg` : `/assets/images/products/ComingSoonImage.png`}
            height={170}
            onError={() => setImgSrc("/assets/images/products/ComingSoonImage.png")}
          />
        </Box>
        </Link>
      </div>

      <div className="details">
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px">
            <div style={{ width: "100%", height: "52px" }}>
              <Link href="#">
                <H3
                  mb="10px"
                  id={id}
                  fontSize="14px"
                  textAlign="center"
                  fontWeight="600"
                  color="text.secondary"
                >
                  {id}
                </H3>
                <H3
                  mb="10px"
                  title={description}
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  className="title"
                  color="text.secondary"
                  style={{ textWrap: "wrap" }}
                >
                  {description}
                </H3>
              </Link>
            </div>

            <FlexBox alignItems="center" mt="65px" justifyContent="space-between" mb={3}>
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                ${price}
              </SemiSpan>
            </FlexBox>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
              <Button
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
              </Button>
              <Fragment>
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 80px)" }}>
                    <Spinner />
                  </div>) : (
                  <TextField
                    style={{
                      padding: "3px",
                      width: "30px",
                      maxHeight: "30px",
                      textAlign: "center",
                    }}
                    // disabled={isLoading}
                    value={qty}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value = parseInt(raw);
                      if (!isNaN(value)) {
                        setQty(value);
                        debouncedHandleQtyChange(value);
                      }
                    }}
                  />)}
                <Button
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
                </Button>
              </Fragment></div>
          </Box>
        </FlexBox>
      </div>
    </Wrapper>
  );
}
