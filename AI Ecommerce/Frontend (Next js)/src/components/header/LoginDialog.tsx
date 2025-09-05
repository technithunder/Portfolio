import { cloneElement, Fragment, ReactElement, useState } from "react";
import Modal from "@component/Modal";

// ============================================================
type Props = {
  handle: ReactElement;
  children: ReactElement;
  open: boolean;
  toggleDialog: () => void;
};
// ============================================================

export default function LoginDialog({
  open,
  toggleDialog,
  handle,
  children,
}: Props) {
  return (
    <Fragment>
      {cloneElement(handle, { onClick: toggleDialog })}

      <Modal open={open} onClose={toggleDialog}>
        {children}
      </Modal>
    </Fragment>
  );
}
