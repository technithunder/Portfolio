"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Login from "@sections/auth/Login";

import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import { Tiny } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import Categories from "@component/categories/Categories";
import { useAppContext } from "@context/app-context";
import StyledHeader from "./styles";
import UserLoginDialog from "./LoginDialog";
import MiniCart from "@component/v2/mini-cart";
import { getCurrentOrder } from "api";
import { getGuidByCustomerId } from "@utils/utils";
import { useSelector } from "react-redux";

// ====================================================================
type HeaderProps = { isFixed?: boolean; className?: string; display?: boolean };
// =====================================================================

export default function Header({ isFixed, className, display }: HeaderProps) {
  const { state } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const [orders, setOrders] = useState([]);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);

  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => setOpenDialog(!openDialog);

  const getOrders = async () => {
    setLoading(true);
    const response = await getCurrentOrder(
      customerDetails.customerID,
      specificGuid?.guid
    );

    if (response?.data?.length) {
      setOrders(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const CART_HANDLE = (
    <Box ml="20px" position="relative">
      <IconButton bg="gray.200" p="12px" size="small">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {display && (
        <>
          {!!orders.length && (
            <FlexBox
              top={-5}
              right={-5}
              height={20}
              minWidth={20}
              bg="primary.main"
              borderRadius="50%"
              alignItems="center"
              position="absolute"
              justifyContent="center"
            >
              <Tiny color="white" fontWeight="600" lineHeight={1}>
                {totalQuantity}
              </Tiny>
            </FlexBox>
          )}
        </>
      )}
    </Box>
  );

  const LOGIN_HANDLE = (
    <IconButton ml="1rem" bg="gray.200" p="8px">
      <Icon size="28px">user</Icon>
    </IconButton>
  );

  return (
    <StyledHeader className={className}>
      <Container
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <FlexBox className="logo" alignItems="center" mr="1rem">
          <Link href="/">
            <Image src="/assets/images/logo.svg" alt="logo" mt="10px" />
          </Link>

          {isFixed && (
            <div className="category-holder">
              <Categories>
                <FlexBox color="text.hint" alignItems="center" ml="1rem">
                  <Icon>categories</Icon>
                  <Icon>arrow-down-filled</Icon>
                </FlexBox>
              </Categories>
            </div>
          )}
        </FlexBox>
        {/* <FlexBox
          className="root"
          position="relative"
          flexDirection="row"
        > */}
        {/* <div style={{justifyContent:'space-between', display:'flex'}}> */}
        <div className="navs-wrapper">
          <div>
            <Link href="/" title="badge" style={{ margin: 0 }}>
              Home
            </Link>
          </div>
          <div>
            <Link href="/" title="badge" style={{ marginRight: 0 }}>
              Catalog
            </Link>
          </div>
          <div>
            <Link href="/" title="badge" style={{ marginRight: 0 }}>
              OrderList
            </Link>
          </div>
          <div>
            <Link href="https://www.bannerwholesale.com/contact-us/" title="badge" style={{ marginRight: 0 }}>
              Contact Us
            </Link>
          </div>
        </div>

        {/* </FlexBox> */}
        <FlexBox className="header-right" alignItems="center">
          {/* <UserLoginDialog
            handle={LOGIN_HANDLE}
            open={openDialog}
            toggleDialog={toggleDialog}
          >
            <div>
              <Login toggleDialog={toggleDialog} />
            </div>
          </UserLoginDialog> */}

          <Sidenav
            open={open}
            width={380}
            position="right"
            handle={CART_HANDLE}
            toggleSidenav={toggleSidenav}
          >
            <MiniCart
              loading={loading}
              orders={orders}
              setOrders={setOrders}
              toggleSidenav={toggleSidenav}
            />
          </Sidenav>
        </FlexBox>
      </Container>
    </StyledHeader>
  );
}
