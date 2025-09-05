"use client";

import Sticky from "@component/sticky";
import Header from "@component/v2/Header";
import MobileNavigationBar from "@component/mobile-navigation";
import Grid from "@component/grid/Grid";
import { SearchInput } from "@component/search-box";
import Container from "@component/Container";
import FlexBox from "@component/FlexBox";
import { H3, SemiSpan } from "@component/Typography";
import Pagination from "@component/pagination";
import Card from "./Card";
import { useEffect, useState } from "react";
import { getCustomerList } from "api";
import MainLayout from "../Layout";
import Spinner from "@component/Spinner";

const ClientsPage = () => {
  const [search, setSearch] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const page = currentPage + 1;
  const itemsPerPage = 9;

  useEffect(() => {
    fetchCustomerList(search, page);
  }, [search, page]);

  const fetchCustomerList = async (search, page) => {
    try {
      setIsLoading(true);
      const res = await getCustomerList(search, page);
      const data = res?.data;

      if (data) {
        setTotalRecords(data?.iTotalRecords || 0);
        setCustomerList(data?.aaData || []);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching customer list:", error);
    }
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <MainLayout displayCart={false}>
      <SearchInput
        placeholder="Search Customers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Grid container spacing={6}>
        {isLoading ? (
          <FlexBox
            mt={5}
            alignItems="center"
            justifyContent="center"
            width={"100%"}
          >
            <Spinner />
          </FlexBox>
        ) : customerList?.length > 0 ? (
          customerList.map((item) => (
            <Grid item lg={4} sm={6} xs={12} key={item.id}>
              <Card key={item.id} clientDetail={item} />
            </Grid>
          ))
        ) : (
          <FlexBox
            mt={5}
            alignItems="center"
            justifyContent="center"
            width={"100%"}
          >
            <H3> No Customer Found, please search for the Customer.</H3>
          </FlexBox>
        )}
      </Grid>
      {customerList.length > 0 && (
        <FlexBox
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          mt="32px"
          mb="30px"
        >
          {customerList.length > 1 && !isLoading && (
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalRecords={totalRecords}
              onChange={(page) => setCurrentPage(page)}
            />
          )}
        </FlexBox>
      )}

      <MobileNavigationBar />
    </MainLayout>
  );
};

export default ClientsPage;
