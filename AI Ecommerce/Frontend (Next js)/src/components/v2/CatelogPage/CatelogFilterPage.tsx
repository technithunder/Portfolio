"use client";
import Card from "@component/Card";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import CheckBox from "@component/CheckBox";
import { Accordion, AccordionHeader } from "@component/accordion";
import  { H3, H4, H6, SemiSpan } from "@component/Typography";
import NavLink from "@component/nav-link";
import Icon from "@component/icon/Icon";
import { NavWithChild } from "interfaces";
import { Fragment, useEffect, useState } from "react";
import { getSessionStorage } from "@utils/sessionStorage";
import Box from "@component/Box";
import Spinner from "@component/Spinner";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import MinMaxInput from "./MinMaxInput";
import Link from "next/link";
import { useSelector } from "react-redux";
import useGetAllSearchParams from "@hook/useGetAllSearchParams";

const AccordionHeaderText = styled(FlexBox)({
  flex: "1",
  gap: "0.75rem",
});
const CategoryList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{
  isSelected?: boolean;
  isFullWidth?: boolean;
  disabled?: boolean;

}>`
  border: none;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  max-width: max-content;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background: ${(props) => (props.isSelected ? "#E94560" : props.disabled ? "lightgray" : "transparent")};
  color: ${(props) => (props.isSelected ? "#FFF" : props.disabled ? "#FFF" : "#2e2e2e")};
  border: 1px solid ${(props) => (props.isSelected ? "#F2F2F2" : "#F2F2F2")};
  flex: ${(props) => (props.isFullWidth ? "1 1 100%" : "1 1 calc(50% - 5px)")};
  text-align: center;
`;
const Title = styled.h3`
  color: #2e2e2e;
  font-size: 18px;
  margin-bottom: 12px;
`;

export const generateFilterQuery = (filters: Record<string, string[]>): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, values]) => {
    params.append("ItemsGroup3", key);
    values.forEach((value) => {
      params.append("ItemsGroup4", value);
    });
  });

  return params.toString();
};

export default function CatelogFilterPage({ setCurrentPage, filter, isSelected }) {
  const router = useRouter();
  const allSearchParams = useGetAllSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigationList = getSessionStorage("navigationList");
  const { customerDetails } = useSelector((state: any) => state.customer);
  const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const daysBack = searchParams.get("daysBack");
    if (daysBack) setSelectedValue(daysBack);
  }, [filter]);

  const categoriesList = [
    { name: "Top Sellers", key: "ItemsGroup5", value: "TOP-SELLERS" },
    { name: "On Sale", key: "ItemsGroup2", value: "SALE-ITEMS" },
    { name: "New Arrivals", key: "ItemsGroup6", value: "NEW ITEMS" },
    { name: "My History", key: "filter", value: "MY-HISTORY" },
  ];

const categories = customerDetails?.customerID
  ? categoriesList
  : categoriesList.filter((cat) => cat.value !== "MY-HISTORY");

  const handleCategoryClick = (category: { key: string; value: string }) => {
    const currentParams = new URLSearchParams(window.location.search);
    const key = category.key;
    const value = category.value;

    const existingValue = currentParams.get(key);

    if (existingValue === value) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }

    router.push(`?${currentParams.toString()}`);
    setCurrentPage(0);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const updateQueryParams = (newParams: Record<string, string | number>) => {
    const currentParams = new URLSearchParams(window.location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(value));
      }
    });

    router.push(`?${currentParams.toString()}`);
  };

  useEffect(() => {
    if (filter === 'MY-HISTORY') {
      setSelectedCategoryKeys(["My History"])
    }
  }, [filter])

  const handleFilterChange = (
    filter: string,
    checked: boolean,
    parentTitle: string
  ) => {
    setSelectedFilters((prev) => {
      setCurrentPage(0)
      const updatedFilters = { ...selectedFilters };

      if (checked) {
        updatedFilters[parentTitle] = [
          ...(updatedFilters[parentTitle] || []),
          filter,
        ];
      } else {
        updatedFilters[parentTitle] =
          updatedFilters[parentTitle]?.filter((item) => item !== filter) || [];

        if (updatedFilters[parentTitle].length === 0) {
          delete updatedFilters[parentTitle];
        }
      }

      const query = generateFilterQuery(updatedFilters);

      router.push(`?${query}`);

      return updatedFilters;
    });
  };


  useEffect(() => {
    if (allSearchParams) {
      
      // Create a new object to store the updated filters
      const updatedFilters = {};
      
      // Process ItemsGroup3 entries (parent categories)
      if (allSearchParams.ItemsGroup3?.length > 0) {
        allSearchParams.ItemsGroup3.forEach(parentCategory => {
          // Initialize each parent category with an empty array
          updatedFilters[parentCategory] = [];
        });
        
        // Process ItemsGroup4 entries (child categories) only if there's a parent
        if (allSearchParams.ItemsGroup4?.length > 0) {
          const parentCategory = allSearchParams.ItemsGroup3[0];
          
          // Add each child category without duplicates
          allSearchParams.ItemsGroup4.forEach(childCategory => {
            if (!updatedFilters[parentCategory].includes(childCategory)) {
              updatedFilters[parentCategory].push(childCategory);
            }
          });
        }
        
        // If the parent category had existing children in selectedFilters that aren't in the new params,
        // check if we should preserve them
        allSearchParams.ItemsGroup3.forEach(parentCategory => {
          if (selectedFilters[parentCategory]) {
            selectedFilters[parentCategory].forEach(childCategory => {
              // If this child isn't in the new ItemsGroup4 but should be preserved
              // (you might need to adjust this logic based on your requirements)
              if (allSearchParams.ItemsGroup4?.length === 0 || 
                  !allSearchParams.ItemsGroup4.includes(childCategory)) {
                // Keep existing children that aren't explicitly removed
                if (!updatedFilters[parentCategory].includes(childCategory)) {
                  updatedFilters[parentCategory].push(childCategory);
                }
              }
            });
          }
        });
      } else {
        // If no filters are applied, reset to empty object or your default state
        // Alternatively, you might want to keep the structure but empty the arrays
      }
      
      // Only update if there's a difference
      if (JSON.stringify(updatedFilters) !== JSON.stringify(selectedFilters)) {
        setSelectedFilters(updatedFilters);
      }
    }
  }, [allSearchParams]);

  const isCategorySelected = (category) => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get(category.key) === category.value;
  };

  const handlePriceRangeChange = ({ minValue, maxValue }) => {
    setCurrentPage(0);
    updateQueryParams({ minPrice: minValue, maxPrice: maxValue });
  };


  const handleChange = (event) => {
    setSelectedValue(event.target.checked ? event.target.value : "");
    setCurrentPage(0);

    if (event.target.checked) {
      updateQueryParams({ daysBack: event.target.value });
    } else {
      updateQueryParams({ daysBack: "" });
    }
  };


  const renderChild = (
    childList: NavWithChild[],
    type = "parent",
    parentTitle: string
  ) => {
    if (type === "parent") {
      return childList.map((item) => (
        <Fragment key={item.title}>
          <CheckBox
            my="10px"
            ml="2rem"
            key={item.title}
            value={item.title}
            color="inherit"
            label={<SemiSpan color="inherit">{item.title}</SemiSpan>}
            checked={
              new URLSearchParams(window.location.search)
                .getAll("ItemsGroup4")
                .includes(item.title)
            }
            onChange={(e) => {
              handleFilterChange(item.title, e.target.checked, parentTitle);
            }}
          />
          {item.child && renderChild(item.child, "child", item.title)}
        </Fragment>
      ));
    }

    return childList.map((item, ind) => (
      <NavLink key={ind} href={item.href} color="gray.700">
        <SemiSpan display="block" ml="3rem" py="6px" color="inherit">
          {item.title}
        </SemiSpan>
      </NavLink>
    ));
  };

  return (
    <>
      <Card
        style={{ maxHeight: "100%" }}
        borderRadius={8}
        position="relative"
        p="3px 20px 14px 24px"
        marginBottom="10px"
      >
        <Title>Filters</Title>
        <CategoryList>
          {categories.map((category, index) => {
            const isMyHistorySelected = isCategorySelected({
              key: "filter",
              value: "MY-HISTORY",
            });

            const isOtherSelected =
              isCategorySelected({ key: "ItemsGroup5", value: "TOP-SELLERS" }) ||
              isCategorySelected({ key: "ItemsGroup2", value: "SALE-ITEMS" }) ||
              isCategorySelected({ key: "ItemsGroup6", value: "NEW ITEMS" });

            const shouldDisable =
              (isMyHistorySelected && category.value !== "MY-HISTORY") ||
              (category.value === "MY-HISTORY" && isOtherSelected);

            return (
              <CategoryButton
                key={category.name}
                isSelected={isCategorySelected(category)}
                onClick={() => handleCategoryClick(category)}
                isFullWidth={index === 2}
                disabled={shouldDisable}
              >
                {category.name}
              </CategoryButton>
            );
          })}

        </CategoryList>

      </Card>
      <Card
        p="18px 27px"
        elevation={5}
        borderRadius={8}
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        {/* PRICE RANGE FILTER */}
        <H6 mb="16px">Price Range</H6>
        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          display="block"
        >
          <MinMaxInput
            min={Number(searchParams.get("minPrice")) || 0}
            max={Number(searchParams.get("maxPrice")) || 10000}
            onChange={handlePriceRangeChange}
          />
        </FlexBox>

        <Divider my="24px" />
        {/* {advanceOption.map((item, index) => (
          <CheckBox
            my="10px"
            key={index}
            name={item.key}
            value={item.value}
            checked={selectedValue === item.value}
            color="inherit"
            label={<SemiSpan color="inherit">{item.key}</SemiSpan>}
            onChange={handleChange}
          />
        ))} */}
        <Divider my="24px" />
        {/* <Accordion>
          <AccordionHeader>
            <H4 mb={2}>Categories</H4>
          </AccordionHeader> */}
          <FlexBox padding="10px 10px" borderRadius="5px 5px 0px 0px">
          <H4>Categories</H4>
        </FlexBox>
          {navigationList?.length > 0 ? (
            navigationList.map((item) => (
              <Box mb="0.5rem" key={item.title} color="inherit">
                {item.child ? (
                  <Accordion>
                    <AccordionHeader px="0px" py="6px" expanded>
                      <AccordionHeaderText>
                        <Icon variant="small" defaultcolor="currentColor">
                          {item.icon}
                        </Icon>

                        <SemiSpan
                          className="cursor-pointer"
                          mr="9px"
                          fontSize="13px"
                          ml="12px"
                          color="inherit"
                        >
                          {item.title}
                        </SemiSpan>
                      </AccordionHeaderText>
                    </AccordionHeader>

                    {item.child &&
                      renderChild(
                        item.child as NavWithChild[],
                        "parent",
                        item.title
                      )}
                  </Accordion>
                ) : (
                  <NavLink href={item.href as string} color="gray.700">
                    <FlexBox py="6px" color="inherit">
                      <Icon variant="small" mr="0.75rem">
                        {item.icon}
                      </Icon>

                      <SemiSpan
                        color="text.muted"
                        fontWeight="600"
                        mr="9px"
                        flex="1 1 0"
                      >
                        {item.title}
                      </SemiSpan>
                    </FlexBox>
                  </NavLink>
                )}
              </Box>
            ))
          ) : (
            <FlexBox
              mt={5}
              alignItems="center"
              justifyContent="center"
              width={"100%"}
            >
              {isLoading ? <Spinner /> : <H3>No Categories found</H3>}
            </FlexBox>
          )}
        {/* </Accordion> */}
      </Card>
    </>
  );
}

// const advanceOption = [
//   { key: "Purchasd in the last 7 days", value: "7" },
//   { key: "Purchasd in the last 14 days", value: "14" },
//   { key: "Purchasd in the last 30 days", value: "30" },
//   { key: "Purchasd in the last 60 days", value: "60" },
//   { key: "Purchasd in the last 90 days", value: "90" },
// ];
