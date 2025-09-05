"use client";

import ReactPaginate from "react-paginate";
import { SpaceProps } from "styled-system";

import Icon from "@component/icon/Icon";
import { Button } from "@component/buttons";
import { StyledPagination } from "./styled";
import Typography, { SemiSpan } from "@component/Typography";
import Select from "@component/Select";
import Box from "@component/Box";
import { useState } from "react";
import { text } from "stream/consumers";

// ==============================================================
export interface PaginationProps extends SpaceProps {
  pageCount: number;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
  onChange?: (data: number) => void;
  currentPage?: number;
  itemsPerPage?: any;
  totalRecords?: number;
  handleSetValues?:any;
  value?:any;
}
// ==============================================================

const perpage = [
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" }
];
export default function Pagination({
  onChange,
  pageCount,
  pageRangeDisplayed,
  marginPagesDisplayed,
  currentPage,
  itemsPerPage,
  totalRecords,
  ...props
}: PaginationProps) {
  const handlePageChange = async (page: any) => {
    if (onChange) onChange(page.selected);
  };

  const PREVIOUS_BUTTON = (
    <Button
      height="auto"
      padding="6px"
      color="primary"
      overflow="hidden"
      borderRadius="50%"
      className="control-button">
      <Icon defaultcolor="currentColor" variant="small">
        chevron-left
      </Icon>
    </Button>
  );

  const NEXT_BUTTON = (
    <Button
      height="auto"
      padding="6px"
      color="primary"
      overflow="hidden"
      borderRadius="50%"
      className="control-button">
      <Icon defaultcolor="currentColor" variant="small">
        chevron-right
      </Icon>
    </Button>
  );

  const BREAK_LABEL = (
    <Icon defaultcolor="currentColor" variant="small">
      triple-dot
    </Icon>
  );
 
  return (
    <div style={{alignItems:"center", display:"flex", justifyContent:"space-between", width:"100%"}}>
      <div>

      {totalRecords > 0 && <SemiSpan>
        Showing {totalRecords > 0 ? currentPage * itemsPerPage + 1 : 0}-
        {Math.min((currentPage + 1) * itemsPerPage, totalRecords)} of {totalRecords} Records
      </SemiSpan>}
      </div>
      {/* <Box  display="flex" alignItems="center">
        <Typography mr="2" color="text.muted">Records per page</Typography>
      <Select 
          options={perpage} 
          placeholder="10"
          value={perpage.find((option) => option.value === value)}
          onChange={handleSelectChange}
        />
       </Box> */}
      <div>
      <StyledPagination {...props}>
      
      <ReactPaginate
        pageCount={pageCount}
        nextLabel={totalRecords > 0 && NEXT_BUTTON}
        breakLabel={BREAK_LABEL}
        forcePage={currentPage} 
        activeClassName="active"
        disabledClassName="disabled"
        containerClassName="pagination"
        previousLabel={totalRecords > 0 && PREVIOUS_BUTTON}
        onPageChange={handlePageChange}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
      />
    </StyledPagination>
    </div>
    </div>
  );
}
