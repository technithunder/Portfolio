"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeCurrentOrderId, removeGuiId } from "store/slices/cartSlice";

import Box from "@component/Box";
import { Button } from "@component/buttons";
import Typography from "@component/Typography";
import { Card1 } from "@component/Card1";
import Grid from "@component/grid/Grid";
import Modal from "@component/Modal";
import { saveOrderStatus } from "api";
import { getGuidByCustomerId } from "@utils/utils";
import SaveDeleteActions from "@utils/OrderButtons";
import { CURRENT_ORDER_ID } from "@hook/useSharedState";
import Link from "next/link";

export default function PaymentForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { guid } = useSelector((state: any) => state.cart);
  const { customerDetails } = useSelector((state: any) => state.customer);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);

  const [showModal, setShowModal] = useState(false);

  const savedOrderStatus = async () => {
    await saveOrderStatus(specificGuid?.guid, customerDetails?.customerID, 4);
  };
  const handleConfirm = async () => {
    setShowModal(false);
    await savedOrderStatus();
    dispatch(removeGuiId(customerDetails?.customerID));
    dispatch(removeCurrentOrderId())
    dispatch(clearCart());
    router.push("/store");
  };

  return (
    <Fragment>
      <Card1 mb="2rem">
        <Typography
          ml="6px"
          fontWeight="600"
          fontSize="18px"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
        >
          Pay Later
        </Typography>
      </Card1>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={12}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Link href="/checkout">
            <Button variant="outlined" color="primary" type="button">
              Back to Cart
            </Button>
          </Link>
        </Grid>

        <Grid
          item
          sm={6}
          xs={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button variant="contained" color="primary" type="submit" onClick={() => setShowModal(true)}>
            Place Order
          </Button>
        </Grid>
      </Grid>

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            width="90%"
            maxWidth="500px"
            p="2rem"
            borderRadius="8px"
            backgroundColor="white"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontSize="18px" fontWeight={600} mb="1rem">
              You are about to send your order
            </Typography>
            <Typography fontSize="14px" mb="2rem">
              Once the order has been sent, you will not be able to alter the sent order without calling Customer Service.
            </Typography>
            <Box display="flex" justifyContent="flex-end" marginLeft="0.5rem">
              <Button variant="outlined" color="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleConfirm} ml="0.5rem">
                Send
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
      <SaveDeleteActions />

    </Fragment>
  );
}
