"use client";

import CatelogPage from "@component/v2/CatelogPage/page";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const newItems = searchParams.get("ItemsGroup6");
  const saleItems: any = searchParams.get("ItemsGroup2");
  const itemsGroup4 = searchParams.getAll("ItemsGroup4");
  const topSellers: any = searchParams.get("ItemsGroup5");
  const purchasedFilter = searchParams.get("daysBack");
  const myHistory: any = searchParams.get("filter");
  const sort = searchParams.get("sort");
  const minPrice: any = searchParams.get("minPrice");
  const maxPrice: any = searchParams.get("maxPrice");

  return (
    <CatelogPage
      topSell={topSellers}
      categoryFilter={itemsGroup4}
      purchasedFilter={purchasedFilter}
      sort={sort}
      minPrice={minPrice}
      maxPrice={maxPrice}
      saleItems={saleItems}
      newItems={newItems}
      filter={myHistory}
    />
  );
}
