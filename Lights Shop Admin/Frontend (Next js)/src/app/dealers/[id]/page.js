"use client";
import React from "react";
import DealerForm from "@/components/DealerForm";
import { usePathname } from "next/navigation";

const UpdateDealer = ({ params }) => {
  const pathname = usePathname();
  const isDealers = pathname?.includes("/dealers");
  return (
    <DealerForm mode="update" dealerId={params?.id} isDealers={isDealers} />
  );
};

export default UpdateDealer;