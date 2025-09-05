"use client";
import { useCallback, useEffect, useState } from "react";
import Box from "@component/Box";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Typography, { H3, H5, Paragraph } from "@component/Typography";
import { SearchInput } from "@component/search-box";
import CatelogFilterPage, { generateFilterQuery } from "./CatelogFilterPage";
import {
  ProductGridView,
  ProductListView,
} from "../Layout/product/ProductCard";
import { getProducts, getProductsHistory } from "api";
import Spinner from "@component/Spinner";
import { useSelector } from "react-redux";
import useGetAllSearchParams from "@hook/useGetAllSearchParams";
import { buildQueryString, removeParamByValue } from "@utils/utils";
import Pagination from "@component/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { getSessionStorage, setSessionStorage } from "@utils/sessionStorage";
import { useRouter } from "next/navigation";
import { Chip } from "@component/Chip";

// ==============================================================
type Props = {
  sortOptions: { label: string; value: string }[];
  saleItems?: string;
  newItems?: string;
  categoryFilter: string[];
  purchasedFilter?: string;
  filter?: any;
  sort?: string;
  minPrice?: any;
  maxPrice?: any;
  topSell?: string;
};
// ==============================================================

export default function CatelogSearchPage({
  sortOptions,
  filter,
  topSell,
  categoryFilter,
  purchasedFilter,
  sort,
  minPrice,
  maxPrice,
  saleItems,
  newItems,
}: Props) {
  const length = getSessionStorage("displayCatalogLength") || 10;
  const searchParams = useSearchParams();
  const allSearchParams = useGetAllSearchParams();
  const toggleView = useCallback((v: any) => () => setView(v), []);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [displayLength, setDisplayLength] = useState<any>(length);
  const [selectedValue, setSelectedValue] = useState();
  const [historyProducts, setHistoryProducts] = useState<any>();
  const navigationList = getSessionStorage("navigationList");
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);
  const page = currentPage + 1;
  const router = useRouter();
  const fetchProducts = async (queryString = "") => {
    try {
      setIsLoading(true);
      const res = await getProducts(
        customerDetails?.customerID || "",
        page,
        "",
        searchValue,
        queryString,
        displayLength,
        selectedValue
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

  const handleSetValues = (selectedValue: string) => {
    setSessionStorage("displayCatalogLength", selectedValue);
    setCurrentPage(0);
    setDisplayLength(selectedValue);
  };

  const handleSelectChange = (selectedOption: any) => {
    setSessionStorage("displayCatalogLength", displayLength);

    if (handleSetValues) {
      handleSetValues(selectedOption.value);
    }
  };

  const isSelected = (value) => {
    return (
      (Array.isArray(categoryFilter) && categoryFilter.includes(value)) ||
      value === topSell ||
      value === filter ||
      value === purchasedFilter
    );
  };
  const pathname = usePathname();

  const totalPages = Math.ceil(totalRecords / displayLength);
  const perpage = [
    { label: "10", value: "10" },
    { label: "25", value: "25" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];

  const handleSort = (selectedOption: any) => {
    setCurrentPage(0);
    setSelectedValue(selectedOption.value);

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", selectedOption.value);
    router.push(`?${params.toString()}`);
  };

  const getHistoryProducts = async () => {
    setIsLoading(true);
    const res = await getProductsHistory(
      customerDetails?.customerID || "",
      displayLength,
      page
    );
    const data = res?.data;
    if (data?.itemHistoryGrid.length > 0) {
      setHistoryProducts(data?.itemHistoryGrid || []);
      setTotalRecords(data?.iTotalRecords || 0);
    }
    setIsLoading(false);
  };

  // const handleRemoveFilter = (key: string, value?: string) => {
  //   const params = new URLSearchParams(Array.from(searchParams.entries()));

  //   if (key === "sort") {
  //     setSelectedValue(undefined);
  //     params.delete("sort");
  //   }

  //   if (key === "price") {
  //     params.delete("minPrice");
  //     params.delete("maxPrice");
  //   }

  //   if (["ItemsGroup2", "ItemsGroup5", "ItemsGroup6", "filter", "daysBack"].includes(key)) {
  //     const allValues = params.getAll(key);
  //     if (allValues.length > 1 && value) {
  //       const filtered = allValues.filter((v) => v !== value);
  //       params.delete(key);
  //       filtered.forEach((v) => params.append(key, v));
  //     } else {
  //       params.delete(key);
  //     }
  //   }

  //   if (key === "categoryFilter" && value) {
  //     const filteredCategories = categoryFilter.filter((item) => item !== value);
  //     params.delete("categoryFilter");
  //     filteredCategories.forEach((v) => params.append("categoryFilter", v));
  //   }

  //   setCurrentPage(0);
  //   router.push(`?${params.toString()}`);
  // };

  function getParentFromSub(subTitle) {
    for (const parent of navigationList) {
      if (parent.child.some(child => child.title === subTitle)) {
        return parent.title;
      }
    }
    return null;
  }
  
  function removeSubCategory(dataObj, subToRemove) {
    const parent = getParentFromSub(subToRemove);
    if (!parent) return dataObj;
  
    const newData = { ...dataObj };
  
    // Step 1: Remove subcategory from ItemsGroup4
    if (Array.isArray(newData.ItemsGroup4)) {
      newData.ItemsGroup4 = newData.ItemsGroup4.filter(item => item !== subToRemove);
      if (newData.ItemsGroup4.length === 0) {
        delete newData.ItemsGroup4;
      }
    }
  
    // Step 2: Check if any subcategories from the same parent are still left
    const remainingFromParent = (newData.ItemsGroup4 || []).some(title => {
      return getParentFromSub(title) === parent;
    });
  
    // Step 3: If none remain, remove the parent from ItemsGroup3
    if (!remainingFromParent) {
      if (Array.isArray(newData.ItemsGroup3)) {
        newData.ItemsGroup3 = newData.ItemsGroup3.filter(item => item !== parent);
        if (newData.ItemsGroup3.length === 0) {
          delete newData.ItemsGroup3;
        }
      }
    }
  
    return newData;
  }
  
  console.log('244 ===>',categoryFilter, allSearchParams)

  const handleRemoveFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (key === "sort") {
      setSelectedValue(undefined);
      params.delete("sort");
    }

    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (key === "categoryFilter" && value) {
      console.log("217 ===>", allSearchParams);
      const updatedSelections = removeSubCategory(allSearchParams, value);
      const newStructureData = convertToNestedObject(updatedSelections);
      const query = generateFilterQuery(newStructureData);
      router.push(`?${query}`);
      return;
    }

    if (key.startsWith("ItemsGroup")) {
      const values = params.getAll(key);
      console.log(values,"values")
      if (values.length > 1 && value) {
        params.delete(key);
        values.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        params.delete(key);
      }
    }

    if (["filter", "daysBack"].includes(key)) {
      params.delete(key);
    }

    if (key === "categoryFilter" && value) {
      const filteredCategories = categoryFilter.filter(
        (item) => item !== value
      );
      params.delete("categoryFilter");
      filteredCategories.forEach((v) => params.append("categoryFilter", v));
    }

    setCurrentPage(0);
    router.push(`?${params.toString()}`);
  };

  function convertToNestedObject(dataObj) {
    const result = {};
  
    if (!Array.isArray(dataObj.ItemsGroup3) || !Array.isArray(dataObj.ItemsGroup4)) return result;
  
    dataObj.ItemsGroup4.forEach(sub => {
      const parent = getParentFromSub(sub);
      if (parent && dataObj.ItemsGroup3.includes(parent)) {
        if (!result[parent]) {
          result[parent] = [];
        }
        result[parent].push(sub);
      }
    });
  
    return result;
  }

  useEffect(() => {
    const queryString = buildQueryString(allSearchParams);
    filter ? getHistoryProducts() : fetchProducts(queryString);
  }, [
    pathname,
    searchParams,
    searchValue,
    displayLength,
    currentPage,
    customerDetails,
    selectedValue,
  ]);

  useEffect(() => {
    const sortParam: any = searchParams.get("sort");
    if (sortParam) {
      setSelectedValue(sortParam);
    } else {
      setSelectedValue(undefined);
    }
  }, [searchParams]);

  const formatTitle = (str) => {
    return str
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const hasAnyFilter =
  searchParams.get("ItemsGroup5") ||
  searchParams.get("ItemsGroup6") ||
  searchParams.get("ItemsGroup2") ||
  searchParams.get("filter") ||
  searchParams.get("daysBack") ||
  selectedValue ||
  (minPrice && maxPrice) ||
  categoryFilter.length > 0;


  return (
    <>
      <FlexBox
        py="1.25rem"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <div style={{ width: "100%", maxWidth: "674px" }}>
          <SearchInput
            placeholder="Search for products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            debounceDelay={1000}
          />
        </div>

        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Sort by:
          </Paragraph>

          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Sort by"
              options={sortOptions}
              onChange={handleSort}
              value={sortOptions.find((opt) => opt.value === selectedValue) || sortOptions[0]}
            />
          </Box>

          <Paragraph color="text.muted" mr="0.5rem">
            View:
          </Paragraph>

          <IconButton onClick={toggleView("grid")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "grid" ? "primary" : "inherit"}
            >
              grid
            </Icon>
          </IconButton>

          <IconButton onClick={toggleView("list")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "list" ? "primary" : "inherit"}
            >
              menu
            </Icon>
          </IconButton>
        </FlexBox>
      </FlexBox>
      {searchValue && (
        <Box mb="25px" ml="10px">
          <div>
            <H5>Searching for “ {searchValue} ”</H5>
            <Paragraph color="text.muted">
              {totalRecords} results found
            </Paragraph>
          </div>
        </Box>
      )}
      <Grid container spacing={6}>
        <Grid item lg={3} xs={12}>
          <CatelogFilterPage
            setCurrentPage={setCurrentPage}
            filter={filter}
            isSelected={isSelected}
          />
        </Grid>

        <Grid item lg={9} xs={12}>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            mr={2}
            mb={25}
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexWrap="wrap"
              width="650px"
              style={{ gap: 5 }}
            >
              <Typography fontSize={16} fontWeight={400} mr={2}>
                {hasAnyFilter && "Filtered By:" }
              </Typography>
              {searchParams.get("ItemsGroup5") && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("ItemsGroup5")}
                >
                  {formatTitle(searchParams.get("ItemsGroup5"))}
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("ItemsGroup5")}
                  >
                    close
                  </Icon>
                </Chip>
              )}

              {searchParams.get("ItemsGroup6") && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("ItemsGroup6")}
                >
                  {formatTitle(searchParams.get("ItemsGroup6"))}
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("ItemsGroup6")}
                  >
                    close
                  </Icon>
                </Chip>
              )}
              {searchParams.get("ItemsGroup2") && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("ItemsGroup2")}
                >
                  {formatTitle(searchParams.get("ItemsGroup2"))}
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("ItemsGroup2")}
                  >
                    close
                  </Icon>
                </Chip>
              )}

              {searchParams.get("filter") && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("filter")}
                >
                  {formatTitle(searchParams.get("filter"))}
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("filter")}
                  >
                    close
                  </Icon>
                </Chip>
              )}

              {allSearchParams?.ItemsGroup4?.length > 0 &&
                allSearchParams?.ItemsGroup4.map((item) => (
                  <Chip
                    key={item}
                    p="5px 10px"
                    mr={2}
                    fontSize="12px"
                    fontWeight="600"
                    bg="primary.main"
                    color="white"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {formatTitle(item)}
                    <Icon
                      ml="0.5rem"
                      size="14px"
                      onClick={() => {
                        handleRemoveFilter("categoryFilter", item);
                      }}
                    >
                      close
                    </Icon>
                  </Chip>
                ))}

              {/* {Array.from(searchParams.entries())
                .filter(([key]) => key.startsWith("ItemsGroup"))
                .map(([key, value]) => {
                  const childLabel = value.split(">").pop()?.trim(); // get the last segment (child)
                  return (
                    <Chip
                      key={`${key}-${value}`}
                      p="5px 10px"
                      mr={2}
                      fontSize="12px"
                      fontWeight="600"
                      bg="primary.main"
                      color="white"
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => handleRemoveFilter(key, value)}
                    >
                      {formatTitle(childLabel || value)}
                      <Icon ml="0.5rem" size="14px">
                        close
                      </Icon>
                    </Chip>
                  );
                })} */}

              {searchParams.get("daysBack") && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("daysBack")}
                >
                  Purchased in last {formatTitle(searchParams.get("daysBack"))}{" "}
                  days
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("daysBack")}
                  >
                    close
                  </Icon>
                </Chip>
              )}

              {selectedValue && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("sort")}
                >
                  {selectedValue === "ase" ? "Price: Low to High" : selectedValue === "dse" ? "Price: High to Low" : selectedValue === "datedse" ? "Date" : ""}
                  <Icon ml="0.5rem" size="14px" onClick={() => handleRemoveFilter("sort")}>
                    close
                  </Icon>
                </Chip>
              )}

              {minPrice && maxPrice && (
                <Chip
                  p="5px 10px"
                  mr={2}
                  fontSize="12px"
                  fontWeight="600"
                  bg="primary.main"
                  color="white"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => handleRemoveFilter("price")}
                >
                  Price: {minPrice} - {maxPrice}
                  <Icon
                    ml="0.5rem"
                    size="14px"
                    onClick={() => handleRemoveFilter("price")}
                  >
                    close
                  </Icon>
                </Chip>
              )}
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
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

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner />
            </div>
          ) : (filter ? historyProducts?.length > 0 : products?.length > 0) ? (
            view === "grid" ? (
              <ProductGridView
                products={products}
                filter={filter}
                historyProducts={historyProducts}
              />
            ) : (
              <ProductListView
                products={products}
                filter={filter}
                historyProducts={historyProducts}
              />
            )
          ) : (
            <FlexBox
              mt={5}
              alignItems="center"
              justifyContent="center"
              width={"100%"}
            >
              {isLoading ? <Spinner /> : <H3> No Products Found</H3>}
            </FlexBox>
          )}
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
        </Grid>
      </Grid>
    </>
  );
}
