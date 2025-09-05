import { Fragment, useEffect, useState } from "react";
import MainLayout from "../Layout";
import { useSelector } from "react-redux";
import { getProductDetails } from "api";
import ProductIntro from "./ProductIntro";
import ProductView from "./ProductView";
import Spinner from "@component/Spinner";
import FlexBox from "@component/FlexBox";

// ==============================================================
interface Props {
  slug: string;
}
// ==============================================================

export default function ProductDetailsPage({ slug }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState();
  console.log(additionalInfo, "additional info");
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);
  // @ts-ignore
  const { productDetails } = useSelector((state) => state.product);
  // @ts-ignore
  const { items } = useSelector((state) => state.cart);

  const fetchCustomerDescDetails = async () => {
    try {
      setIsLoading(true);
      const res = await getProductDetails(
        customerDetails?.customerID || "",
        slug
      );
      setIsLoading(false);
      setAdditionalInfo(res?.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    fetchCustomerDescDetails();
  }, []);

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  };

  // @ts-ignore
  const newQty = getQtyFromCart(additionalInfo?.itemID as any)

  return (
    <Fragment>
      {isLoading ? (
        <FlexBox
          mt={5}
          alignItems="center"
          justifyContent="center"
          width={"100%"}
        >
          <Spinner />
        </FlexBox>
      ) : (
        <Fragment>
          <ProductIntro
            additionalInfo={additionalInfo}
            productDetails={productDetails}
            newQty={newQty}
          />
          <ProductView additionalInfo={additionalInfo} />
        </Fragment>
      )}
    </Fragment>
  );
}
