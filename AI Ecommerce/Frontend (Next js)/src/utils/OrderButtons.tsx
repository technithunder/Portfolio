"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@component/buttons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeCurrentOrderId } from "store/slices/cartSlice";
import { toast } from "react-toastify";
import { handleCancelOrder, saveOrderStatus } from "api";
import Modal from "@component/Modal";
import Box from "@component/Box";
import Typography from "@component/Typography";
import { getGuidByCustomerId } from "@utils/utils";

type SaveDeleteActionsProps = {
  values?: any;
};

const SaveDeleteActions: React.FC<SaveDeleteActionsProps> = ({ values }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customerDetails } = useSelector((state: any) => state.customer);
  const { guid } = useSelector((state: any) => state.cart);
  const specificGuid = getGuidByCustomerId(guid, customerDetails?.customerID);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    toast.success("Order saved!");
    await saveOrderStatus(specificGuid?.guid, customerDetails?.customerID, 2);
    dispatch(removeCurrentOrderId());
    dispatch(clearCart());
    router.push("/store");
  };

  const handleDeleteOrder = async () => {
    try {
      const result = await handleCancelOrder(specificGuid?.guid);
      if (result.status === 200) {
        dispatch(removeCurrentOrderId());
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    await handleDeleteOrder();
    toast.success("Order deleted!");
    dispatch(clearCart());
    router.push("/store");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <Button
          style={{ backgroundColor: "#4E97FD", color: "white" }}
          onClick={handleSave}
          type="button"
        >
          Save
        </Button>

          <Button variant="contained" color="primary" onClick={handleDelete} type="button">
            Delete
          </Button>
      </div>

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
            <Typography fontSize="16px" mb="2rem">
              Are you sure you want to cancel the order? This action cannot be undone.
            </Typography>
            <Box display="flex" justifyContent="flex-end" marginLeft="0.5rem">
              <Button variant="outlined" color="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleConfirmDelete} ml="0.5rem">
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default SaveDeleteActions;
