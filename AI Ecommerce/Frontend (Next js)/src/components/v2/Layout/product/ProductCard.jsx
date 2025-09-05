import Grid from "@component/grid/Grid";
import GridCard from "./GridCard";
import ListCard from "./ListCard";
import { Fragment } from "react";
import { useSelector } from "react-redux";

export const ProductGridView = ({ products, filter, historyProducts = [] }) => {
  const { items } = useSelector((state) => state.cart);

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  };

  return (
    <div>
      <Grid container spacing={6}>
        {filter && filter === "MY-HISTORY"
          ? historyProducts?.length > 0
            ? historyProducts?.map((item) => {
                const newQty = getQtyFromCart(item.itemID);
                return (
                  <Grid item lg={4} sm={6} xs={12} key={item.id}>
                    <GridCard
                      id={item.id}
                      slug={item.slug}
                      unit={item.unit}
                      title={item.itemDescription}
                      price={item.regular}
                      rating={item.rating}
                      images={item.images}
                      imgUrl={item.thumbnail}
                      size={item.size}
                      pack={item.pack}
                      productInfo={item}
                      newQty={newQty}
                    />
                  </Grid>
                );
              })
            : null
          : products.map((item) => {
              const newQty = getQtyFromCart(item.itemID);
              return (
                <Grid item lg={4} sm={6} xs={12} key={item.id}>
                  <GridCard
                    id={item.id}
                    slug={item.slug}
                    unit={item.unit}
                    title={item.itemDescription}
                    price={item.regular}
                    rating={item.rating}
                    images={item.images}
                    imgUrl={item.thumbnail}
                    size={item.size}
                    pack={item.pack}
                    productInfo={item}
                    newQty={newQty}
                  />
                </Grid>
              );
            })}
      </Grid>
    </div>
  );
};

export const ProductListView = ({ products, filter, historyProducts }) => {
  const { items } = useSelector((state) => state.cart);

  const getQtyFromCart = (itemID) => {
    const updatedItem = items.find((item) => item.id === itemID);
    if (updatedItem) {
      return updatedItem.quantity;
    } else {
      return 0;
    }
  };

  return (
    <Fragment>
      {filter && filter === "MY-HISTORY"
        ? historyProducts?.length > 0
          ? historyProducts?.map((item) => {
              const newQty = getQtyFromCart(item.itemID);
              return (
                <ListCard
                  mb="1.25rem"
                  id={item.id}
                  slug={item.slug}
                  unit={item.unit}
                  title={item.itemDescription}
                  price={item.regular}
                  rating={item.rating}
                  images={item.images}
                  imgUrl={item.thumbnail}
                  size={item.size}
                  pack={item.pack}
                  productInfo={item}
                  newQty={newQty}
                />
              );
            })
          : null
        : products.map((item) => {
            const newQty = getQtyFromCart(item.itemID);
            return (
              <ListCard
                mb="1.25rem"
                id={item.id}
                slug={item.slug}
                unit={item.unit}
                title={item.itemDescription}
                price={item.regular}
                rating={item.rating}
                images={item.images}
                imgUrl={item.thumbnail}
                size={item.size}
                pack={item.pack}
                productInfo={item}
                newQty={newQty}
              />
            );
          })}
    </Fragment>
  );
};
