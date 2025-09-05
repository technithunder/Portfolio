import Link from "next/link";
import { Carousel } from "@component/carousel";
import ProductCard6 from "@component/product-cards/ProductCard6";
import CategorySectionCreator from "@component/CategorySectionCreator";
// API FUNCTIONS
import api from "@utils/__api__/market-1";

export default async function Section3() {
  const categoryList = await api.getTopCategories();

  const responsive = [
    { breakpoint: 959, settings: { slidesToShow: 2 } },
    { breakpoint: 650, settings: { slidesToShow: 1 } }
  ];

  return (
    <CategorySectionCreator iconName="categories" title="Top Categories" seeMoreLink="#">
      <Carousel slidesToShow={3} responsive={responsive}>
        {categoryList.map((item, ind) => (
          <Link href={`/product/search/${item.slug}`} key={ind}>
            <ProductCard6 title={item.name} imgUrl={item.image} subtitle={item.description} />
          </Link>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
}
