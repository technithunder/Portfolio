"use client";
import StaffForm from "@/components/StaffForm";
import React from "react";

const UpdateStaff = ({ params }) => {
  const unwrappedParams = React.use(params);
  return <StaffForm mode="update" staffId={unwrappedParams?.id} />;
};

export default UpdateStaff;