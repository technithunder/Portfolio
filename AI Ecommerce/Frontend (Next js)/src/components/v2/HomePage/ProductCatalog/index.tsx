"use client";

import Box from "@component/Box";
import Typography, { H3 } from "@component/Typography";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import FlexBox from "@component/FlexBox";
import { SearchInput } from "@component/search-box";
import GridCard from "@component/v2/Layout/product/GridCard";
import { useEffect, useState } from "react";
import { getProducts } from "api";
import { useSelector } from "react-redux";
import Spinner from "@component/Spinner";
import Select from "@component/Select";
import { getSessionStorage, setSessionStorage } from "@utils/sessionStorage";
import { buildQueryString } from "@utils/utils";
import { useSearchParams } from "next/navigation";
import useGetAllSearchParams from "@hook/useGetAllSearchParams";

// =======================================================
type Props = { title: string };
// =======================================================

const ProductCatalog = ({ title }: Props) => {
  const length = getSessionStorage("displayLength") || 10;
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);
  const { items } = useSelector((state: any) => state.cart);
  const searchParams = useSearchParams();
  const allSearchParams = useGetAllSearchParams();
  const [displayLength, setDisplayLength] = useState<any>(length);
  const page = currentPage + 1;

  const fetchProducts = async (queryString = "") => {
    try {
      setIsLoading(true);
      const res = await getProducts(
        customerDetails?.customerID || "",
        page,
        "",
        searchValue,
        queryString,
        displayLength
      );
      const data = res?.data;

      if (data) {
        setTotalRecords(data?.iTotalRecords || 0);
        setProducts(data?.aaData || []);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    if (allSearchParams) {
      const queryString = buildQueryString(allSearchParams);
      fetchProducts(queryString);
    } else {
      fetchProducts();
    }
  }, [searchValue, searchParams, displayLength, currentPage]);

  const totalPages = Math.ceil(totalRecords / displayLength);

  const handleSetValues = (selectedValue: string) => {
    setSessionStorage("displayLength", selectedValue);
    // setCurrentPage(0);
    setDisplayLength(selectedValue);
  };

  const handleSelectChange = (selectedOption: any) => {
    setCurrentPage(0);
    setSessionStorage("displayLength", displayLength);

    if (handleSetValues) {
      handleSetValues(selectedOption.value);
    }
  };
  const perpage = [
    { label: "10", value: "10" },
    { label: "25", value: "25" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  }

  const handleSearchInputChage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentPage(0);
    }
  }
  return (
    <div>
      <H3 fontSize="25px" mb="2rem">
        {title}
      </H3>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <SearchInput
          placeholder="Search"
          value={searchValue}
          onChange={(e) => {
            handleSearchInputChage(e)
            setSearchValue(e.target.value);
          }}
          debounceDelay={1000}
        />
        <Box display="flex" alignItems="center">
          <Typography mr="2" color="text.muted">
            Records per page
          </Typography>
          <Select
            options={perpage}
            placeholder="10"
            value={perpage.find((option) => option.value === displayLength)}
            onChange={handleSelectChange}
          />
        </Box>
      </Box>
      <Box px={2}>
        <Grid container spacing={6}>
          {isLoading ? (
            <FlexBox
              mt={5}
              alignItems="center"
              justifyContent="center"
              width={"100%"}
            >
              <Spinner />
            </FlexBox>
          ) : products.length > 0 ? (
            products.map((item) => {
              const newQty = getQtyFromCart(item.itemID);
              return (
                <Grid item lg={4} sm={6} xs={12} key={item.id}>
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
                </Grid>
              );
            })
          ) : (
            <FlexBox
              mt={5}
              alignItems="center"
              justifyContent="center"
              width={"100%"}
            >
              <H3> No Products Found, please search for the Customer.</H3>
            </FlexBox>
          )}
        </Grid>
        {products.length > 0 && (
          <FlexBox
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            mt="32px"
          >
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage}
              itemsPerPage={displayLength}
              totalRecords={totalRecords}
              onChange={(page) => setCurrentPage(page)}
            />
          </FlexBox>
        )}
      </Box>
    </div>
  );
};

export default ProductCatalog;
