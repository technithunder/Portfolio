import React, {FC, JSX} from 'react';
import {ActivityIndicator, Modal, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import styles from './styles';
import Typography from '../Typo';
import {COLORS} from '../../config/colors';
import Button from '../button';
import FastImage from 'react-native-fast-image';
import {Images} from '../../config';
import {commonSty} from '../../theme';

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
  loading?: boolean;
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
    loading,
  } = props;
  return (
    <Modal visible={open} transparent onRequestClose={handleClose}>
      <View style={commonSty.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <FastImage
              resizeMode="contain"
              source={Images.new_app_logo}
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
                txtClr={COLORS.APP_PRIMARY_MAIN}
                width={moderateScale(120)}
                borderRadius={moderateScale(4)}
                title={cancelLabel}
                borderColor={COLORS.APP_PRIMARY_MAIN}
              />
            )}
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                backgroundColor: COLORS.APP_PRIMARY_MAIN,
                height: moderateScale(40),
                width: moderateScale(120),
                borderRadius: moderateScale(4),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.APP_WHITE} />
              ) : (
                <Typography
                  color={COLORS.APP_WHITE}
                  txtStyle={[styles.btnTextStyle]}
                  title={submitLabel}
                  size={18}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConfirmModal;
