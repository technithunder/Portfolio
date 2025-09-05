import Link from "next/link";
import NextImage from "next/image";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { H3, H5, Tiny } from "@component/Typography";

const categories = [
  {
    image: "/assets/images/v2/sale-icon.png",
    name: "Items on Sale",
    description: "",
    href: "/catelog?ItemsGroup2=SALE-ITEMS",
  },

  {
    image: "/assets/images/icons/fish.svg",
    name: "My Item History",
    description: "",
    href: "/catelog?filter=MY-HISTORY",
  },
  {
    image: "/assets/images/icons/wheat-flour.svg",
    name: "Top Sellers",
    description: "",
    href: "/catelog?ItemsGroup5=TOP-SELLERS",
  },
  {
    image: "/assets/images/products/Orange-1kg-2.png",
    name: "New Arrivals",
    description: "",
    href: "/catelog?ItemsGroup6=NEW ITEMS",
  },
  {
    image: "/assets/images/products/books.png",
    name: "Catalog",
    description: "",
    href: "/catelog ",
  },
  {
    image: "/assets/images/products/Sales-Flyer-Design-Service-Icon-Pricing.png",
    name: "Sales Flyer",
    description: "",
    href: "https://www.bannerwholesale.com/sales-flyer",
    blank: true,
  },
];

export default function ShopByCategory() {
  return (
    <div>
      <H3 fontSize="25px" mb="2rem">
        Shop By Category
      </H3> 

      <Grid container spacing={6}>
        {categories.map((item, index) => (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <Link href={item.href} target={item?.blank && '_blank'}>
              <FlexBox
                as={Card}
                px="2rem"
                py="1rem"
                height="100%"
                borderRadius={8}
                hoverEffect={true}
                alignItems="center"
              >
                <NextImage
                  width={46}
                  height={46}
                  alt="bonik"
                  src={item.image}
                  objectFit="contain"
                />

                <Box ml="2rem" flex={1} overflow="hidden">
                  <Tiny color="primary.main">{item.description}</Tiny>
                  <H5 ellipsis>{item.name}</H5>
                </Box>
              </FlexBox>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
