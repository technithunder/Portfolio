"use client";
import DealerForm from "@/components/DealerForm";
import { usePathname } from "next/navigation";
import React from "react";

const AddCustomer = () => {
  const pathname = usePathname();
  const isDealers = pathname?.includes("/dealers");
  return <DealerForm mode="create" isDealers={isDealers} />;
};

export default AddCustomer;
