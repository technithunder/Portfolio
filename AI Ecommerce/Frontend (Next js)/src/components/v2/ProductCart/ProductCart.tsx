"use client";

import styled from "styled-components";
import { space } from "styled-system";
import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import LazyImage from "@component/LazyImage";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";
import { getGuidByCustomerId, getTheme, isValidProp } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setGuidId, upsertCartItem } from "store/slices/cartSlice";
import { useEffect, useState } from "react";
import { addItemToCart, changeItemToCart, checkItemId, removeItemFromCart } from "api";
import TextField from "@component/text-field";
import DebouncedNumberInput from "@utils/debaunceInput";

// STYLED COMPONENTS
const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => isValidProp(prop),
})`
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: ${getTheme("shadows.4")};
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
  ${space}
`;

export default function ProductCart(props) {
  const { product, ...others } = props;
  const currentOrder = useSelector((state: any) => state.cart.items);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const cartItem = useSelector((state: any) =>
    state.cart.items.find((item: any) => String(item.id) === String(product?.itemID))
  );
  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    } else {
      setQty(0);
    }
  }, [cartItem]);

  const existingItem = currentOrder?.find((item) => item.id === product?.itemID);
  const [qty, setQty] = useState(existingItem?.quantity || 0);

  useEffect(() => {
    setQty(existingItem?.quantity || 0);
  }, [existingItem]);

  const handleQuantityChange = async (newQty: number) => {
    try {
      if (newQty === 0) {
        dispatch(
          upsertCartItem({
            item: {
              id: product?.itemID,
              name: product?.itemDescription,
              price: Number(product?.regular),
            },
            quantity: 0,
          })
        );
        setQty(0);
        return;
      }

      const itemExists = qty > 0;

      if (!itemExists) {
        const checkItemResponse = await checkItemId({
          value_additem_no: product?.itemID,
          value_order_id: "",
          CustomerID: customerDetails.customerID,
          PageString: "",
        });

        if (checkItemResponse.status === 200) {
          const response = await addItemToCart({
            customerId: customerDetails?.customerID,
            itemNo: product?.itemID,
            guid: specificGuid?.guid || "",
            quantity: newQty,
            price: Number(product?.regular),
            umid: String(checkItemResponse?.data[0]?.umid),
          });

          if (response.status === 200) {
            if (!guid) {
              dispatch(setGuidId(response?.data?.guid));
            }
          }
        }
      } else {
        await changeItemToCart(product?.itemID, specificGuid?.guid, newQty);
      }

      // Update Redux cart
      dispatch(
        upsertCartItem({
          item: {
            id: product?.itemID,
            name: product?.itemDescription,
            price: Number(product?.regular),
          },
          quantity: newQty,
        })
      );
      setQty(newQty);
      if (props.onQtyChange) props.onQtyChange();


    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeCartItem = async (itemId: string, umID: string) => {
    try {
      await removeItemFromCart(itemId, specificGuid?.guid, umID);
      dispatch(removeFromCart(itemId));
      if (props.onCartUpdate) props.onCartUpdate();

    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <Wrapper {...others}>
      <LazyImage
        alt={product.itemDescription}
        width={140}
        height={140}
        src={product?.stocked ? `https://orderoasis.net/Banner_images/${product?.stocked}` : `/assets/images/products/ComingSoonImage.png`}
      />

      <FlexBox
        width="100%"
        minWidth="0px"
        flexDirection="column"
        className="product-details"
        justifyContent="space-between"
      >
        <Box>
          <Box
            className="title"
            fontWeight="600"
            display="flex"
            fontSize="18px"
            mb="0.5rem"
            style={{ gap: "1.5rem" }}
          >
            <Typography>{product.itemID}</Typography>
            <Typography>{product.itemDescription}</Typography>
          </Box>
        </Box>
        <Box
          fontSize="14px"
          display="flex"
          mb="0.5rem"
          style={{ gap: "0.5rem" }}
        >
          <Typography color="#2B3445">Pack: {product.pack}</Typography>
          <Typography color="#2B3445">Size: {product.size}</Typography>
          <Typography color="#2B3445">On Sale: {product.onSale}</Typography>
        </Box>
        <Box position="absolute" right="1rem" top="1rem">

          <IconButton padding="4px" ml="12px" onClick={() => removeCartItem(product.itemID, product.uM_ID)}>
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <FlexBox flexWrap="wrap" alignItems="center">
            <Typography color="gray.600" mr="0.5rem">
              ${product.regular} x {product.qty}
            </Typography>

            <Typography fontWeight={600} color="primary.main" mr="1rem">
              ${(product.regular * product.qty)?.toFixed(2)}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            {/* <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              margin="0.5rem"
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

            {/* <TextField
              style={{
                padding: "4px",
                width: "30px",
                height: "32px",
                textAlign: "center",
              }}
              disabled={!customerDetails || product.stocked <= 0}

              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setQty(value);
                  handleQuantityChange(value);
                }
              }}
              value={qty}
            /> */}
            Quantity:
            <DebouncedNumberInput
              value={qty}
              onChange={(val) => {
                setQty(val);
                handleQuantityChange(val);
              }}
              initialValue={cartItem?.quantity || 0}

              style={{ marginLeft:"5px", padding: "3px", width: "50px", maxHeight: "30px", textAlign: "center" }}
            />
            {/* <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              margin="0.5rem"
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
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
}
