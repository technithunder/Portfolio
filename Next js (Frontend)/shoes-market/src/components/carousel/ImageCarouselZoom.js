import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "styles/components/ImageCarouselZoom.module.scss";
import FullCarousel from "re-carousel";
import StyledDialog from "./StyledDialog";
import IndicatorDots from "./indicator-dots";
import Buttons from "./buttons";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import Fullscreen from "@mui/icons-material/Fullscreen";

const ImageCarouselZoom = ({ data }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <>
      <Carousel
        showThumbs={true}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
        selectedItem={selectedImg}
      >
        {data?.image?.map((image, index) => (
          <div key={index}>
            <img src={image} alt="img" />
            <div
              className={styles.searchIcon}
              onClick={() => setIsFullScreen(true)}
            >
              <Fullscreen />
            </div>
          </div>
        ))}
      </Carousel>

      {/* for full screen view */}
      <StyledDialog open={isFullScreen}>
        <CloseFullscreenIcon
          className={styles.closeIcon}
          sx={{ fontSize: 30 }}
          onClick={() => setIsFullScreen(false)}
        />
        <div className={styles.fullView}>
          <FullCarousel axis="x" loop widgets={[IndicatorDots, Buttons]}>
            {data?.image?.map((image, index) => (
              <div key={index} className={styles.slide}>
                <img src={image} alt="img" />
              </div>
            ))}
          </FullCarousel>
        </div>
      </StyledDialog>
    </>
  );
};

export default ImageCarouselZoom;
