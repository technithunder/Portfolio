"use client";

import MainLayout from "@component/v2/Layout";
import ProductDetailsPage from "@component/v2/ProductDetailsPage/page";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams();

  return (
    <MainLayout>
      <ProductDetailsPage slug={slug as string} />
    </MainLayout>
  );
}
