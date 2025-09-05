import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency, getGuidByCustomerId } from "@utils/utils";
// STYLED COMPONENT
import { StyledMiniCart } from "./styles";
import { useSelector } from "react-redux";
import { changeItemToCart, getCurrentOrder, removeItemFromCart } from "api";
import Spinner from "@component/Spinner";
// ==============================================================
type MiniCartProps = { toggleSidenav?: () => void };
// ==============================================================

export default function MiniCart({ toggleSidenav = () => {} }: MiniCartProps) {
  const [loading, setLoading] = useState(false);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid, totalQuantity } = useSelector((state: any) => state.cart);
  const [orders, setOrders] = useState([]);

  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);

  const getOrders = async () => {
    setLoading(true);
    const response = await getCurrentOrder(customerDetails.customerID, specificGuid?.guid);
    if (response?.data?.length) {
      setOrders(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getTotalPrice = () => {
    return orders
      .reduce((total, order) => {
        return total + parseFloat(order.salesPricePerCase) * order.qty;
      }, 0)
      .toFixed(2);
  };

  const handleCartChange = async (newQty: number, itemId: string) => {
    try {
      await changeItemToCart(itemId, specificGuid?.guid, newQty);

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.itemID === itemId ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      console.error("Error changing cart amount:", error);
    }
  };
  const removeCartItem = async (itemId: string, umID: string) => {
    try {
      await removeItemFromCart(itemId, specificGuid?.guid, umID);

      setOrders((prevOrders) =>
        prevOrders.filter((item) => item.itemID !== itemId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {orders?.length}
          </Typography>
        </FlexBox>

        <Divider />

        {!orders.length && !loading && (
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
              alt="bonik"
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
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100% - 80px)",
            }}
          >
            <Spinner />
          </div>
        ) : (
          orders?.map((item) => (
            <Fragment key={item.id}>
              <div className="cart-item">
                <FlexBox alignItems="center" flexDirection="column">
                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={() => {
                      const newQty = Math.max(0, item.qty + 1);
                      handleCartChange(newQty, item.itemID);
                    }}
                  >
                    <Icon variant="small">plus</Icon>
                  </Button>

                  <Typography fontWeight={600} fontSize="15px" my="3px">
                    {item.qty}
                  </Typography>

                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={() => {
                      const newQty = Math.max(0, item.qty - 1);
                      handleCartChange(newQty, item.itemID);
                    }}
                    disabled={item.qty === 1}
                  >
                    <Icon variant="small">minus</Icon>
                  </Button>
                </FlexBox>

                <Link href={`/product/${item.slug}`}>
                  <Avatar
                    size={76}
                    mx="1rem"
                    alt={item.name}
                    src={item.stocked ? `https://orderoasis.net/Banner_images/${item?.stocked}` : `assets/images/products/ComingSoonImage.png`}
                  />
                </Link>

                <div className="product-details">
                  <Link href={`/product/${item.id}`}>
                    <H5 className="title" fontSize="14px">
                      {item.itemDescription}
                    </H5>
                  </Link>

                  <Tiny color="text.muted">
                    {currency(item.salesPricePerCase, 0)} x {item.qty}
                  </Tiny>

                  <Typography
                    fontWeight={600}
                    fontSize="14px"
                    color="primary.main"
                    mt="4px"
                  >
                    ${(item.qty * item.salesPricePerCase).toFixed(2)}
                  </Typography>
                </div>
                <div onClick={() => removeCartItem(item.itemID, item.umID)}>
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

      {!!orders.length && (
        <div className="actions">
          <Link href="/checkout">
            <Button
              fullwidth
              color="primary"
              variant="contained"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>
                Checkout Now ${currency(getTotalPrice())}
              </Typography>
            </Button>
          </Link>

          <Link href="/cart">
            <Button
              fullwidth
              color="primary"
              variant="outlined"
              mt="1rem"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </div>
      )}
    </StyledMiniCart>
  );
}
