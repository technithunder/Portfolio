"use client";
import InvoiceDetails from "@component/v2/Invoice/InvoiceDetails/InvoiceDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const {slug} = useParams();
  return <InvoiceDetails slug={slug} />;
}
