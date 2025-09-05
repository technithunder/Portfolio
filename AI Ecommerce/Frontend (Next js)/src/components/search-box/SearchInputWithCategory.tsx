import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";

import Box from "@component/Box";
import Menu from "@component/Menu";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import MenuItem from "@component/MenuItem";
import { Span } from "@component/Typography";
import TextField from "@component/text-field";

export default function SearchInputWithCategory({placeholder, options, autoCompleteMode = false, searchResult = []}) {
  const [resultList, setResultList] = useState<string[]>([]);
  const [category, setCategory] = useState("All Categories");

  const handleCategoryChange = (cat: string) => () => setCategory(cat);

  const search = debounce((e) => {
    const value = e.target?.value;

    if (!value) setResultList([]);
    else setResultList(searchResult);
  }, 200);

  const handleSearch = useCallback((event: any) => {
    event.persist();
    search(event);
  }, []);

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <FlexBox alignItems="center" position="relative" width="100%">
        <Menu
          direction="right"
          handler={
            <FlexBox
              alignItems="center"
              justifyContent="center"
              position="absolute"
              left="10px"
              height="100%"
              style={{ cursor: "pointer", zIndex: 2 }}
            >
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }
        >
          {options.map((item) => (
            <MenuItem key={item} onClick={handleCategoryChange(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>

        <TextField
          fullwidth
          onChange={handleSearch}
          placeholder={placeholder}
          style={{
            paddingLeft: "35px",
            height: "40px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </FlexBox>

      {autoCompleteMode && !!resultList.length && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" zIndex={99}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item}`} key={item}>
              <MenuItem key={item}>
                <Span fontSize="14px">{item}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
}
