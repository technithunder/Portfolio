"use client";

// API FUNCTIONS
import api from "@utils/__api__/grocery-2";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
// PAGE SECTION COMPONENTS
import Wrapper from "./Wrapper";
import SidenavBar from "./SidenavBar";
import Section1 from "./section-1";
import ShopByCategory from "./ShopByCategory";
import ProductCarousel from "./ProductCarousel";
import ProductCatalog from "./ProductCatalog";
import MainLayout from "../Layout";

export default function HomePage() {
  return (
    <MainLayout>
      <Wrapper>
        {/* SIDEBAR NAVIGATION AREA */}
        <Box className="sidenav" pt="1.5rem">
          <SidenavBar isFixedNave={false} />
        </Box>

        <Box className="content" pt="1.5rem">
          {/* HERO CAROUSEL AREA */}
          <Section1 />

          {/* SHOP BY CATEGORY AREA */}
          <Box mb="5rem">
            <ShopByCategory />
          </Box>

          {/* FEATURED PRODUCTS AREA */}
          

          {/* BEST SELLER PRODUCTS AREA */}
          <Box mb="3rem">
            <ProductCatalog title="Product Catalog" />
          </Box>

          <Box mb="5rem">
            <ProductCarousel title="On Sale" />
          </Box>
          {/* FOOTER AREA */}
          {/* <Footer /> */}
        </Box>
      </Wrapper>
    </MainLayout>
  );
}
