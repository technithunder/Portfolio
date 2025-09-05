"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Login from "@component/v2/auth/Login";
import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import { Tiny } from "@component/Typography";
import { Button, IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import Categories from "@component/categories/Categories";
import StyledHeader from "./styles";
import UserLoginDialog from "./LoginDialog";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import Menu from "@component/Menu";
import MenuItem from "@component/MenuItem";
import { logout } from "store/slices/authSlice";
import { useRouter } from "next/navigation";
import { removeCustomer } from "store/slices/customerSlice";
import {
  removeGuiId,
  setCurrentOrderId,
  setGuidId,
  updateUmid,
} from "store/slices/cartSlice";
import { addItemToCart, checkItemId, getCurrentOrder } from "api";
import MiniCart from "../mini-cart";
import { getGuidByCustomerId } from "@utils/utils";
import { CART_QUEUE, CURRENT_ORDER_ID } from "@hook/useSharedState";

// ====================================================================
type HeaderProps = { isFixed?: boolean; className?: string; display?: boolean };
// =====================================================================

const StyledLink = styled(Link) <{
  publicLink?: boolean;
  isAuthorizedUser: boolean;
}>`
  margin: 0;
  cursor: ${(props) =>
    props.publicLink
      ? "pointer"
      : props.isAuthorizedUser
        ? "pointer"
        : "not-allowed"};
  pointer-events: ${(props) =>
    props.publicLink ? "unset" : props.isAuthorizedUser ? "unset" : "none"};
  text-decoration: none;
  color: #4586b8;
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
const LogoWrapper = styled.div`
  img {
    @media (max-width: 1024px) {
      width: 48px;
    }

    @media (max-width: 768px) {
      width: 40px;
    }

    @media (max-width: 480px) {
      width: 36px;
    }
  }
`;

const MobileNavContent = styled(Box)`
  display: flex;
  flex-direction: column;

  a {
    font-size: 18px; // Increase font size for links
    margin-bottom: 1rem;
  }
`;

const MobileNavWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = ({ isFixed, className, display }: HeaderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // @ts-ignore
  const { token } = useSelector((state) => state.auth);
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);
  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);
  const isAuthorizedUser = token ? true : false;
  const [loading, setLoading] = useState(false);
  const { guid, items, currentOrderId } = useSelector(
    (state: any) => state.cart
  );
  const [orders, setOrders] = useState([]);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [productsQueue, setProductsQueue] = CART_QUEUE.useSharedState();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);
  const [openDialog, setOpenDialog] = useState(false);
  
  console.log("101 ===>", productsQueue, currentOrderId);

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

  const addItemInOrder = async (productInfo, newQty) => {
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
    }
  };

  useEffect(() => {
    console.log(
      "158 ===>",
      currentOrderId,
      "<=== currentOrderID",
      productsQueue
    );
    if (currentOrderId && productsQueue?.length > 0) {
      productsQueue.forEach((item, index) => {
        addItemInOrder(item, item.newQty);
        setProductsQueue(productsQueue.filter((i) => i !== item));
      });
    }
  }, [productsQueue, currentOrderId]);

  const CART_HANDLE = (
    <Box ml="20px" position="relative">
      {isAuthorizedUser && display !== false && (
        <IconButton bg="gray.200" p="12px" size="small">
          <Icon size="22px">bag</Icon>
        </IconButton>
      )}

      <>
        {totalQuantity > 0 && display !== false && (
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
    </Box>
  );

  const onLogout = () => {
    dispatch(logout());
    dispatch(removeCustomer());
    router.push("/login");
  };

  const LOGIN_HANDLE = isAuthorizedUser ? (
    <Menu
      handler={
        <IconButton ml="1rem" bg="gray.200" p="8px">
          <Icon size="28px">user</Icon>
        </IconButton>
      }
    >
      <MenuItem onClick={onLogout}>Log out</MenuItem>
    </Menu>
  ) : (
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
          <LogoWrapper>
            <Link href="/store">
              <Image
                src="/assets/images/logo.svg"
                alt="logo"
                mt="10px"
                height="auto"
              />
            </Link>
          </LogoWrapper>

          {!customerDetails &&
            <Box className="customer-info">
              <span>
                <Link href="/">Click Here To Select <br /> Customer Location</Link>
              </span>
            </Box>
          }
          {isAuthorizedUser && customerDetails && (
            <Box className="customer-info">
              <span className="responsive-link">
                <Link href="/">{customerDetails?.name}</Link>
              </span>
              <span className="responsive-link">
                <Link href="/">Customer ID: {customerDetails?.customerID}</Link>
              </span>
            </Box>
          )}

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
        <div className="navs-wrapper">
          <div>
            <StyledLink
              isAuthorizedUser={isAuthorizedUser && customerDetails}
              href="/store"
              title="badge"
            >
              Home
            </StyledLink>
          </div>
          <div>
            <StyledLink
              publicLink={true}
              isAuthorizedUser={isAuthorizedUser}
              href="/catelog"
              title="badge"
            >
              Catalog
            </StyledLink>
          </div>
          <div>
            <StyledLink
              isAuthorizedUser={isAuthorizedUser && customerDetails}
              href="/order-list"
              title="badge"
            >
              Order List
            </StyledLink>
          </div>
          <div>
            <StyledLink
              isAuthorizedUser={isAuthorizedUser && customerDetails}
              href="/invoices"
              title="badge"
            >
              Invoices
            </StyledLink>
          </div>
          <div>
            <StyledLink
              publicLink={true}
              isAuthorizedUser={isAuthorizedUser}
              href="https://www.bannerwholesale.com/contact-us/"
              title="badge"
            >
              Contact Us
            </StyledLink>
          </div>
        </div>

        {/* </FlexBox> */}
        <FlexBox className="header-right" alignItems="center">
          <MobileNavWrapper>
            <Sidenav
              handle={
                <IconButton bg="gray.200" p="8px" ml="1rem">
                  <Icon size="25px">menu</Icon>
                </IconButton>
              }
              open={mobileNavOpen}
              width={280}
              position="left"
              toggleSidenav={toggleMobileNav}
            >
              <Box p="1rem" display="flex" flexDirection="column">
                <MobileNavContent p="1rem">

                  <StyledLink
                    isAuthorizedUser={isAuthorizedUser && customerDetails}
                    href="/store"
                  >
                    Home
                  </StyledLink>
                  <StyledLink
                    publicLink={true}
                    isAuthorizedUser={isAuthorizedUser}
                    href="/catelog"
                  >
                    Catalog
                  </StyledLink>
                  <StyledLink
                    isAuthorizedUser={isAuthorizedUser && customerDetails}
                    href="/order-list"
                  >
                    Order List
                  </StyledLink>
                  <StyledLink
                    isAuthorizedUser={isAuthorizedUser && customerDetails}
                    href="/invoices"
                  >
                    Invoices
                  </StyledLink>
                  <StyledLink
                    publicLink={true}
                    isAuthorizedUser={isAuthorizedUser}
                    href="https://www.bannerwholesale.com/contact-us/"
                  >
                    Contact Us
                  </StyledLink>
                  {isAuthorizedUser && (
                    <Button variant="outlined" color="primary" onClick={onLogout} width="200px">
                      Logout
                    </Button>
                  )}
                </MobileNavContent>
              </Box>
            </Sidenav>
          </MobileNavWrapper>
          <DesktopOnly>

            <UserLoginDialog
              handle={LOGIN_HANDLE}
              open={openDialog}
              toggleDialog={toggleDialog}
            >
              <div>
                <Login toggleDialog={toggleDialog} />
              </div>
            </UserLoginDialog>
          </DesktopOnly>

          {isAuthorizedUser && (
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
          )}
        </FlexBox>
      </Container>
    </StyledHeader>
  );
};

export default Header;
