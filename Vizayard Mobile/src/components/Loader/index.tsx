import {
  ActivityIndicator,
  ModalProps,
  StyleSheet,
  Modal,
  View,
} from 'react-native';
import React from 'react';
import {commonSty} from '../../theme';
import {COLORS} from '../../config/colors';

// type Props = {}
interface loaderPrp extends ModalProps {}

const Loader = (props: loaderPrp) => {
  return (
    <Modal {...props} transparent={true} statusBarTranslucent>
      <View style={commonSty.modalContainer}>
        <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({});
