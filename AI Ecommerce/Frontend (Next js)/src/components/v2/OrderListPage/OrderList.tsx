import { Fragment, useEffect, useState } from "react";
import Hidden from "@component/hidden";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { OrderRow } from "@sections/customer-dashboard/orders";
import Container from "@component/Container";
import { getOrderHistory } from "api";
import { useSelector } from "react-redux";
import Spinner from "@component/Spinner";
import FlexBox from "@component/FlexBox";
import { SearchInput } from "@component/search-box";
import Pagination from "@component/pagination";
import Box from "@component/Box";

export default function OrderList() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderListData, setOrderList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { customerDetails } = useSelector((state: any) => state.customer);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const page = currentPage + 1;
  const displayLength = 25;

  const getOrderList = async () => {
    setIsLoading(true);
    await getOrderHistory(customerDetails.customerID, searchValue, page)
      .then((res) => {
        setOrderList(res.data.data);
        setTotalRecords(res.data.itotalRecords);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const totalPages = Math.ceil(totalRecords / displayLength);

  useEffect(() => {
    getOrderList();
  }, [searchValue, currentPage, displayLength]);

  return (
    <Fragment>
      <Box>
        <SearchInput
          style={{ width: "100%" }}
          placeholder="Search for an order..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Container py="1rem">
          <DashboardPageHeader title="My Orders" iconName="bag_filled" />

          <TableRow
            boxShadow="none"
            padding="0px 18px"
            backgroundColor="transparent"
            style={{overflowX: 'auto', maxWidth: '100%'}}
          >
            <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
              Order ID
            </H5>

            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              Status
            </H5>

            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              Date
            </H5>
            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              Cases Ordered
            </H5>
            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              Special Instructions
            </H5>
            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              #lines
            </H5>
            <H5 color="text.muted" my="0px" mx="6px" textAlign="center">
              Estimated Total
            </H5>

            <H5 flex="0 0 0 !important" color="text.muted" textAlign="center" my="0px">View</H5>
          </TableRow>


          {isLoading ? (
            <FlexBox justifyContent="center" alignItems="center" height="10vh">
              <Spinner />
            </FlexBox>
          ) : (
            orderListData.map((item) => <OrderRow order={item} key={item.id} />)
          )}
        </Container>
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          itemsPerPage={displayLength}
          totalRecords={totalRecords}
          onChange={(page) => setCurrentPage(page)}
        />
      </Box>
    </Fragment>
  );
}
