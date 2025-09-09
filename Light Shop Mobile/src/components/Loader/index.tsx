import {
  ActivityIndicator,
  ModalProps,
  StyleSheet,
  Modal,
  View,
} from 'react-native';
import React from 'react';
import {colors, commonSty} from '../../theme';

// type Props = {}
interface loaderPrp extends ModalProps {}

const Loader = (props: loaderPrp) => {
  return (
    <Modal {...props} transparent={true} statusBarTranslucent>
      <View style={commonSty.modalContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({});
