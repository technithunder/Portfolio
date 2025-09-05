"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled, InputAdornment, TextField } from "@mui/material";

import { country_data } from "./country.json";

const StyledInput = styled(Box)(() => ({
    display: "flex",
    border: "1px solid lightgray",
    height: 45,
    width: "100%",
    borderRadius: "10px",
    transition: "border-color 0.3s ease",
    "&:hover": {
        borderColor: "rgba(0, 0, 0, 0.483) !important",
    },
    "&:focus-within": {
        borderColor: "rgb(0, 0, 0) !important",
    },
}));

const StyledSelect = styled(Box)(() => ({
    maxHeight: 164,
    position: "absolute",
    width: "100%",
    zIndex: 999,
    backgroundColor: "#ffffff",
    color: "#000000",
    overflowY: "auto",
    boxShadow: "0px 4px 8px rgba(33, 27, 27, 0.697)",
    borderRadius: "10px",
    marginTop: '5px',

    "&::-webkit-scrollbar": {
        width: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#000000",
        borderRadius: "5px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#aaa",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "#1f1f1f73",
    },
}));

const StyledMenuItem = styled(Stack)(() => ({
    borderBottom: "1px solid gray",
    cursor: "pointer",
    padding: "8px 16px",
    transition: "background-color 0.3s ease",

    "&:hover": {
        backgroundImage: 'linear-gradient(90deg, #FF0000 0%, #FB4E00 54%, #F67200 100%)',
    },
}));


const PhoneInput = ({ value, onPhoneChange, code, sx }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: "IN",
        name: "India",
        flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
        dialCode: "+91",
        phoneNumberLength: 10
    });
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);



    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleCountrySelect = (country) => {
        setPhoneNumber("");
        setSelectedCountry(country);
        setDropdownOpen(false);
        setSearchQuery("");
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (dropdownOpen) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    setSearchQuery((prev) => prev + e.key);
                } else if (e.key === "Backspace") {
                    setSearchQuery((prev) => prev.slice(0, -1));
                }
            }
        },
        [dropdownOpen]
    );

    useEffect(() => {
        if (dropdownOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen, handleKeyDown]);

    const filteredCountries = searchQuery
        ? country_data.filter(
            (country) =>
                country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                country.dialCode.includes(searchQuery)
        )
        : country_data;


    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const isValidNumber = /^\d*$/.test(value);
        if (isValidNumber && value.length <= selectedCountry.phoneNumberLength) {
            setPhoneNumber(value);
            code(selectedCountry.dialCode)
            onPhoneChange(value);
        }
    };

    return (
        <Box position={"relative"} ref={dropdownRef} width={"100%"}>
            <StyledInput sx={{ display: "flex", ...sx }}>
                <Stack
                    mx={1}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ height: "100%", cursor: "pointer", width: "15%", marginLeft: 0 }}
                    onClick={toggleDropdown}
                >
                    <img
                        src={selectedCountry.flag}
                        style={{ height: 30, width: 30, paddingBlock: "5px" }}
                        alt={selectedCountry.name}
                    />
                </Stack>
                <Box width={"85%"} display={"flex"} alignItems={"center"}>
                    <TextField
                        variant="standard"
                        fullWidth
                        autoComplete="off"
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    {selectedCountry.dialCode}
                                </InputAdornment>
                            ),
                            style: { color: "#0009", alignItems: "center", height: "10px" },
                        }}
                        value={phoneNumber || value}
                        onChange={handlePhoneChange}
                        onFocus={() => dropdownOpen && setDropdownOpen(false)}
                    />
                </Box>
            </StyledInput>

            {dropdownOpen && (
                <StyledSelect>
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map((ele, index) => (
                            <StyledMenuItem
                                key={index}
                                sx={{ borderBottom: "1px solid gray", cursor: "pointer" }}
                                px={2}
                                py={1}
                                direction={"row"}
                                spacing={2}
                                onClick={() => handleCountrySelect(ele)}
                            >
                                <Typography>{ele.dialCode}</Typography>
                                <Typography>{ele.name}</Typography>
                            </StyledMenuItem>
                        ))
                    ) : (
                        <Typography px={2} py={1} color="gray">
                            No countries found
                        </Typography>
                    )}
                </StyledSelect>
            )}
        </Box>
    );
};

export default PhoneInput;