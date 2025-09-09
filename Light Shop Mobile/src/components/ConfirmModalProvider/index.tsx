import React, {createContext, useContext, useState} from 'react';
import CustomModal from './CustomModal';

// Create a context for managing modal state
const ModalContext = createContext();

// Custom hook to use the modal context
export const useModal = () => useContext(ModalContext);

// ModalProvider component to wrap your application and manage modal state
export const ConfirmModalProvider = ({children}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [modalContent, setModalContent] = useState({
    message: '',
    onOkay: () => {},
    onCancel: () => {},
  });

  // Function to show the modal with specified content
  const showModal = (
    message: 'string',
    onOkay?: () => void,
    onCancel?: () => void,
  ) => {
    setModalContent({message, onOkay, onCancel});
    setModalVisible(true);
  };

  // Function to hide the modal
  const hideModal = () => setModalVisible(false);

  return (
    <ModalContext.Provider value={{showModal, hideModal}}>
      {children}
      <CustomModal
        visible={modalVisible}
        message={modalContent.message}
        onCancel={() => {
          hideModal();
          if (modalContent.onCancel) modalContent.onCancel();
        }}
        onOkay={() => {
          hideModal();
          if (modalContent.onOkay) modalContent.onOkay();
        }}
      />
    </ModalContext.Provider>
  );
};
