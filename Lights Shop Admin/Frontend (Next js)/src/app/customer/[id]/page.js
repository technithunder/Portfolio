"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DealerForm from "@/components/DealerForm";

const UpdateCustomer = ({ params }) => {
  const pathname = usePathname();
  const isDealers = pathname?.includes("/dealers");

  return (
    <DealerForm mode="update" dealerId={params?.id} isDealers={isDealers} />
  );
};

export default UpdateCustomer;
