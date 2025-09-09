"use client";
import React from "react";
import DealerForm from "@/components/DealerForm";
import AddressForm from "@/components/AddressFrom";

const UpdateAddress = ({ params }) => {
  return <AddressForm mode="update" addressId={params?.id} />;
};

export default UpdateAddress;
