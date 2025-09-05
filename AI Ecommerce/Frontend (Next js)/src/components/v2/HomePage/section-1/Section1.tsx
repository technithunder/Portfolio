import Box from "@component/Box";
import Card from "@component/Card";
import AppStore from "@component/AppStore";
import NextImage from "@component/NextImage";
import { Carousel } from "@component/carousel";
import { H1, H5, H6 } from "@component/Typography";
// STYLED COMPONENTS
import { ContentWrapper, Wrapper } from "./styles";
// API FUNCTIONS
import api from "@utils/__api__/grocery-2";

export default async function Section1() {
  const carouselData = await api.getMainCarousel();

  return (
    <Wrapper>
      <Carousel
        dots
        autoplay
        arrows={false}
        spaceBetween={0}
        slidesToShow={1}
        dotColor="white"
        dotStyles={{ bottom: 25 }}
      >
        {carouselData.map((item) => (
          <Card
            key={item.id}
            bg="#3F89BA"
            color="white"
            borderRadius={0}
            position="relative"
          >
            <Box
              className="card__img"
              width="100%"
              height="auto"
              position="relative"
            >
              <NextImage
                alt="carousel-image"
                src={item.imgUrl}
                width={800}
                height={400}
                layout="responsive"
              />
            </Box>
          </Card>
        ))}
      </Carousel>
    </Wrapper>
  );
}

