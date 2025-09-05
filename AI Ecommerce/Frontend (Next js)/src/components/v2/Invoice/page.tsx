import { Fragment } from "react";
import Header from "../Header";
import Sticky from "@component/sticky";
import Container from "@component/Container";
import Footer from "../Footer";
import { SearchInput } from "@component/search-box";
import MainLayout from "../Layout";
import InvoicePage from "./InvoiceHistory/invoiceHistoryPage";

export default function InvoiceMainPage() {

  return (
    <MainLayout>
      <SearchInput placeholder="Search for Invoice" />
      <InvoicePage />
    </MainLayout>
  );
}
