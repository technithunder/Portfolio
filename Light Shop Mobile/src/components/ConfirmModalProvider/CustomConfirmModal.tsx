import React, {FC, JSX} from 'react';
import {Modal, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import styles from './styles';
import Typography from '../Typo';
import Button from '../button';
import FastImage from 'react-native-fast-image';
import {colors, commonSty} from '../../theme';
import {Images} from '../../constants';
import { COLORS } from '../../theme/colors';

interface CustomConfirmModalProps {
  open: boolean;
  message?: string | JSX.Element;
  title?: string | JSX.Element;
  icon?: JSX.Element;
  submitLabel: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  handleCancel?: () => void;
  handleConfirm: () => void;
  handleClose?: () => void;
  handleSecondary?: () => void;
}

const CustomConfirmModal: FC<CustomConfirmModalProps> = props => {
  const {
    open,
    message,
    title,
    icon,
    submitLabel,
    cancelLabel,
    handleCancel,
    handleConfirm,
    handleClose,
  } = props;
  return (
    <Modal visible={open} transparent onRequestClose={handleClose}>
      <View style={commonSty.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <FastImage
              resizeMode="contain"
              source={Images.logo}
              style={commonSty.size(26)}
            />
            <Typography title={title ? title : 'Vizayard'} ml={10} />
          </View>

          <View style={styles.body}>
            {typeof message === 'string' ? (
              <Typography title={message} align="left" size={16} mt={10} />
            ) : (
              message
            )}
          </View>

          <View style={cancelLabel ? styles.footer : {}}>
            {cancelLabel && (
              <Button
                onPress={handleCancel}
                backgroundColor="transparent"
                height={moderateScale(40)}
                txtClr={"red"}
                width={moderateScale(120)}
                title={cancelLabel}
                borderColor={"red"}
              />
            )}
            <Button
              onPress={handleConfirm}
              backgroundColor={COLORS.APP_PRIMARY}
              height={moderateScale(cancelLabel ? 40 : 45)}
              width={moderateScale(cancelLabel ? 120 : 280)}
              title={submitLabel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConfirmModal;
