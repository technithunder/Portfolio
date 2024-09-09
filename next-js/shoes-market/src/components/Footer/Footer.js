import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import { useRouter } from "next/router";
import styles from "@/styles/components/Checkout.module.scss";
import AdSlot from "../AdSlot";
import { removeSlot } from "../AdSlot/lib-dfp-index";
import { defineCustomSlots } from "@/src/utils/helper";
import Image from "next/image";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

const View = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
  padding: 16px;
`;

const Text = styled(Typography)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Footer = () => {
  const router = useRouter();

  let adsData = useSelector((state) => state.content.content);
  let tagline = useSelector((state) => state.content.brand_data?.tagline);
  let logo = useSelector((state) => state.content.brand_data?.logo);

  useEffect(() => {
    if (isEmpty(adsData)) {
      const {
        desktop_ads_2,
        tablet_ads_2,
        mobile_ads_2,
        desktop_ads_3,
        tablet_ads_3,
        mobile_ads_3,
      } = adsData;
      defineCustomSlots(desktop_ads_2);
      defineCustomSlots(tablet_ads_2);
      defineCustomSlots(mobile_ads_2);

      defineCustomSlots(desktop_ads_3);
      defineCustomSlots(tablet_ads_3);
      defineCustomSlots(mobile_ads_3);
    }
    router.events.on("routeChangeComplete", removeSlot);
    return () => {
      router.events.off("routeChangeComplete", removeSlot);
    };
  }, [adsData]);

  return (
    <Box mt={6}>
      <div className={styles.desktopAds}>
        {/* desktopAds2 input the code */}
        <AdSlot id={"footer-ad-banner"} />
      </div>
      <div className={styles.tabletAds}>
        {/* tabletAds2 input the code */}
        <AdSlot id={"footer-ad-banner1"} />
      </div>
      <div className={styles.mobileAds}>
        {/* mobileAds2 input the code */} 
        <AdSlot id={"footer-ad-banner2"} />
      </div>
      <View>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
          alignItems="center"
        >
          <Link href="/about">
            <Text>About Us</Text>
          </Link>
          <Link href="/contact">
            <Text>Contact Us</Text>
          </Link>
          <Link href="/accept-policy">
            <Text> Acceptable use policy</Text>
          </Link>
          <Link href="/faq">
            <Text>FAQs</Text>
          </Link>
          <Link href="/disclaimer">
            <Text>Disclaimer</Text>
          </Link>
          <Link href="/order-history">
            <Text>Track Your Orders</Text>
          </Link>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
          alignItems="center"
          mt={2}
        >
          <Link href="/return-policy">
            <Text>Return Refund Cancellection Shipping Policy</Text>
          </Link>
          <Link href="/privacy-policy">
            <Text>Privacy Policy</Text>
          </Link>
          <Link href="/terms-condition">
            <Text> Terms and Conditions</Text>
          </Link>
        </Box>
        <div className={styles.desktopAds}>
          {/* desktopAds3 input the code */}
          <AdSlot id={"footer1-ad-banner"} />
        </div>
        <div className={styles.tabletAds}>
          {/* tabletAds3 input the code */}
          <AdSlot id={"footer1-ad-banner1"} />
        </div>
        <div className={styles.mobileAds}>
          {/* mobileAds3 input the code */} 
          <AdSlot id={"footer1-ad-banner2"} />
        </div>
        <Typography textAlign="center" mt={2}>
          {tagline}
        </Typography>
        <Image src={logo} alt="brand_logo" height={50} width={220} priority />
      </View>
    </Box>
  );
};

export default Footer;
