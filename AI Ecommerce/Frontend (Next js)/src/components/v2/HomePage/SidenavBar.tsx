"use client";

import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";

import Box from "@component/Box";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import NavLink from "@component/nav-link";
import { H3, H4, SemiSpan } from "@component/Typography";
import { Accordion, AccordionHeader } from "@component/accordion";

import useScroll from "@hook/useScroll";
import { theme } from "@utils/theme";
import { NavWithChild } from "interfaces";
import { getNavigationList} from "api";
import Spinner from "@component/Spinner";
import Link from "next/link";
import { getSessionStorage, setSessionStorage } from "@utils/sessionStorage";
import { useRouter } from "next/navigation";

// STYLED COMPONENT
const AccordionHeaderText = styled(FlexBox)({
  flex: "1",
  gap: "0.75rem",
  "&:hover": {
    color: theme.colors.primary.main,
    "& + .caret-icon": { color: theme.colors.primary.main },
  },
});

const Title = styled.h3`
  color: #2e2e2e;
  font-size: 18px;
  margin-bottom: 12px;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{
  isSelected?: boolean;
  isFullWidth?: boolean;
}>`
  border: none;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  max-width: max-content;
  // background: ${(props) => (props.isSelected ? "" : "transparent")};
  color: ${(props) => (props.isSelected ? "#2e2e2e" : "#2e2e2e")};
  border: 1px solid ${(props) => (props.isSelected ? "#F2F2F2" : "#F2F2F2")};
  flex: ${(props) => (props.isFullWidth ? "1 1 100%" : "1 1 calc(50% - 5px)")};
  text-align: center;
  &:hover {
    background: ${(props) => (props.isSelected ? "#D23F57" : "#f0f0f0")};
  }
`;
// ======================================================================================
type Props = { isFixedNave?: boolean };
// =======================================================================================

export default function SidenavBar({ isFixedNave }: Props) {
  const { isFixed } = useScroll();
  const [navigationList, setNavigationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router=useRouter();

  const fetchNavigationList = async () => {
    try {
      setIsLoading(true);
      const storedData = getSessionStorage("navigationList");
      if (storedData) {
        setNavigationList(storedData);
        setIsLoading(false);
        return;
      }  
      const res = await getNavigationList();
      const data = res?.data

      if (data) {
        let tempArr = [];

        Object.keys(data).sort().map((ele, index) => {
          tempArr.push({
            title: ele,
            child: data[ele].map((item) => ({
              title: item,
              href: `/catelog?ItemsGroup3=${ele.replaceAll(
                " ",
                "-"
              )}&ItemsGroup4=${item.replaceAll(" ", "-")}`,
            })),
            href: `#`,
          });
        });
        setSessionStorage("navigationList", tempArr);
        setNavigationList(tempArr || []);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    fetchNavigationList();
  }, []);

  const renderChild = (childList: any[], parentTitle: string) => {
    return childList.map((item, ind) => {
      const handleClick = () => {
        const params = new URLSearchParams(window.location.search);
  
        params.set("ItemsGroup3", parentTitle);
        params.set("ItemsGroup4", item.title);
  
        router.push(`/catelog?${params.toString()}`);
      };
      return (
        <Fragment key={item.title}>
        <div key={ind} onClick={handleClick} style={{ cursor: "pointer" }}>
          <SemiSpan ml="2rem" py="6px" color="inherit" display="block">
            {item.title}
          </SemiSpan>
        </div>

        {item.child && renderChild(item.child, "child")}
        </Fragment>
      );
    });
  };
  const categories = [
    { name: "Top Sellers", href: "catelog?ItemsGroup5=TOP-SELLERS" },
    { name: "On Sale", href: "catelog?ItemsGroup2=SALE-ITEMS" },
    { name: "New Arrivals", href: "catelog?ItemsGroup6=NEW%20ITEMS" },
    { name: "My History", href:"catelog?filter=MY-HISTORY" },

  ];
  const [selectedCategory, setSelectedCategory] = useState("Top Sellers");

  return (
    <>
      <Card
        style={{ maxHeight: "100%"}}
        borderRadius={8}
        position="relative"
        p="3px 20px 14px 24px"
        marginBottom="10px"
      >
        <Title>Filters</Title>
        <CategoryList>
          {categories.map((category, index) => (
            <Link href={category.href}>
              <CategoryButton
                key={category.name}
                isSelected={selectedCategory === category.name}
                onClick={() => setSelectedCategory(category.name)}
                isFullWidth={index === 2}
              >
                {category.name}
              </CategoryButton>
            </Link>
          ))}
        </CategoryList>
      </Card>
      <Card
        borderRadius={8}
        position="relative"
        p="20px 20px 14px 24px"
      >
        <H4 mb={2}>Categories</H4>
        {navigationList.length > 0 ? (
          navigationList.map((item) => (
            <Box mb="0.5rem" key={item.title} color="gray.700">
              {item.child ? (
                <Accordion>
                  <AccordionHeader
                    px="0px"
                    py="6px"
                    color="inherit"
                    justifyContent="flex-start"
                  >
                    <AccordionHeaderText>
                      <Icon variant="small" defaultcolor="currentColor">
                        {item.icon}
                      </Icon>

                      <SemiSpan color="inherit" fontWeight="600" flex="1 1 0">
                        {item.title}
                      </SemiSpan>
                    </AccordionHeaderText>
                  </AccordionHeader>

                  {item.child ? renderChild(item.child, item.title) : null}
                  </Accordion>
              ) : (
                <NavLink href={item.href as string} color="gray.700">
                  <FlexBox py="6px" color="inherit">
                    <Icon variant="small" mr="0.75rem">
                      {item.icon}
                    </Icon>

                    <SemiSpan
                      color="inherit"
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
      </Card>
    </>
  );
}
