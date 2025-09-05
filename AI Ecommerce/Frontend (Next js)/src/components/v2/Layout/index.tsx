"use client";

import Sticky from "@component/sticky";
import Header from "@component/v2/Header";
import MobileNavigationBar from "@component/mobile-navigation";
import StyledAppLayout from "./styles";
import Container from "@component/Container";
import Footer from "@component/v2/Footer";

export default function MainLayout({
  children,
  displayCart = true
}: {
  children: React.ReactNode;
  displayCart?: boolean;
}) {
  return (
    <StyledAppLayout>
      <Sticky fixedOn={0} scrollDistance={300}>
        <Header display={displayCart} />
      </Sticky>
      <Container>{children}</Container>

      <MobileNavigationBar />

      {/* <Footer /> */}
    </StyledAppLayout>
  );
}
