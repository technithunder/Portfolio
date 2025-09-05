"use client";
import { useCallback, useEffect, useState } from "react";
import Box from "@component/Box";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H1, H2, H6, SemiSpan } from "@component/Typography";
import { changeItemToCart } from "api";
import { addItemToCart, checkItemId } from "api";
import { useDispatch, useSelector } from "react-redux";
import { setGuidId, upsertCartItem } from "store/slices/cartSlice";
import { getGuidByCustomerId } from "@utils/utils";
import DebouncedNumberInput from "@utils/debaunceInput";

export default function ProductIntro({ additionalInfo, productDetails, newQty }) {
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, items } = useSelector((state: any) => state.cart);
  const [qty, setQty] = useState(newQty);
  const [show, setShow] = useState(false);
  const [imgSrc,setImgSrc]=useState("")
  const [isLoading, setIsLoading] = useState(false);

  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  };

  // @ts-ignore
  const updatedQty = getQtyFromCart(additionalInfo?.itemID as any)

  useEffect(() => {
    setQty(updatedQty);
  }, [updatedQty])

  const dispatch = useDispatch();

  const handleQuantityChange = async (newQty: number) => {
    try {

      if (newQty > 0) {
        const isExistingItem = items.some(item => item.id === additionalInfo?.itemID);

        if (!isExistingItem) {
          const checkItemResponse = await checkItemId({
            value_additem_no: additionalInfo?.itemID,
            value_order_id: "",
            CustomerID: customerDetails.customerID,
            PageString: "",
          });

          if (checkItemResponse.status === 200) {
            const response = await addItemToCart({
              customerId: customerDetails?.customerID,
              itemNo: additionalInfo?.itemID,
              guid: specificGuid?.guid || "",
              quantity: newQty,
              price: Number(additionalInfo?.regularPrice),
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
                    id: additionalInfo?.itemID,
                    name: additionalInfo?.itemDescription,
                    price: Number(additionalInfo?.regularPrice),
                    umid: String(checkItemResponse?.data[0]?.umid),
                  },
                  quantity: newQty,
                })
              );
            }
          }
        } else {
          const checkItemResponse = await changeItemToCart(
            additionalInfo?.itemID,
            specificGuid?.guid,
            newQty
          );

          if (checkItemResponse.status === 200) {
            dispatch(
              upsertCartItem({
                item: {
                  id: additionalInfo?.itemID,
                  name: additionalInfo?.itemDescription,
                  price: Number(additionalInfo?.regularPrice),
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
          additionalInfo?.itemID,
          specificGuid?.guid,
          0
        );

        if (response.status === 200) {
          dispatch(
            upsertCartItem({
              item: {
                id: additionalInfo?.itemID,
                name: additionalInfo?.itemDescription,
                price: Number(additionalInfo?.regularPrice),
              },
              quantity: 0,
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
              mt="1rem"
            >
              <Image
                width={300}
                height={300}
                src={imgSrc ? imgSrc : `${additionalInfo?.stocked
                    ? `https://orderoasis.net/Banner_images/${additionalInfo?.stocked}`
                    : `https://orderoasis.net/Banner_images/${additionalInfo?.itemID}.jpg`
                  }`}
                style={{ display: "block", width: "100%", height: "auto" }}
                onError={() =>
                  setImgSrc("/assets/images/products/ComingSoonImage.png")
                }
              />
            </FlexBox>

            {/* <FlexBox overflow="auto">
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
                  onClick={handleImageClick(ind)}
                >
                  <Avatar src={url} borderRadius="10px" size={65} />
                </Box>
              ))}
            </FlexBox> */}
          </div>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1>{additionalInfo?.itemID}</H1>
          <H1 mb="1rem">{additionalInfo?.itemDescription}</H1>

          <Box mb="24px">
            <H2 color="primary.main" mb="4px" lineHeight="1">
              ${additionalInfo?.regularPrice}
            </H2>

            <SemiSpan color="inherit">{additionalInfo?.qty_available > 0 ? "Stock Available" : "Out of Stock"}</SemiSpan>
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
            // onClick={handleCartAmountChange(cartItem?.qty + 1)}
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
            // onClick={handleCartAmountChange(cartItem?.qty + 1)}
            >
              PLT
            </Button>
          </FlexBox>

          <FlexBox alignItems="center">
            {/* {qty > 0 && ( */}
            <FlexBox alignItems="center" marginBottom="10px">
              {/* <Button
                  size="small"
                  padding="9px"
                  margin="5px"
                  color="dark"
                  style={{ backgroundColor: "#D3D3D3" }}
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
                      padding: "9px",
                      margin: "5px",
                      width: "40px",
                      maxHeight: "40px",
                      textAlign: "center",
                    }}
                    value={qty}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value = parseInt(raw);
                      if (!isNaN(value)) {
                        setQty(value);
                        debouncedHandleQtyChange(value);
                      }
                    }}
                  /> */}
              Quantity:
              <DebouncedNumberInput
                value={qty}
                onChange={(val) => {
                  setQty(val);
                  handleQuantityChange(val);
                }}
                style={{ marginLeft:"5px" ,padding: "5px", width: "50px", maxHeight: "35px",textAlign: "center" }}
              />
              {/* <Button
                  size="small"
                  padding="9px"
                  margin="5px"
                  color="dark"
                  style={{ backgroundColor: "#D3D3D3" }}
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
            {/* )} */}
            {/* {qty === 0 && ( */}
            {/* <Button
                size="medium"
                color="primary"
                variant="contained"
                style={{ marginBottom: "10px", marginLeft: "10px" }}
                onClick={() => {
                  setShow(true);
                  setQty(1);
                  handleQuantityChange(1);
                }}
              >
                Add to Cart
              </Button>
            )} */}
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
}
