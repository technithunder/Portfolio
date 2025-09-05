import Box from "@component/Box";
import { H3 } from "@component/Typography";
import { Carousel } from "@component/v2/carousel";
import GridCard from "@component/v2/Layout/product/GridCard";
import { useEffect, useState } from "react";
import { getProducts } from "api";
import { useSelector } from "react-redux";
import Spinner from "@component/Spinner";
import FlexBox from "@component/FlexBox";

const responsive = [
  { breakpoint: 950, settings: { slidesToShow: 2 } },
  { breakpoint: 500, settings: { slidesToShow: 1 } },
];

export default function ProductCarousel({ title }) {
  const [saleProducts, setSaleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { items } = useSelector((state: any) => state.cart);
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getProducts(
        customerDetails?.customerID,
        1,
        "SALE ITEMS"
      );
      const data = res?.data;

      if (data) {
        setSaleProducts(data?.aaData || []);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  }

  return (
    <div>
      <H3 fontSize="25px" mb="2rem">
        {title}
      </H3>

      <Box my="-0.25rem" px={2}>
        {saleProducts.length > 0 ? (
          <Carousel slidesToShow={3} responsive={responsive}>
            {saleProducts.map((item) => {
              const newQty = getQtyFromCart(item.itemID);
              return (
                <Box py="0.25rem" key={item.id}>
                  <GridCard
                    id={item.id}
                    slug={item.slug}
                    unit={item.unit}
                    title={item.itemDescription}
                    price={item.regular}
                    rating={item.rating}
                    images={item.images}
                    imgUrl={item.thumbnail}
                    size={item.size}
                    pack={item.pack}
                    off={undefined}
                    productInfo={item}
                    newQty={newQty}
                  />
                </Box>
              )
            })}
          </Carousel>
        ) : (
          <FlexBox
            mt={5}
            alignItems="center"
            justifyContent="center"
            width={"100%"}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <H3>
                {" "}
                No Products on Sale Found, please try again after some time
              </H3>
            )}
          </FlexBox>
        )}
      </Box>
    </div>
  );
}
