"use client";

import { Fragment, PropsWithChildren } from "react";
import Topbar from "@component/topbar";
import { Footer1 } from "@component/footer";
import Navbar from "@component/navbar/Navbar";
import MobileNavigationBar from "@component/mobile-navigation";
import Header from "@component/v2/Header";

export default function SaleLayout1({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Topbar />  
      <Header />
      <Navbar />
      {children}
      <MobileNavigationBar />
      {/* <Footer1 /> */}
    </Fragment>
  );
}
