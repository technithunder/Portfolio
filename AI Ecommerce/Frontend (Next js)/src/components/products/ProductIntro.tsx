"use client";

import { useState } from "react";
import Box from "@component/Box";
import Image from "@component/Image";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H1, H2, H6, SemiSpan } from "@component/Typography";
import TextField from "@component/text-field";
import { changeItemToCart } from "api";
import { addItemToCart, checkItemId } from "api";
import { useDispatch, useSelector } from "react-redux";
import { setGuidId, upsertCartItem } from "store/slices/cartSlice";
import { getGuidByCustomerId } from "@utils/utils";

// ========================================
interface Props {
  price: number;
  title: string;
  images: string[];
  id: string | number;
}
// ========================================

export default function ProductIntro({ images, title, price, id }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [qty, setQty] = useState(0);

  // @ts-ignore
  const { productDetails } = useSelector((state) => state.product);

  const handleQuantityChange = async (newQty: number) => {

    try {
      if (qty === 0) {
        const checkItemResponse = await checkItemId({
          value_additem_no: productDetails?.itemID,
          value_order_id: "",
          CustomerID: customerDetails.customerID,
          PageString: "",
        });
  
        if (checkItemResponse.status === 200) {
          const response = await addItemToCart({
            customerId: customerDetails?.customerID,
            itemNo: productDetails?.itemID,
            guid: specificGuid?.guid || "",
            quantity: newQty,
            price: Number(productDetails?.regular),
            umid: String(checkItemResponse?.data[0]?.umid),
          });
    
          if (response.status === 200) {
            setQty(newQty);
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
                  id: productDetails?.itemID,
                  name: productDetails?.name,
                  price: Number(productDetails?.regular),
                },
                quantity: newQty,
              })
            );
          }
        }
      }else {
        const checkItemResponse = await changeItemToCart(productDetails?.itemID, specificGuid?.guid, newQty);
        if(checkItemResponse.status === 200){
          dispatch(
            upsertCartItem({
              item: {
              id: productDetails?.itemID,
              name: productDetails?.name,
              price: Number(productDetails?.regular),
            },
            quantity: newQty,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <Box overflow="hidden">
      <Grid container justifyContent="center" alignItems="center" spacing={16}>
        <Grid item md={6} xs={12} alignItems="center">
          <div>
            <FlexBox
              mb="50px"
              overflow="hidden"
              borderRadius={16}
              justifyContent="center"
              backgroundColor="white"
            >
              <Image
                width={300}
                height={300}
                src={images[0]}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </FlexBox>

            <FlexBox overflow="auto">
              {images.map((url, ind) => (
                <Box
                  key={ind}
                  size={70}
                  bg="white"
                  minWidth={70}
                  display="flex"
                  cursor="pointer"
                  border="1px solid"
                  borderRadius="10px"
                  alignItems="center"
                  justifyContent="center"
                  ml={ind === 0 ? "auto" : ""}
                  mr={ind === images.length - 1 ? "auto" : "10px"}
                  borderColor={
                    selectedImage === ind ? "primary.main" : "gray.400"
                  }
                >
                  <Avatar src={url} borderRadius="10px" size={65} />
                </Box>
              ))}
            </FlexBox>
          </div>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1>Item ID</H1>
          <H1 mb="1rem">Product Description</H1>

          <Box mb="24px">
            <H2 color="primary.main" mb="4px" lineHeight="1">
              $price
            </H2>

            <SemiSpan color="inherit">Stock Available</SemiSpan>
          </Box>
          <Box mb="1rem">
            <H6 lineHeight="1"> Unit of Measure </H6>
          </Box>
          <FlexBox alignItems="center" mb="1rem">
            <Button
              style={{ backgroundColor: "white", color: "black" }}
              p="9px"
              m="5px"
              size="small"
              color="dark"
              variant="text"
            >
              EA
            </Button>
            <Button
              style={{ backgroundColor: "#2B3445", color: "#FFFFFF" }}
              p="2px"
              m="5px"
              size="small"
              color="dark"
              variant="text"
            >
              DFLT
            </Button>
            <Button
              style={{ backgroundColor: "white", color: "black" }}
              p="9px"
              m="5px"
              size="small"
              color="dark"
              variant="text"
            >
              PLT
            </Button>
          </FlexBox>
          <FlexBox alignItems="center">
            <FlexBox alignItems="center" marginBottom="10px">
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

              <TextField
                style={{
                  padding: "3px",
                  width: "25px",
                  maxHeight: "30px",
                  textAlign: "center",
                }}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setQty(value);
                  handleQuantityChange(value);
                }}
                value={qty}
              />

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
            </FlexBox>

            <Button
              size="medium"
              color="primary"
              variant="contained"
              style={{ marginBottom: "10px", marginLeft: "10px" }}
            >
              Add to Cart
            </Button>
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
}
