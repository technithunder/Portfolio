"use client";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import Card from "@component/Card";
import Image from "@component/Image";
import { Chip } from "@component/Chip";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H5, SemiSpan } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { currency, getGuidByCustomerId, getTheme } from "@utils/utils";
import Select from "@component/Select";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentOrderId, setGuidId, updateUmid, upsertCartItem } from "store/slices/cartSlice";
import { addItemToCart, changeItemToCart, checkItemId, getCurrentOrder } from "api";
import TextField from "@component/text-field";
import Spinner from "@component/Spinner";
import DebouncedNumberInput from "@utils/debaunceInput";
import { CART_QUEUE, CURRENT_ORDER_ID } from "@hook/useSharedState";
import NextImage from "@component/NextImage";

// STYLED COMPONENT
const Wrapper = styled(Card)`
  border-radius: 0.5rem;
  .quick-view {
    top: 0.75rem;
    display: none;
    right: 0.75rem;
    cursor: pointer;
    position: absolute;
  }
  .categories {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .categories {
    display: flex;
    .link {
      font-size: 14px;
      margin-right: 0.5rem;
      text-decoration: underline;
      color: ${getTheme("colors.text.hint")};
    }
  }

  h4 {
    text-align: left;
    margin: 0.5rem 0px;
    color: ${getTheme("colors.text.secondary")};
  }

  .price {
    display: flex;
    font-weight: 600;
    margin-top: 0.5rem;

    h4 {
      margin: 0px;
      padding-right: 0.5rem;
      color: ${getTheme("colors.primary.main")};
    }
    del {
      color: ${getTheme("colors.text.hint")};
    }
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
  }

  &:hover {
    .add-cart {
      display: flex;
    }
    .quick-view {
      display: block;
    }
  }
`;

// ============================================================================
type ListCardProps = {
  off?: number;
  slug: string;
  title: string;
  price: number;
  imgUrl: string;
  rating: number;
  images: string[];
  id: string | number;
  categories: string[];
  productInfo?: any;

  [key: string]: unknown;
};
// ============================================================================

export default function ListCard({
  id,
  off,
  slug,
  title,
  price,
  imgUrl,
  rating,
  images,
  categories,
  size,
  pack,
  productInfo,
  newQty,
  ...props
}: ListCardProps) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(newQty);
  const [currentOrder, setCurrentOrder] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, items, currentOrderId } = useSelector((state: any) => state.cart);
  const [productsQueue, setProductsQueue] = CART_QUEUE.useSharedState();
  const [imgSrc, setImgSrc] = useState('')
  const dispatch = useDispatch();

  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const getOrders = async () => {
    setIsLoading(true);
    const response = await getCurrentOrder(customerDetails.customerID, specificGuid?.guid);
    if (response?.data?.length) {
      setCurrentOrder(response.data);
    }
    setIsLoading(false);
  };
  const currentOrderItem = currentOrder.find((orderItem) => orderItem.itemID === productInfo?.itemID);
  const currentQty = currentOrderItem ? currentOrderItem.qty : qty;

  useEffect(() => {
    getOrders()
  }, [])

  const cartItem = useSelector((state: any) =>
    state.cart.items.find((item: any) => String(item.id) === String(productInfo?.itemID))
  );

  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity);
    } else {
      setQty(0);
    }
  }, [cartItem]);

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
            dispatch(setCurrentOrderId(response?.data?.guid))
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
    } else {
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
    console.log('249 ===>')
    setProductsQueue((prev) => [
      ...productsQueue,
      {
        ...productInfo,
        newQty: newQty,
      },
    ]);
  };

  const handleQuantityChange = async (newQty: number) => {
    try {
      addItemInStore(newQty);
      if (items.length < 1 && !currentOrderId) {
        addItemInOrder(productInfo, newQty);
      } else if(currentOrderId){
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

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);
  const orderStatusList = [{ label: "DFLT", value: "dft" }];

  return (
    <Wrapper overflow="hidden" width="100%" {...props}>
      <Grid container spacing={1}>
        <Grid item md={3} sm={3} xs={12}>
        <Link href={`/product/${productInfo?.itemID}`} tabIndex={-1}>

          <Box position="relative">
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
              >
                {off}% off
              </Chip>
            )}
            {/* <Image
              src={imgSrc}
              alt={title}
              width="100%"
              borderRadius="0.5rem"
            /> */}
            <NextImage
              alt={title}
              width={277}
              src={ imgSrc ? imgSrc : productInfo.stocked
                ? `https://orderoasis.net/Banner_images/${productInfo.stocked}`
                : productInfo.itemID
                ? `https://orderoasis.net/Banner_images/${productInfo.itemID}.jpg`
                : imgSrc}
              borderRadius="0.5rem"
              height={270}
              onError={() => setImgSrc('/assets/images/products/ComingSoonImage.png')}
            />
          </Box>
          </Link>
        </Grid>

        <Grid item md={9} sm={9} xs={12}>
          <FlexBox
            flexDirection="column"
            justifyContent="center"
            height="100%"
            p="1rem"
          >
            <Link href={`/product/${productInfo?.itemID}`} tabIndex={-1}>
              <H5 fontWeight="600" my="0.5rem">
                {title}
              </H5>
            </Link>

            {/* <Rating value={rating || 3} outof={5} color="warn" /> */}

            <FlexBox mt="0.5rem" mb="1rem" alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr="0.5rem">
                ${price}
              </H5>

              {off > 0 && (
                <SemiSpan fontWeight="600">
                  <del>{currency(price)}</del>
                </SemiSpan>
              )}
            </FlexBox>

            <div style={{ gap: "10px", display: "flex" }}>
              <SemiSpan>size: {size}</SemiSpan>
              <SemiSpan>pack: {pack}</SemiSpan>
            </div>

            <FlexBox
              flexDirection="row"
              justifyContent="flex-end"
              style={{ gap: "20px" }}
            >
              <FlexBox
                alignItems="center"
                flexDirection="row"
                style={{ gap: "5px" }}
              >
                {/* <Select 
                placeholder="DFLT" 
                options={orderStatusList} 
                styles={{
                  control: (base:any) => ({
                    ...base,
                    height: '28px !important',
                    minHeight: 'unset !important',
                  }),
                  indicatorsContainer: (provided:any) => ({
                    ...provided,
                    padding: "0px !important",
                  }),
                  dropdownIndicator: (provided:any) => ({
                    ...provided,
                    padding: "0px",
                  }),
                  valueContainer:(provided:any)=> ({
                    ...provided,
                    padding:'0px'
                  })
                }} 
                />  */}

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

                <Fragment>
                    Quantity:
                    <DebouncedNumberInput
                      value={qty as any}
                      onChange={(val) => {
                        setQty(val);
                        handleQuantityChange(val);
                      }}
                      initialValue={cartItem?.quantity || 0}

                    style={{ padding: "3px", width: "50px", maxHeight: "30px", textAlign: "center" }}
                  />
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
          </FlexBox>
        </Grid>
      </Grid>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ id, images, price, title, slug }}
      />
    </Wrapper>
  );
}
