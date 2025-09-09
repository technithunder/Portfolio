"use client";
import { useSearchParams } from 'next/navigation';
import ProductForm from "@/components/ProductForm";
import React from "react";

const UpdateProductDetails = ({params}) => {
const searchParams = useSearchParams();
const isViewMode = searchParams.get('view') === 'true';
 return <ProductForm mode="update" productId={params?.id} isViewMode={isViewMode}/>;
};


export default UpdateProductDetails;
