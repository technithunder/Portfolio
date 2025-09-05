"use client";

import { ReactElement, ReactNode } from "react";

import Topbar from "@component/topbar";
import Sticky from "@component/sticky";
import Header from "@component/v2/Header";
import { Footer1 } from "@component/footer";
import MobileNavigationBar from "@component/mobile-navigation";
import StyledAppLayout from "./styles";
import ShopList from "app/(layout-3)/shops/page";
import Grid from "@component/grid/Grid";
import api from "@utils/__api__/shops";
import ShopCard1 from "@sections/shop/ShopCard1";
import { SearchInput } from "@component/search-box";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import { SemiSpan } from "@component/Typography";
import Pagination from "@component/pagination";

// ===============================================================================
type Props = {
  title?: string;
  navbar?: ReactElement;
  children: ReactNode;
  display?: boolean;
};
// ===============================================================================

export default async function ShopLayout({ navbar, children, display }: Props) {
  const shopList = await api.getShopList();

  return (
    <StyledAppLayout>
      {display && <Topbar />}

      <Sticky fixedOn={0} scrollDistance={300}>
        <Header />
      </Sticky>
      {!children && (
        <Container>
          <SearchInput />
          <Grid container spacing={6}>
            {shopList.map((item) => (
              <Grid item lg={4} sm={6} xs={12} key={item.id}>
                <ShopCard1
                  name={item.name}
                  phone={item.phone}
                  address={item.address}
                  rating={item.rating || 5}
                  imgUrl={item.profilePicture}
                  coverImgUrl={item.coverPicture}
                  shopUrl={`/shops/${item.slug}`}
                />
              </Grid>
            ))}
          </Grid>
          <FlexBox
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            mt="32px"
          >
            {/* <SemiSpan>Showing 1-9 of {shopList.length} Shops</SemiSpan> */}
            <Pagination pageCount={Math.ceil(shopList.length / 9)} />
          </FlexBox>
        </Container>
      )}
      <div
        style={{
          marginLeft: "5rem",
          marginRight: "5rem",
          marginBottom: "20px",
        }}
      ></div>

      {children}

      <MobileNavigationBar />

      {/* <Footer1 /> */}
    </StyledAppLayout>
  );
}
