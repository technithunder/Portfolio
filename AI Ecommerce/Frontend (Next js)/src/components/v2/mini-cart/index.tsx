'use client';
import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, upsertCartItem } from "store/slices/cartSlice";
import { changeItemToCart, getOrderTotal, removeItemFromCart } from "api";
import { currency, getGuidByCustomerId } from "@utils/utils";
import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import Spinner from "@component/Spinner";
import { StyledMiniCart } from "./styles";

// ==============================================================
type MiniCartProps = {
  toggleSidenav?: () => void;
  loading?: boolean;
  orders?: any[];
  setOrders?: React.Dispatch<React.SetStateAction<any[]>>;
};
// ==============================================================

export default function MiniCart({
  toggleSidenav = () => {},
  loading,
  orders = [],
  setOrders,
}: MiniCartProps) {
  const dispatch = useDispatch();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, items: cartItems = [] } = useSelector((state: any) => state.cart);
  const totalAmount = useSelector((state: any) => state.cart.totalAmount);
  const [imgSrc,setImgSrc]=useState("")
    const [orderTotal, setOrderTotal] = useState<any>({});
  
    const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  
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
  
    useEffect(() => {
      getTotalOrderAmount();
    }, []);
  
  const handleCartChange = async (newQty: number, itemId: string) => {
    try {
      await changeItemToCart(itemId, specificGuid?.guid, newQty);
  
      const updatedItem = cartItems.find((item: any) => item.id === itemId);
      if (updatedItem) {
        dispatch(
          upsertCartItem({
            item: {
              id: updatedItem.id,
              name: updatedItem.name,
              price: updatedItem.price,
            },
            quantity: newQty,
          })
        );
      }
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };
  
  const removeCartItem = async (itemId: string, umID: string) => {
    try {
      await removeItemFromCart(itemId, specificGuid?.guid, umID);
  
      setOrders?.((prev: any[]) =>
        prev.filter((item) => item.itemID !== itemId)
      );
  
      dispatch(removeFromCart(itemId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item: any) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {totalQuantity}
          </Typography>
        </FlexBox>

        <Divider />

        {cartItems.length === 0 ? (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 80px)"
          >
            <Image
              src="/assets/images/logos/shopping-bag.svg"
              width={90}
              height={90}
              alt="empty cart"
            />
            <Paragraph
              mt="1rem"
              color="text.muted"
              textAlign="center"
              maxWidth="200px"
            >
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        ) : (
          cartItems.map((item: any) => (
            <Fragment key={item.itemID}>
              <div className="cart-item">
                <FlexBox alignItems="center" flexDirection="column">
                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={() =>
                      handleCartChange(item.quantity + 1, item.id)
                    }
                  >
                    <Icon variant="small">plus</Icon>
                  </Button>

                  <Typography fontWeight={600} fontSize="15px" my="3px">
                    {item.quantity}
                  </Typography>

                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={() =>
                      handleCartChange(item.quantity - 1, item.id)
                    }
                    disabled={item.quantity === 0}
                  >
                    <Icon variant="small">minus</Icon>
                  </Button>
                </FlexBox>

                <Link href={`/product/${item.id}`}>
                  <Avatar
                    size={76}
                    mx="1rem"
                    alt={item.name}
                    src={imgSrc ? imgSrc : item.id ? `https://orderoasis.net/Banner_images/${item?.id}.jpg` : `assets/images/products/ComingSoonImage.png`}
                    onError={() =>
                      setImgSrc("/assets/images/products/ComingSoonImage.png")
                    }
                  />
                </Link>

                <div className="product-details">
                  <Link href={`/product/${item.id}`}>
                    <H5 className="title" fontSize="14px">
                      {item.name}
                    </H5>
                  </Link>

                  <Tiny color="text.muted">
                    ${(item.price)} x {item.quantity}
                  </Tiny>

                  <Typography fontWeight={600} fontSize="14px" color="primary.main" mt="4px">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </div>

                <div onClick={() => removeCartItem(item.id, item.umid)}>
                  <Icon size="1rem" ml="1.25rem" className="clear-icon">
                    close
                  </Icon>
                </div>
              </div>
              <Divider />
            </Fragment>
          ))
        )}
      </div>

      {!!cartItems.length && (
        <div className="actions">
          <Link href="/checkout">
            <Button fullwidth color="primary" variant="contained" onClick={toggleSidenav}>
              <Typography fontWeight={600}>
                Checkout Now ${totalAmount.toFixed(2)}
              </Typography>
            </Button>
          </Link>

          <Link href="/cart">
            <Button fullwidth color="primary" variant="outlined" mt="1rem" onClick={toggleSidenav}>
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </div>
      )}
    </StyledMiniCart>
  );
}
