import { useEffect, useState } from "react";
import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import TextField from "@component/text-field";
import SearchBoxStyle from "./styled";

interface SearchInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  debounceDelay?: number;
}

export default function SearchInput({
  onChange,
  value = "",
  placeholder,
  style = {},
  debounceDelay = 300,
  ...props
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) {
        onChange({ target: { value: inputValue } } as React.ChangeEvent<HTMLInputElement>);
      }
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [inputValue, onChange, debounceDelay]);

  return (
    <Box position="relative" width="100%" maxWidth="670px" marginY="20px" style={style}>
      <SearchBoxStyle>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          className="search-field"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          {...props}
        />
      </SearchBoxStyle>
    </Box>
  );
}
