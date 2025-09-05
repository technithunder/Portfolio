import { Fragment, useState, useEffect } from "react";
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Container from "@component/Container";
import InvoiceList from "./InvoiceList";
import MainLayout from "@component/v2/Layout";
import Icon from "@component/icon/Icon";
import { getInvoiceDetails } from "api";
import Pagination from "@component/pagination";

// ==============================================================
type Params = { searchParams: Promise<{ page: string }> };
// ==============================================================

export default function InvoiceDetails({ slug }: { slug: any }) {
  const [invoiceDetails, setInvoiceDetails] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLength, setDisplayLength] = useState<number>(10);
  const page = currentPage + 1;

  const getInvoiceDetailsData = async () => {
    try {
      setIsLoading(true);
      const res = await getInvoiceDetails(slug, displayLength, page);
      setInvoiceDetails(res.data.results);
      setTotalRecords(res.data.iTotalRecords);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getInvoiceDetailsData();
  }, [displayLength, currentPage]);

  const totalPages = Math.ceil(totalRecords / displayLength);

  return (
    <Fragment>
      <MainLayout>
        <div style={{ paddingTop: "1.5rem" }}>
          <DashboardPageHeader title="Invoice Details" iconName="delivery-box" />
        </div>
        <Container py="1rem" mt="1rem" backgroundColor="white">

          <Hidden down={769}>
            <TableRow padding="0px 18px" mb="-0.125rem" boxShadow="none" backgroundColor="transparent">
              {/* <FlexBox flex="1 1 150px">
                <H5 color="text.muted" textAlign="left">Order Number</H5>
                <Icon size="small" color="inherit" mt="6px">Up-Down</Icon>
              </FlexBox> */}

              <FlexBox flex="1 1 120px" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <H5 color="text.muted" textAlign="left">Item ID</H5>
                <Icon size="small" color="inherit" mt="6px">Up-Down</Icon>
              </FlexBox>

              <FlexBox flex="2.5 2.5 300px" justifyContent="center">
                <H5 color="text.muted" textAlign="left">Product Details</H5>
                <Icon size="small" color="inherit" mt="6px">Up-Down</Icon>
              </FlexBox>

              <FlexBox flex="1.2 1.2 120px" justifyContent="center">
                <H5 color="text.muted" textAlign="left">Price</H5>
                <Icon size="small" color="inherit" mt="6px">Up-Down</Icon>
              </FlexBox>

              {/* <FlexBox flex="1.3 1.3 140px" justifyContent="center">
                <H5 color="text.muted" textAlign="left">Status</H5>
              </FlexBox> */}
            </TableRow>
          </Hidden>
          <InvoiceList invoiceDetails={invoiceDetails} loading={isLoading} />
          
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            itemsPerPage={displayLength}
            totalRecords={totalRecords}
            onChange={(page) => setCurrentPage(page)}
          />
        </Container>
      </MainLayout>
    </Fragment>
  );
}
