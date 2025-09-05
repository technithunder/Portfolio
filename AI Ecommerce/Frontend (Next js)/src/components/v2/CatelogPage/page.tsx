import CatelogSearchPage from "./CatelogSearchPage";
import MainLayout from "../Layout";

export default function CatelogPage({
  categoryFilter,
  purchasedFilter,
  filter,
  sort,
  minPrice,
  maxPrice,
  topSell,
  saleItems,
  newItems,
}: {
  categoryFilter: any;
  purchasedFilter?: string;
  filter?: any;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  topSell?: string;
  saleItems?: any;
  newItems?: any;
}) {
  const sortOptions = [
    { label: "Relevance", value: "" },
    { label: "Date", value: "datedse" },
    { label: "Price Low to High", value: "ase" },
    { label: "Price High to Low", value: "dse" },
  ];
  return (
    <MainLayout>
      <CatelogSearchPage
        sortOptions={sortOptions}
        categoryFilter={categoryFilter}
        purchasedFilter={purchasedFilter}
        filter={filter}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        topSell={topSell}
        newItems={newItems}
      />
    </MainLayout>
  );
}
