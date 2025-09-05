import { Fragment, useState, useEffect } from "react";
import api from "@utils/__api__/orders";
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Container from "@component/Container";
import InvoiceHistoryList from "./InvoiceHistoryList";
import Icon from "@component/icon/Icon";

export default function InvoicePage() {
  const [sortColumn, setSortColumn]=useState('')
  const [sortOrder, setSortOrder]=useState('')
  
  return (
    <Fragment>
      <div style={{ paddingTop: "0.5rem" }}>
        <DashboardPageHeader title="Invoice History" iconName="delivery-box" />
      </div>
      <Container py="1rem" backgroundColor="white">
        <Hidden down={769}>
          <TableRow padding="0px 18px" mb="-0.125rem" backgroundColor="transparent">
            <FlexBox flex="1 1 100">
              <H5 color="text.muted" textAlign="left">Invoice ID
              </H5>
              <Icon size="small" color="inherit" mt="6px" onClick={() => {setSortColumn('invoiceId'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}}>Up-Down</Icon>
            </FlexBox>
        
            <FlexBox flex="1 1 150" paddingLeft="5px">
            <H5 color="text.muted" textAlign="left">
              Status
            </H5>
            <Icon size="small" color="inherit" mt="6px" onClick={() => {setSortColumn('status'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}}>Up-Down</Icon>
            </FlexBox>

            <FlexBox flex="1 1 150">
              <H5 color="text.muted" textAlign="left">
                Amount
              </H5>
             <Icon size="small" color="inherit" mt="6px" onClick={() => {setSortColumn('amount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}}>Up-Down</Icon>
            </FlexBox>
            
            <FlexBox flex="1 1 150" paddingLeft="10px">
            <H5 color="text.muted" my="0px" mx="6px" textAlign="left" onClick={() => {setSortColumn('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}}>
              Date
            </H5>
            <Icon size="small" color="inherit" mt="6px">Up-Down</Icon>
            </FlexBox>
            
            <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px">View</H5>
          </TableRow>
        </Hidden>

        <InvoiceHistoryList sortColumn={sortColumn} sortOrder={sortOrder} />
      </Container>
    </Fragment>
  );
}
