import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import ProductCard1 from "@component/product-cards/ProductCard1";
import Typography, { H3 } from "@component/Typography";
import { getTopPurchasedItem } from "api";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridCard from "../Layout/product/GridCard";
import TopPurchased from "../Layout/product/TopPurchased";
import Spinner from "@component/Spinner";

export default function ProductDescription({ additionalInfo }) {
  const [products, setProducts] = useState([]);
  console.log(products, "products");
  const [isLoading, setIsLoading] = useState(true);
  // @ts-ignore
  const { customerDetails } = useSelector((state) => state.customer);
  // @ts-ignore
  const { productDetails } = useSelector((state) => state.product);

  const fetchTopPurchasedProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getTopPurchasedItem(
        customerDetails?.customerID || "",
        productDetails.itemID
      );
      setProducts(res.data.historyInfo);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    fetchTopPurchasedProducts();
  }, []);

  return (
    <Box>
      <H3 mb="1rem">Product Details:</H3>

      {additionalInfo && (
        <Grid container>
          <Grid item md={6} xs={12}>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Typography>
                UPC: <strong>{additionalInfo?.upc}</strong>
              </Typography>
              <Typography>
                Category: <strong>{additionalInfo?.category}</strong>
              </Typography>
              <Typography>
                Header: <strong>{additionalInfo?.pbHeader}</strong>
              </Typography>
              <Typography>
                Family: <strong>{additionalInfo?.product_Line}</strong>
              </Typography>
              <Typography>
                QTY Available: <strong>{additionalInfo?.qty_available}</strong>
              </Typography>
              <Typography>
                Next PO Date:{" "}
                <strong>
                  {additionalInfo?.next_PO_Date
                    ? moment(additionalInfo?.next_PO_Date).format("MM/DD/YYYY")
                    : "N/A"}
                </strong>
              </Typography>
              <Typography>
                Next PO Qty:{" "}
                <strong>{additionalInfo?.next_PO_Quantity ?? "N/A"}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Typography>
                Last Purchased:{" "}
                <strong>
                  {additionalInfo?.lastPurchased
                    ? moment(additionalInfo?.lastPurchased).format("MM/DD/YYYY")
                    : "N/A"}
                </strong>
              </Typography>
              <Typography>
                Qty Last : <strong>{additionalInfo?.qtyPurchased}</strong>
              </Typography>
              <Typography>Purchased: </Typography>
              <Typography>
                Last Price: <strong>{additionalInfo?.lastPrice}</strong>
              </Typography>
              <Typography>
                Invoice Number: <strong>{additionalInfo?.invoice}</strong>
              </Typography>
              <Typography>
                Price/Case: <strong>{additionalInfo?.regularPrice}</strong>
              </Typography>
              <Typography>
                10 Case Price:{" "}
                <strong>{additionalInfo?.case10PricePerCase}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
      <H3 mt="2rem" mb="2rem">
        Top Items Purchased
      </H3>
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid container spacing={8}>
          {products.map((item) => (
            <Grid item lg={2} md={4} sm={6} xs={12} key={item.id}>
              <TopPurchased
                id={item.partNumber}
                description={item.description}
                price={item.productLine}
                productInfo={item}
                imgUrl={undefined}
                size={undefined}
                slug={undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
