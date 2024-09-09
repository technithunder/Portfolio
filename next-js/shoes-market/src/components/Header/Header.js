import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import {
  fetchPageContents,
  filterProduct,
  getAds,
  getCategorys,
  getSettings,
} from "@/src/api";
import { defineInterstitialSlot, removeSlot } from "../AdSlot/lib-dfp-index";
import AdSlot from "../AdSlot";
import styles from "@/styles/components/Checkout.module.scss";
import { defineCustomSlots } from "@/src/utils/helper";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBrandData,
  updateContent,
  updateCurrency,
} from "@/src/store/slices/contentSlice";
import isEmpty from "lodash/isEmpty";
import Head from "next/head";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [showMenuOption, setShowMenuOption] = useState(false);
  const [search, setSearch] = useState("");
  const [category_data, setCategory_data] = useState([]);
  const [logo, setLogo] = useState();
  let adsData = useSelector((state) => state.content.content);
  let currency = useSelector((state) => state.content.currency);

  const dispatcher = useDispatch();

  
  useEffect(() => {
    if (!adsData?.content) {
      getAds()
        .then((res) => {
          const formattedData = JSON.parse(res.data.advertizes[0]?.jsonData);
          dispatcher(updateContent(formattedData));
        })
        .catch((err) => console.log(err));
    }
    fetchPageContents()
      .then((res) => {
        const htmlContent = res.data[0];
        dispatcher(
          updateBrandData({
            tagline: htmlContent?.brand_tagline,
            logo: htmlContent?.logo_path_name[0]?.replace(/\\n/g, "<br />"),
          })
        );
        setLogo(htmlContent?.logo_path_name[0]?.replace(/\\n/g, "<br />"));
      })
      .catch((err) => console.log(err));
	  
	  document.addEventListener('contextmenu', (e) => e.preventDefault());

		function ctrlShiftKey(e, keyCode) {
		  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
		}

		document.onkeydown = (e) => {
		  // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
		  if (
			event.keyCode === 123 ||
			ctrlShiftKey(e, 'I') ||
			ctrlShiftKey(e, 'J') ||
			ctrlShiftKey(e, 'C') ||
			(e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
		  )
			return false;
		};
  }, []);

  useEffect(() => {
    setInterval(() => {
      defineInterstitialSlot();
    }, 5000);
  });

  useEffect(() => {
    fetchCategory();
    if (!currency) {
      getCurrencys();
    }
    if (isEmpty(adsData)) {
      const { desktop_ads_1, tablet_ads_1, mobile_ads_1 } = adsData;
      defineCustomSlots(desktop_ads_1);
      defineCustomSlots(tablet_ads_1);
      defineCustomSlots(mobile_ads_1);
    }
    router.events.on("routeChangeComplete", removeSlot);
    return () => {
      router.events.off("routeChangeComplete", removeSlot);
    };
  }, [adsData]);

  const fetchCategory = () => {
    getCategorys()
      .then((res) => setCategory_data(res.data))
      .catch((e) => console.log(e));
  };

  const getCurrencys = () => {
    getSettings()
      .then((res) => {
        dispatcher(
          updateCurrency(
            res.data[0]?.currency === undefined || res.data[0]?.currency === ""
              ? "₹"
              : res.data[0]?.currency
          )
        );
      })
      .catch((e) => console.log(e));
  };

  const onInputChange = (e) => {
    setSearch(e.target.value);
    filterProduct({ searchByTitle: e.target.value.trim().toLowerCase() })
      .then((res) => {
        if (res) {
          setShowMenuOption(true);
          setData(res.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const onClick = (id) => {
    router.push(`/product/${id}`);
    setShowMenuOption(false);
    setSearch("");
  };

  return (
    <Box>
      {/* <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7843504931516183"
          crossOrigin="anonymous"
        ></script>
      </Head> */}
      <Stack
        justifyContent="center"
        alignItems="center"
        mt={5}
        spacing={4}
        p={2}
      >
        <Link href="/">
          <Image src={logo} alt="brand_logo" height={60} width={250} />
        </Link>

        <Stack direction={{ md: "row", sm: "column" }} gap={2}>
          {category_data?.map((item, index) => {
            return (
              <Link href={`/product-category/${item.name}`} key={index}>
                <Button
                  color="black"
                  sx={{
                    border: "2px solid",
                    borderRadius: "none",
                  }}
                  key={index}
                >
                  <Typography variant="subtitle" letterSpacing={0.2}>
                    {item.name}
                  </Typography>
                </Button>
              </Link>
            );
          })}
        </Stack>
        <Link href="/cart">
          <Button
            color="black"
            sx={{ px: 8, py: 2, border: "2px solid", borderRadius: "none" }}
          >
            <Typography variant="body1" letterSpacing={0.2}>
              Cart
            </Typography>
          </Button>
        </Link>
        <Box sx={{ mt: 2, width: "100%", maxWidth: "500px" }}>
          <TextField
            sx={{ width: "100%" }}
            label="Search Product"
            onChange={onInputChange}
            value={search}
            size="small"
            color="black"
          />
          {data.length > 0 && (
            <>
              {showMenuOption && (
                <Box
                  sx={{
                    overflowY: "scroll",
                    border: "1px solid grey",
                    height: 130,
                    overflowX: "hidden",
                  }}
                >
                  {data.map((item, index) => {
                    return (
                      <Box
                        p={1}
                        width="100%"
                        maxWidth="500px"
                        key={index}
                        sx={{ borderBottom: "1px solid black" }}
                        onClick={() => onClick(item.id)}
                      >
                        <Typography sx={{ cursor: "pointer" }}>
                          {item.title}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </Box>
      </Stack>
      <div className={styles.desktopAds}>
        {/* desktopAds1 input the code */}
        <AdSlot id={"header-ad-banner"} />
      </div>
      <div className={styles.tabletAds}>
        {/* tabletAds1 input the code */}
        <AdSlot id={"header-ad-banner1"} />
      </div>
      <div className={styles.mobileAds}>
        {/* mobileAds1 input the code */} 
        <AdSlot id={"header-ad-banner2"} />
      </div>

      {/* <div className={styles.desktopSideBarLeft}>
        desktopAdsSide Layout input the code 
        <AdSlot id={"sidebarleft-ad-banner"} /> 
      </div> */}

      {/* <div className={styles.desktopSideBarRight}>
        desktopAdsSide Layout input the code 
        <AdSlot id={"sidebarright-ad-banner"} /> 
      </div> */}
    </Box>
  );
};

export default Header;
