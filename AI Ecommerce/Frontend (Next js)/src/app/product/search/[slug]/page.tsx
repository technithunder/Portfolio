import Box from "@component/Box";
import SearchResult from "./SearchResult";

export default function ProductSearchResult() {
  return (
    <Box pt="20px">
      <SearchResult sortOptions={sortOptions} />
    </Box>
  );
}

const sortOptions = [
  { label: "Relevance", value: "" },
  { label: "Date", value: "datedse" },
  { label: "Price Low to High", value: "ase" },
  { label: "Price High to Low", value: "dse" }
];
