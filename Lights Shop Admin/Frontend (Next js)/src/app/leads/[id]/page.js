"use client";
import React from "react";
import LeadForm from "@/components/LeadForm";
import { useSearchParams } from "next/navigation";

const UpdateLead = ({ params }) => {
  const searchParams = useSearchParams();
  const isViewMode = searchParams.get("view") === "true";
  return <LeadForm mode="update" LeadId={params?.id} isViewMode={isViewMode} />;
};

export default UpdateLead;
