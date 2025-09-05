"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import { IconButton } from "@component/buttons";
import Typography, { H3, H5, Small } from "@component/Typography";
import { Meta } from "interfaces";
import { Chip } from "@component/Chip";
import { getInvoiceList } from "api";
import { useSelector } from "react-redux";
import moment from "moment";
import { calculateStatus } from "@utils/utils";
import Spinner from "@component/Spinner";
interface Props {
  meta?: Meta;
  products: any;
}
export default function InvoiceHistoryList(sortColumn: any, sortOrder: any) {
  const [invoices, setInvoices] = useState([]);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLength, setDisplayLength] = useState<any>(10);
  const page = currentPage + 1;

  const fetchInvoices = async (customerId) => {
    try {
      const res = await getInvoiceList(customerId, displayLength, page, sortColumn, sortOrder);
      const data = res?.data?.invoices;
      if (data) {
        setTotalRecords(res?.data?.iTotalRecords || 0);
        setInvoices(data);
        setIsLoading(false);
      }

    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching customer list:", error);
    }
  };
  const totalPages = Math.ceil(totalRecords / displayLength);

  useEffect(() => {
    fetchInvoices(customerDetails?.customerID || "")
  }, [])
  // useEffect(() => {
  //   if (page) {
  //     push(`/vendor/products?page=${page}`);
  //   }
  // }, [page]);

  const getColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "secondary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "";
    }
  };
  return (
    <>
      {isLoading ? (
        <FlexBox
          mt={5}
          alignItems="center"
          justifyContent="center"
          width={"100%"}
        >
          <Spinner />
        </FlexBox>
      ) :
        invoices.length > 0 ? (
          invoices.map((item: any) => (
            <Link href={`/invoices/invoiceDetails`} key={item.id}>
              <TableRow my="1rem" padding="6px 18px" borderBottom="2px solid #D8E0E9">
                <FlexBox flex="1 1 150px">
                  <H5 color="text.muted" textAlign="left">{item.invoiceID}</H5>
                </FlexBox>
                <FlexBox flex="1 1 250px" justifyContent="start">
                  <H5 m="6px" textAlign="left" fontWeight="400">
                    {calculateStatus(item.amount, item.payment)}
                  </H5>
                </FlexBox>
                <H5 m="6px" textAlign="left" fontWeight="400" >
                  ${item.amount}
                </H5>
                <H5 m="6px" textAlign="left" fontWeight="400">
                  {moment(item.date).format('MM/DD/YYYY')}
                </H5>

                <Hidden flex="0 0 0 !important" down={769} pr="1rem">
                  <Typography textAlign="center" justifyContent="start" color="text.muted">
                    <IconButton>
                      <Link href={`/invoices/invoiceDetails/${item.invoiceID}`}>
                      <Icon variant="small" defaultcolor="currentColor">
                        eye-alt
                      </Icon>
                      </Link>
                    </IconButton>
                  </Typography>
                </Hidden>
              </TableRow>
            </Link>
          ))
        ) : (
          <H3 textAlign="center" mt={3}> No Records Found</H3>)}

      <FlexBox justifyContent="center" mt="2.5rem">
        {invoices.length > 0 &&
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            itemsPerPage={displayLength}
            totalRecords={totalRecords}
            onChange={(page) => setCurrentPage(page)}
          />}
      </FlexBox>
    </>
  );
}
